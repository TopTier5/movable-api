// Routes/rideRoutes.js
import express from 'express';
import { requestRide } from '../Controllers/rideController.js';
import { protect } from '../Middleware/authMiddleware.js';

const router = express.Router();

router.post('/request', protect, requestRide); // Protected route to request ride

export default router;
