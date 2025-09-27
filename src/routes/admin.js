const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { authMiddleware } = require('../middlewares/auth');

const prisma = new PrismaClient();

// Middleware to check if user is admin
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Acesso negado. Apenas administradores podem acessar este recurso.' });
  }
  next();
};

// Get all users with purchase counts
router.get('/users', authMiddleware, requireAdmin, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            purchases: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Transform the data to include purchasesCount
    const usersWithPurchaseCount = users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt,
      purchasesCount: user._count.purchases
    }));

    res.json(usersWithPurchaseCount);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Update user role
router.patch('/users/:id/role', authMiddleware, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['USER', 'ADMIN'].includes(role)) {
      return res.status(400).json({ error: 'Função inválida. Deve ser USER ou ADMIN.' });
    }

    // Prevent admin from removing their own admin role
    if (req.user.id === parseInt(id) && role === 'USER') {
      return res.status(400).json({ error: 'Você não pode remover sua própria função de administrador.' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true
      }
    });

    res.json(updatedUser);
  } catch (error) {
    console.error('Erro ao atualizar função do usuário:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Delete user
router.delete('/users/:id', authMiddleware, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent admin from deleting themselves
    if (req.user.id === parseInt(id)) {
      return res.status(400).json({ error: 'Você não pode excluir sua própria conta.' });
    }

    // Check if user has non-cancelled purchases
    const userWithPurchases = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      include: {
        purchases: {
          where: {
            status: {
              in: ['PENDING', 'VALIDATED']
            }
          }
        },
        _count: {
          select: {
            purchases: {
              where: {
                status: {
                  in: ['PENDING', 'VALIDATED']
                }
              }
            }
          }
        }
      }
    });

    if (!userWithPurchases) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    if (userWithPurchases._count.purchases > 0) {
      return res.status(400).json({ error: 'Não é possível excluir usuário com compras ativas (pendentes ou validadas).' });
    }

    await prisma.user.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Usuário excluído com sucesso.' });
  } catch (error) {
    console.error('Erro ao excluir usuário:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Delete all cancelled purchases for a user
router.delete('/users/:id/purchases/cancelled', authMiddleware, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) }
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    // Delete all cancelled purchases for this user
    const result = await prisma.purchase.deleteMany({
      where: {
        userId: parseInt(id),
        status: 'CANCELLED'
      }
    });

    res.json({
      message: `${result.count} compras canceladas foram excluídas com sucesso.`,
      deletedCount: result.count
    });
  } catch (error) {
    console.error('Erro ao excluir compras canceladas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;
