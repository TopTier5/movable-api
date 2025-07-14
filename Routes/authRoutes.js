// Routes/authRoutes.js
import express from 'express';
import upload from '../Middleware/multer.js';

import {
  registerUser,
  registerRider,
  registerAdmin,
  loginUser,
} from '../Controllers/authController.js';

const router = express.Router();

// General user registration
router.post('/register', upload.fields([
  { name: 'ghanaCard', maxCount: 2 },
  { name: 'medicalRecords', maxCount: 5 },
]), registerUser);

// Rider registration
router.post('/register-rider', upload.fields([
  { name: 'driverLicense', maxCount: 2 },
]), registerRider);

// Admin registration
router.post('/register-admin', upload.fields([
  { name: 'ghanaCard', maxCount: 2 },
]), registerAdmin);

// Login (all roles)
router.post('/login', loginUser);

export default router;
