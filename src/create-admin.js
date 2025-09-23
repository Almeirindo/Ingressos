const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
    
    const admin = await prisma.user.upsert({
      where: { email: process.env.ADMIN_EMAIL },
      update: {
        password: hashedPassword,
        role: 'ADMIN'
      },
      create: {
        name: 'Administrador',
        email: process.env.ADMIN_EMAIL,
        phone: '+244 923 456 789',
        password: hashedPassword,
        role: 'ADMIN'
      }
    });

    console.log('Admin criado/atualizado com sucesso:', admin);
  } catch (error) {
    console.error('Erro ao criar admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();