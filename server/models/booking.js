import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  slot: { type: mongoose.Schema.Types.ObjectId, ref: 'Slot', required: true },
  bookedAt: { type: Date, default: Date.now },
  durationMinutes: { type: Number, default: 60 }
});

export default mongoose.model('Booking', bookingSchema);
