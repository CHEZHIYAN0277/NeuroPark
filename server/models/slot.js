import mongoose from 'mongoose';

const slotSchema = new mongoose.Schema({
  _id: { type: String }, // Example: "slot-p1-a1"

  slotNumber: { type: String },
  floor: { type: String },
  section: { type: String },
  distance: { type: String },  // Optional: Consider using Number if you plan on calculating distances
  power: { type: String },     // Example: "22kW", "None"
  price: { type: String },     // Optional: use Number + currency for future payment integration

  status: {
    type: String,
    enum: ['available', 'busy', 'offline'],
    default: 'available'
  },

  isAvailable: {
    type: Boolean,
    default: true
  },

  amenities: [{ type: String }],  // e.g. ["covered", "ev", "near elevator"]

  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },

  coordinates: {
    lat: { type: Number, default: 0 },
    lng: { type: Number, default: 0 },
  }

}, { timestamps: true });

const Slot = mongoose.model('Slot', slotSchema);
export default Slot;
