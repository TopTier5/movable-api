// Routes/authRoutes.js
import express from 'express';
import { loginUser, registerUser, logoutUser } from '../Controllers/authController.js';
import { userUploadMiddleware } from '../Middleware/uploadMiddleware.js';
import { verifyToken } from '../Middleware/authMiddleware.js';

const router = express.Router();

// Register with uploads
router.post('/register', userUploadMiddleware, registerUser);

// Login
router.post('/login', loginUser);

// Logout placeholder
router.post('/logout', logoutUser);

// Protected: Get logged-in user's profile
router.get('/profile', verifyToken, (req, res) => {
  res.status(200).json({
    message: 'User profile loaded',
    user: req.user
  });
});

export default router;
