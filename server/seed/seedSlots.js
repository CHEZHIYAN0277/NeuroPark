// server/seed/seedSlots.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Slot from '../models/slot.js';
import { parkingSlots } from './slotData.js';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log('MongoDB connected...');

  // Clear old slots
  await Slot.deleteMany({});
  console.log('Old slots deleted.');

  // Insert new slots
  const inserted = await Slot.insertMany(parkingSlots);
  console.log(`${inserted.length} slots inserted.`);

  mongoose.disconnect();
}).catch(err => {
  console.error('MongoDB connection error:', err);
});
