// Routes/dashboardRoutes.js
import express from 'express';
import { getDashboardSummary } from '../Controllers/dashboardController.js';
import { protect } from '../Middleware/authMiddleware.js';

const router = express.Router();

router.get('/summary', protect, getDashboardSummary);

export default router;
