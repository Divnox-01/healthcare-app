import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth.routes';
import bookingRoutes from './routes/booking.routes';
import aiRoutes from './routes/ai.routes';
import doctorsRoutes from './routes/doctors.routes';
import symptomRoutes from './routes/symptom.routes';
import queueRoutes from './routes/queue.routes';
import ocrRoutes from './routes/ocr.routes';
import notificationRoutes from './routes/notification.routes';
import dashboardRoutes from './routes/dashboard.routes';

dotenv.config();

const app = express();
const server = http.createServer(app);

// SOCKET.IO SETUP
export const io = new Server(server, {
  cors: {
    origin: '*', // allow all for now (you can restrict later)
  },
});

// MIDDLEWARE
app.use(cors({
  origin: '*', // change later to your frontend URL
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/doctors', doctorsRoutes);
app.use('/api/symptom-history', symptomRoutes);
app.use('/api/queue', queueRoutes);
app.use('/api/ocr', ocrRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/dashboards', dashboardRoutes);

// ✅ ROOT ROUTE (THIS FIXES "Cannot GET /")
app.get('/', (req, res) => {
  res.send('🚀 Backend is running successfully');
});

// SOCKET CONNECTION
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// PORT
const PORT = process.env.PORT || 5000;

// START SERVER
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});