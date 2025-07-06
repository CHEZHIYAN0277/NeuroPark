import express from 'express';
import { startCharging, stopCharging } from '../controllers/chargingController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/start', verifyToken, startCharging);
router.post('/stop', verifyToken, stopCharging);

export default router;
