// Routes/mapRoutes.js
import express from 'express';
import { getDistanceAndTime } from '../Controllers/mapController.js';
import { findNearbyDrivers } from '../Controllers/nearbyController.js';

const router = express.Router();

router.post('/travel-time', getDistanceAndTime);     // Distance & duration
router.post('/nearby', findNearbyDrivers);           // Find nearby drivers

export default router;
