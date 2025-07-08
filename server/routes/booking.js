// server/routes/booking.js
import express from 'express';
import Booking from '../models/booking.js';
import Slot from '../models/slot.js';

const router = express.Router();

// Create new booking
router.post('/', async (req, res) => {
  try {
    const { user, slot, vehicleNumber, durationInMinutes } = req.body;

    const booking = await Booking.create({
      user,
      slot,
      vehicleNumber,
      durationInMinutes,
    });

    // Mark slot as busy
    await Slot.findByIdAndUpdate(slot, { status: 'busy' });

    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Cancel booking
router.post('/cancel/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    booking.status = 'cancelled';
    await booking.save();

    await Slot.findByIdAndUpdate(booking.slot, { status: 'available' });

    res.json({ message: 'Booking cancelled successfully', booking });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
