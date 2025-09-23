const prisma = require('../prismaClient');

// Helpers de data/hora
function padToTwoDigits(value) {
  return value.toString().padStart(2, '0');
}

function isValidTimeHHmm(value) {
  if (typeof value !== 'string') return false;
  const match = value.match(/^\s*(\d{1,2}):(\d{2})(?::\d{2})?\s*$/);
  if (!match) return false;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return false;
  // Permite 00:00..23:59 e 24:00 especificamente
  if (hours === 24) return minutes === 0;
  return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
}

function normalizeTimeHHmm(value) {
  // Aceita "H:mm", "HH:mm" e também valores com segundos "HH:mm:ss"; normaliza para "HH:mm"
  const match = typeof value === 'string' && value.match(/^\s*(\d{1,2}):(\d{2})(?::(\d{2}))?\s*$/);
  if (!match) return null;
  const rawHours = Number(match[1]);
  const rawMinutes = Number(match[2]);
  if (Number.isNaN(rawHours) || Number.isNaN(rawMinutes)) return null;
  // Preserva 24:00 especificamente
  if (rawHours === 24) {
    if (rawMinutes !== 0) return null; // 24:01 inválido
    return '24:00';
  }
  const hours = padToTwoDigits(rawHours);
  const minutes = padToTwoDigits(rawMinutes);
  return `${hours}:${minutes}`;
}

function trimSecondsFromDbTime(value) {
  // Converte "HH:MM:SS" para "HH:MM"; mantém "24:00" caso venha assim
  if (typeof value !== 'string') return value;
  const norm = normalizeTimeHHmm(value);
  return norm || value;
}

function isValidISODateOnly(value) {
  if (typeof value !== 'string') return false;
  // YYYY-MM-DD
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  // Checa se a data é válida e mantém ano-mes-dia iguais
  const [y, m, d] = value.split('-').map(Number);
  return (
    !Number.isNaN(date.getTime()) &&
    date.getUTCFullYear() === y &&
    date.getUTCMonth() + 1 === m &&
    date.getUTCDate() === d
  );
}

function toISODateOnlyString(input) {
  // Converte Date ou string para "YYYY-MM-DD" sem timezone local
  if (!input) return null;
  const date = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(date.getTime())) return null;
  const y = date.getFullYear();
  const m = padToTwoDigits(date.getMonth() + 1);
  const d = padToTwoDigits(date.getDate());
  return `${y}-${m}-${d}`;
}

function transformEventForResponse(event) {
  return {
    ...event,
    date: toISODateOnlyString(event.date),
    startTime: trimSecondsFromDbTime(event.startTime),
    endTime: trimSecondsFromDbTime(event.endTime)
  };
}

