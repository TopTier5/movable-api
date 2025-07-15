// Routes/authRoutes.js
import express from 'express';
import {
  registerUser,
  registerRider,
  registerAdmin,
  loginUser
} from '../Controllers/authController.js';
import upload from '../Middleware/multer.js';

const router = express.Router();

// Register user (rider/disabled person requesting rides)
router.post('/register', upload.fields([
  { name: 'ghanaCard', maxCount: 2 },
  { name: 'medicalRecords', maxCount: 5 }
]), registerUser);

// Register rider (driver)
router.post('/register/rider', upload.fields([
  { name: 'driverLicense', maxCount: 2 }
]), registerRider);

// Register admin
router.post('/register/admin', upload.fields([
  { name: 'ghanaCard', maxCount: 2 }
]), registerAdmin);

// Login all roles
router.post('/login', loginUser);

export default router;
