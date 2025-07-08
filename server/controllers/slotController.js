import Slot from '../models/slot.js';
import Booking from '../models/booking.js';

export const getAllSlots = async (req, res) => {
  try {
    const slots = await Slot.find();
    res.json(slots);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch slots' });
  }
};

export const bookSlot = async (req, res) => {
  try {
    const { id } = req.params;

    const slot = await Slot.findById(id);
    if (!slot || !slot.isAvailable) {
      return res.status(400).json({ message: 'Slot not available' });
    }

    const booking = new Booking({
      user: req.user.id,
      slot: slot._id,
    });

    slot.isAvailable = false;
    slot.status = 'busy';

    await booking.save();
    await slot.save();

    // Emit WebSocket update
    const io = req.app.get('io');
    io.emit('slotStatusUpdated', slot);

    res.status(201).json({ message: 'Slot booked successfully', booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to book slot' });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id).populate('slot');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    booking.slot.isAvailable = true;
    booking.slot.status = 'available';

    await booking.slot.save();
    await booking.deleteOne();

    // Emit WebSocket update
    const io = req.app.get('io');
    io.emit('slotStatusUpdated', booking.slot);

    res.json({ message: 'Booking canceled successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to cancel booking' });
  }
};
