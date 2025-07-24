// Routes/authRoutes.js
import express from 'express';
import upload from '../Middleware/multer.js';
import {
  registerUser,
  registerDriver,
  registerAdmin,
  loginUser,
} from '../Controllers/authController.js';
import editProfile from '../Controllers/profileController.js';

const router = express.Router();

// USER REGISTRATION
router.post(
  '/register',
  upload.fields([
    { name: 'ghanaCard', maxCount: 2 },
    { name: 'medicalRecords', maxCount: 5 },
  ]),
  registerUser
);

// DRIVER REGISTRATION
router.post(
  '/register/driver',
  upload.fields([{ name: 'driverLicense', maxCount: 2 }]),
  registerDriver
);

// ADMIN REGISTRATION
router.post(
  '/register/admin',
  upload.fields([{ name: 'ghanaCard', maxCount: 2 }]),
  registerAdmin
);

// LOGIN (ALL ROLES)
router.post('/login', loginUser);

// PROFILE UPDATE
router.put('/profile/:userId', editProfile);

export default router;
