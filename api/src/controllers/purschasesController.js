const prisma = require('../prismaClient');
const generateTicketId = require('../utils/generateTicketId');

exports.createPurchase = async (req, res) => {
  try {
    const { eventId, quantity, ticketType } = req.body;
    const userId = req.user.id;
    const paymentProof = req.file ? `/uploads/proofs/${req.file.filename}` : null;

    // Validação de entrada
    const eventIdInt = parseInt(eventId);
    const quantityInt = parseInt(quantity);
    if (!Number.isFinite(eventIdInt) || eventIdInt <= 0) {
      return res.status(400).json({ error: 'eventId inválido.' });
    }
    if (!Number.isFinite(quantityInt) || quantityInt <= 0) {
      return res.status(400).json({ error: 'quantity deve ser um inteiro positivo.' });
    }
    if (!['NORMAL', 'VIP'].includes(ticketType)) {
      return res.status(400).json({ error: 'Tipo de ingresso inválido. Use NORMAL ou VIP.' });
    }

    // Verificar se o evento existe
    const event = await prisma.event.findUnique({
      where: { id: eventIdInt }
    });

    if (!event) {
      return res.status(404).json({ error: 'Evento não encontrado.' });
    }

    // Tentar reservar ingressos de forma transacional (optimistic concurrency)
    // Decrementa availableTickets apenas se houver estoque suficiente
    const reserveResult = await prisma.event.updateMany({
      where: {
        id: eventIdInt,
        availableTickets: { gte: quantityInt }
      },
      data: {
        availableTickets: { decrement: quantityInt }
      }
    });

    if (reserveResult.count === 0) {
      return res.status(400).json({ error: 'Ingressos indisponíveis para a quantidade solicitada.' });
    }

    // Calcular valor total baseado no tipo de ingresso
    const price = ticketType === 'VIP' ? Number(event.vipPrice) : Number(event.normalPrice);
    const totalAmount = price * quantityInt;

    // Gerar ID único do ingresso
    const uniqueTicketId = generateTicketId(userId, eventIdInt);

    // Criar compra
    let purchase;
    try {
      purchase = await prisma.purchase.create({
        data: {
          userId,
          eventId: eventIdInt,
          quantity: quantityInt,
          ticketType,
          totalAmount,
          uniqueTicketId,
          paymentProof,
          status: 'PENDING'
        }
      });
    } catch (err) {
      // rollback da reserva em caso de falha
      await prisma.event.update({
        where: { id: eventIdInt },
        data: { availableTickets: { increment: quantityInt } }
      });
      throw err;
    }

    res.status(201).json({
      message: 'Compra realizada com sucesso! Aguarde validação.',
      purchase: {
        id: purchase.id,
        eventId: purchase.eventId,
        quantity: purchase.quantity,
        totalAmount: Number(purchase.totalAmount),
        uniqueTicketId: purchase.uniqueTicketId,
        status: purchase.status,
        ticketType: purchase.ticketType
      },
      paymentInfo: {
        iban: process.env.BANK_IBAN,
        phone: process.env.BANK_PHONE,
        instructions: 'Faça a transferência e envie o comprovante via WhatsApp para validação.'
      }
    });

  } catch (error) {
    console.error('Erro ao criar compra:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

exports.getUserPurchases = async (req, res) => {
  try {
    const userId = req.user.id;

    const purchases = await prisma.purchase.findMany({
      where: { userId },
      include: {
        event: {
          select: {
            title: true,
            date: true,
            startTime: true,
            endTime: true,
            flyerPath: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const normalized = purchases.map(p => ({
      ...p,
      totalAmount: Number(p.totalAmount),
      event: p.event && {
        ...p.event,
        // datas e horas já são normalizadas no eventsController, mas garantimos formato simples aqui
        date: p.event.date ? new Date(p.event.date).toISOString().slice(0, 10) : null,
        startTime: typeof p.event.startTime === 'string' ? p.event.startTime.slice(0, 5) : p.event.startTime,
        endTime: typeof p.event.endTime === 'string' ? p.event.endTime.slice(0, 5) : p.event.endTime
      }
    }));

    res.json(normalized);
  } catch (error) {
    console.error('Erro ao buscar compras:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

//função para percorrer array de compras e converter bigint para strings
function serializeBigInt(obj) {
  return JSON.parse(JSON.stringify(obj, (key, value) =>
    typeof value === 'bigint' ? value.toString() : value
  ))
}
exports.getAllPurchases = async (req, res) => {
  try {
    const purchases = await prisma.purchase.findMany({
      include: {
        user: {
          select: {
            name: true, phone: true, email: true
          }
        },
        event: {
          select: {
            title: true, date: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const safePurchases = purchases.map(p => serializeBigInt(p))
    res.json
    (safePurchases)    

  } catch (error) {
    console.error('Erro ao buscar todas as compras:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

exports.updatePurchaseStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['PENDING', 'VALIDATED', 'CANCELLED'].includes(status)) {
      return res.status(400).json({ error: 'Status inválido.' });
    }

    const purchaseId = parseInt(id);
    const existing = await prisma.purchase.findUnique({ where: { id: purchaseId } });
    if (!existing) return res.status(404).json({ error: 'Compra não encontrada.' });

    if (existing.status === status) {
      return res.json({ message: 'Status da compra já está definido.', purchase: existing });
    }

    // Ajuste de estoque baseado em transição de status
    // PENDING -> VALIDATED: nenhuma mudança (já reservou no create)
    // PENDING -> CANCELLED: devolver ingressos
    // VALIDATED -> CANCELLED: devolver ingressos
    // CANCELLED -> PENDING/VALIDATED: tentar reservar novamente

    let updated;
    if ((existing.status === 'PENDING' || existing.status === 'VALIDATED') && status === 'CANCELLED') {
      // devolver
      await prisma.event.update({
        where: { id: existing.eventId },
        data: { availableTickets: { increment: existing.quantity } }
      });
      updated = await prisma.purchase.update({ where: { id: purchaseId }, data: { status } });
    } else if (existing.status === 'CANCELLED' && (status === 'PENDING' || status === 'VALIDATED')) {
      // reservar de novo
      const reserved = await prisma.event.updateMany({
        where: { id: existing.eventId, availableTickets: { gte: existing.quantity } },
        data: { availableTickets: { decrement: existing.quantity } }
      });
      if (reserved.count === 0) {
        return res.status(400).json({ error: 'Ingressos indisponíveis para reativar esta compra.' });
      }
      updated = await prisma.purchase.update({ where: { id: purchaseId }, data: { status } });
    } else {
      // Transições que não mudam estoque
      updated = await prisma.purchase.update({ where: { id: purchaseId }, data: { status } });
    }

    res.json({
      message: 'Status da compra atualizado com sucesso!',
      purchase: updated
    });
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};