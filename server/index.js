// server/index.js
import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import { initSocket, io } from './socket.js';

import authRoutes from './routes/auth.js';
import bookingRoutes from './routes/booking.js';
import slotRoutes from './routes/slot.js';
import { verifyToken } from './middleware/authMiddleware.js'; // ✅ Add this line

dotenv.config();

const app = express();
const server = http.createServer(app);

// Initialize WebSocket
initSocket(server);

// Middleware
app.use(cors());
app.use(express.json());

// Attach socket.io to every request
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use('/api/auth', authRoutes);                 // Public: Register, Login
app.use('/api/bookings', verifyToken, bookingRoutes);  // ✅ Protected
app.use('/api/slots', slotRoutes);               // Public + selectively protected inside

// Test route
app.get('/', (req, res) => {
  res.send('NeuroPark API is running');
});

// MongoDB and server start
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected');
  const PORT = process.env.PORT || 5001;
  server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});
