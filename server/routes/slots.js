import express from 'express';
import { getAllSlots, bookSlot, cancelBooking } from '../controllers/slotController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', verifyToken, getAllSlots);
router.post('/book/:id', verifyToken, bookSlot);
router.delete('/cancel/:id', verifyToken, cancelBooking);

export default router;
