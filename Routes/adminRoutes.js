// Routes/adminRoutes.js
import express from 'express';
import { protect, allowRoles } from '../Middleware/authMiddleware.js';

const router = express.Router();

router.get(
  '/dashboard-data',
  protect,
  allowRoles('admin'),
  (req, res) => {
    res.json({
      message: 'Welcome to the Admin Dashboard!',
      user: {
        id: req.user._id,
        fullName: req.user.fullName,
        role: req.user.role,
      },
      data: {
        totalUsers: 1500,
        pendingRides: 50,
        activeDrivers: 20,
      },
    });
  }
);

router.post(
  '/manage-users',
  protect,
  allowRoles('admin'),
  (req, res) => {
    res.json({ message: 'User management functionality (admin only).' });
  }
);

export default router;