import express from 'express';
import { register, login } from '../controllers/user.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validate, registerSchema } from '../middleware/validator.middleware.js';

const router = express.Router();

// Public Routes
router.post('/register', validate(registerSchema), register);
router.post('/login', login);

// Private Routes (Require JWT)
// router.get('/profile', protect, getProfile);

export default router;