const express = require('express');
const purchasesController = require('../controllers/purschasesController');
const { authMiddleware, adminMiddleware } = require('../middlewares/auth');
const { uploadProof } = require('../middlewares/multerConfig');

const router = express.Router();

// Rotas para usuários
router.post('/', authMiddleware, uploadProof.single('paymentProof'), purchasesController.createPurchase);
router.get('/my-purchases', authMiddleware, purchasesController.getUserPurchases);

// Rotas para admin
router.get('/', authMiddleware, adminMiddleware, purchasesController.getAllPurchases);
router.patch('/:id/status', authMiddleware, adminMiddleware, purchasesController.updatePurchaseStatus);

module.exports = router;