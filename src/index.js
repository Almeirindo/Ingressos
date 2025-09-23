require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Importar rotas
const authRoutes = require('./routes/auth');
const eventsRoutes = require('./routes/events');
const purchasesRoutes = require('./routes/purchases');

const app = express();
const PORT = process.env.PORT || 3000;

// Criar diretórios de upload se não existirem
const uploadDirs = [
  process.env.UPLOAD_PATH,
  process.env.UPLOAD_PATH + '/flyers',
  process.env.UPLOAD_PATH + '/proofs'
];

uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/purchases', purchasesRoutes);

// Rota de saúde
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'Backend Ingressos Pro VI rodando!',
    timestamp: new Date().toISOString()
  });
});

// Rota para informações de pagamento
app.get('/api/payment-info', (req, res) => {
  res.json({
    iban: process.env.BANK_IBAN,
    phone: process.env.BANK_PHONE,
    instructions: 'Faça a transferência e envie o comprovante via WhatsApp para validação dos ingressos.'
  });
});

// Middleware de erro
app.use((error, req, res, next) => {
  console.error('Erro:', error);
  res.status(500).json({ error: 'Erro interno do servidor.' });
});

// Rota não encontrada (Express 5: evite pattern '*')
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada.' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});