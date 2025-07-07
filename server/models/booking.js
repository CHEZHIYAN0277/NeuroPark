import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user', // matches model name in `user.js`
    required: true
  },
  slot: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'slot', // matches model name in `slot.js`
    required: true
  },
  vehicleNumber: {
    type: String,
    required: true
  },
  durationInMinutes: {
    type: Number,
    required: true
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
});

export default mongoose.model('booking', bookingSchema);
