import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import authRoutes from './Routes/authRoutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded form data (optional)

// Mount your authentication routes
app.use('/api/auth', authRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(process.env.PORT || 4000, () => {
      console.log(`Server running on port ${process.env.PORT || 4000}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
  });




// // server.js
// import express from 'express';
// import dotenv from 'dotenv';
// import cors from 'cors';
// import mongoose from 'mongoose';
// import authRoutes from './Routes/authRoutes.js';

// dotenv.config();

// const app = express();

// // Connect to MongoDB (leaner setup)
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log('MongoDB Connected'))
//   .catch(err => console.error('MongoDB Connection Error:', err));

// // Middleware
// app.use(cors());            // frontend access across domains
// app.use(express.json());    // Parses incoming JSON payloads

// // Role-aware routes
// app.use('/api/auth', authRoutes); // Auth routes for user, driver, admin

// // Launch the server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Movable backend is live on port ${PORT}`);
// });
