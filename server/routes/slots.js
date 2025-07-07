import express from 'express';
import Slot from '../models/slot.js';
import Booking from '../models/booking.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// ✅ Book a slot
router.post('/book/:slotId', verifyToken, async (req, res) => {
  try {
    const { slotId } = req.params;
    const { vehicleNumber, durationInMinutes } = req.body;
    const userId = req.user.id;

    const slot = await Slot.findById(slotId);
    if (!slot) return res.status(404).json({ message: 'Slot not found' });
    if (slot.status !== 'available') return res.status(400).json({ message: 'Slot is not available' });

    const booking = new Booking({
      slot: slotId,
      userId,
      vehicleNumber,
      durationInMinutes,
      bookedAt: new Date(),
      status: 'active',
    });

    await booking.save();

    slot.status = 'busy';
    await slot.save();

    res.status(201).json({ message: 'Slot booked successfully', booking });
  } catch (error) {
    console.error('Booking error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ✅ Cancel a booking
router.post('/cancel/:bookingId', verifyToken, async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    const slot = await Slot.findById(booking.slot);
    if (!slot) return res.status(404).json({ message: 'Associated slot not found' });

    booking.status = 'cancelled';
    await booking.save();

    slot.status = 'available';
    await slot.save();

    res.status(200).json({ message: 'Booking cancelled and slot released' });
  } catch (error) {
    console.error('Cancellation error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;


// ✅ GET all available slots - /api/slots/available
router.get('/available', async (req, res) => {
  try {
    const availableSlots = await Slot.find({ status: 'available' });
    res.json(availableSlots);
  } catch (err) {
    console.error('Error fetching available slots:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

