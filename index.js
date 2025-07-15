// index.js
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './Routes/authRoutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('🚀 Movable API is running...');
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('🔴 Uncaught Error:', JSON.stringify(err, null, 2));
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: err.message || 'Something went wrong',
  });
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB Atlas');
}).catch((err) => {
  console.error('MongoDB connection error:', JSON.stringify(err, null, 2));
});

// Start Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on: http://localhost:${PORT}`);
});
