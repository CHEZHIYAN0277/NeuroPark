// server/models/slot.js
import mongoose from 'mongoose';

const slotSchema = new mongoose.Schema({
  _id: { type: String }, // 👈 allow custom string-based _id
  slotNumber: String,
  floor: String,
  section: String,
  distance: String,
  power: String,
  price: String,
  status: { type: String, enum: ['available', 'busy', 'offline'] },
  amenities: [String],
  rating: Number,
  reviews: Number,
  coordinates: {
    lat: Number,
    lng: Number,
  },
}, { timestamps: true });

const Slot = mongoose.model('Slot', slotSchema);
export default Slot;
