import express from 'express';
import { editProfile } from '../Controllers/profileController.js';
import { protect } from '../Middleware/authMiddleware.js';

const router = express.Router();

// ✅ CHANGED FROM `post` TO `put`
router.put('/edit-profile', protect, editProfile);

export default router;
