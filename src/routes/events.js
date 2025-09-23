const express = require('express');
const eventsController = require('../controllers/eventsController');
const { authMiddleware, adminMiddleware } = require('../middlewares/auth');
const { uploadFlyer } = require('../middlewares/multerConfig');

const router = express.Router();

// Rotas públicas
router.get('/', eventsController.getAllEvents);
router.get('/:id', eventsController.getEventById);
router.get('/:id/summary', eventsController.getEventSummary);

// Rotas protegidas (admin)
router.post('/', authMiddleware, adminMiddleware, uploadFlyer.single('flyer'), eventsController.createEvent);
router.put('/:id', authMiddleware, adminMiddleware, uploadFlyer.single('flyer'), eventsController.updateEvent);
router.delete('/:id', authMiddleware, adminMiddleware, eventsController.deleteEvent);

module.exports = router;