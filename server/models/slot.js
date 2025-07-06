import mongoose from 'mongoose';

const slotSchema = new mongoose.Schema({
  slotNumber: { type: String, required: true, unique: true },
  isAvailable: { type: Boolean, default: true },
  isCharging: { type: Boolean, default: false },
  location: {
    x: Number,
    y: Number, // for shortest-distance logic
  },
});

export default mongoose.model('Slot', slotSchema);