exports.getAllEvents = async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      orderBy: { date: 'asc' }
    });

    const eventsWithStats = events.map(event => ({
      ...transformEventForResponse(event),
      ticketsSold: event.totalTickets - event.availableTickets
    }));

    res.json(eventsWithStats);
  } catch (error) {
    console.error('Erro ao buscar eventos:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await prisma.event.findUnique({
      where: { id: parseInt(id) }
    });

    if (!event) {
      return res.status(404).json({ error: 'Evento não encontrado.' });
    }

    const ticketsSold = event.totalTickets - event.availableTickets;

    res.json({
      ...transformEventForResponse(event),
      ticketsSold,
      availableTickets: event.totalTickets - ticketsSold
    });
  } catch (error) {
    console.error('Erro ao buscar evento:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

exports.getEventSummary = async (req, res) => {
  try {
    const { id } = req.params;
    const eventId = parseInt(id);
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) return res.status(404).json({ error: 'Evento não encontrado.' });

    const ticketsSold = event.totalTickets - event.availableTickets;

    // Receita com base nas compras validadas
    const validated = await prisma.purchase.findMany({
      where: { eventId, status: 'VALIDATED' },
      select: { totalAmount: true }
    });
    const totalRevenue = validated.reduce((sum, p) => sum + Number(p.totalAmount), 0);

    // Pendentes (em quantidade e valor)
    const pendings = await prisma.purchase.findMany({
      where: { eventId, status: 'PENDING' },
      select: { totalAmount: true, quantity: true }
    });
    const pendingRevenue = pendings.reduce((sum, p) => sum + Number(p.totalAmount), 0);
    const pendingQuantity = pendings.reduce((sum, p) => sum + p.quantity, 0);

    res.json({
      event: transformEventForResponse(event),
      tickets: {
        total: event.totalTickets,
        sold: ticketsSold,
        available: event.availableTickets,
        pending: pendingQuantity
      },
      revenue: {
        validated: totalRevenue,
        pending: pendingRevenue
      }
    });
  } catch (error) {
    console.error('Erro ao gerar resumo do evento:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

exports.createEvent = async (req, res) => {
  try {
    const { title, description, date, startTime, endTime, totalTickets, price } = req.body;
    const flyerPath = req.file ? `/uploads/flyers/${req.file.filename}` : null;
    // Validações básicas
    if (!title || !date || !startTime || !endTime || !totalTickets || !price) {
      return res.status(400).json({ error: 'Campos obrigatórios: title, date, startTime, endTime, totalTickets, price.' });
    }
    if (!isValidISODateOnly(date)) {
      return res.status(400).json({ error: 'Formato de data inválido. Use YYYY-MM-DD.' });
    }
    const normStart = normalizeTimeHHmm(startTime);
    const normEnd = normalizeTimeHHmm(endTime);
    if (!normStart || !normEnd) {
      return res.status(400).json({ error: 'Formato de hora inválido. Use HH:mm (00-23:00-59).' });
    }
    const ticketsInt = parseInt(totalTickets);
    const priceNum = parseFloat(price);
    if (!Number.isFinite(ticketsInt) || ticketsInt <= 0) {
      return res.status(400).json({ error: 'totalTickets deve ser um inteiro positivo.' });
    }
    if (!Number.isFinite(priceNum) || priceNum < 0) {
      return res.status(400).json({ error: 'price deve ser um número >= 0.' });
    }

    const event = await prisma.event.create({
      data: {
        title,
        description: description || null,
        date: new Date(`${date}T00:00:00`),
        startTime: normStart,
        endTime: normEnd,
        totalTickets: ticketsInt,
        availableTickets: ticketsInt,
        price: priceNum,
        flyerPath
      }
    });

    res.status(201).json({
      message: 'Evento criado com sucesso!',
      event: transformEventForResponse(event)
    });
  } catch (error) {
    console.error('Erro ao criar evento:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, date, startTime, endTime, totalTickets, price } = req.body;
    const flyerPath = req.file ? `/uploads/flyers/${req.file.filename}` : undefined;

    // Monta payload com validações condicionais
    const data = {};
    if (typeof title !== 'undefined') data.title = title;
    if (typeof description !== 'undefined') data.description = description || null;
    if (typeof date !== 'undefined') {
      if (!isValidISODateOnly(date)) {
        return res.status(400).json({ error: 'Formato de data inválido. Use YYYY-MM-DD.' });
      }
      data.date = new Date(`${date}T00:00:00`);
    }
    if (typeof startTime !== 'undefined') {
      const normStart = normalizeTimeHHmm(startTime);
      if (!normStart) return res.status(400).json({ error: 'Formato de hora inválido para startTime. Use HH:mm.' });
      data.startTime = normStart;
    }
    if (typeof endTime !== 'undefined') {
      const normEnd = normalizeTimeHHmm(endTime);
      if (!normEnd) return res.status(400).json({ error: 'Formato de hora inválido para endTime. Use HH:mm.' });
      data.endTime = normEnd;
    }
    if (typeof totalTickets !== 'undefined') {
      const ticketsInt = parseInt(totalTickets);
      if (!Number.isFinite(ticketsInt) || ticketsInt <= 0) {
        return res.status(400).json({ error: 'totalTickets deve ser um inteiro positivo.' });
      }
      data.totalTickets = ticketsInt;
    }
    if (typeof price !== 'undefined') {
      const priceNum = parseFloat(price);
      if (!Number.isFinite(priceNum) || priceNum < 0) {
        return res.status(400).json({ error: 'price deve ser um número >= 0.' });
      }
      data.price = priceNum;
    }
    if (typeof flyerPath !== 'undefined') data.flyerPath = flyerPath;

    // Se atualizar totalTickets, precisamos preservar já vendidos/reservados
    if (typeof data.totalTickets !== 'undefined') {
      const current = await prisma.event.findUnique({ where: { id: parseInt(id) } });
      if (!current) return res.status(404).json({ error: 'Evento não encontrado.' });
      const reservedOrSold = current.totalTickets - current.availableTickets;
      if (data.totalTickets < reservedOrSold) {
        return res.status(400).json({ error: `totalTickets não pode ser menor que já reservados/vendidos (${reservedOrSold}).` });
      }
      // Ajusta availableTickets para manter reservas
      data.availableTickets = data.totalTickets - reservedOrSold;
    }

    const event = await prisma.event.update({
      where: { id: parseInt(id) },
      data
    });

    res.json({
      message: 'Evento atualizado com sucesso!',
      event: transformEventForResponse(event)
    });
  } catch (error) {
    console.error('Erro ao atualizar evento:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.event.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Evento deletado com sucesso!' });
  } catch (error) {
    console.error('Erro ao deletar evento:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};