// server/models/booking.js

import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  slot: {
    type: String, // ✅ Changed from ObjectId to String to match your custom slot ID
    ref: 'slot',
    required: true
  },
  vehicleNumber: {
    type: String,
    required: true,
    trim: true
  },
  durationInMinutes: {
    type: Number,
    required: true,
    min: 1
  },
  startTime: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['active', 'cancelled', 'completed'],
    default: 'active'
  }
}, {
  timestamps: true
});

export default mongoose.model('booking', bookingSchema);
