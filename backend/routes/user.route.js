import express from 'express';
import { register, login, getProfile, logout } from '../controllers/user.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validate, registerSchema, loginSchema } from '../middleware/validator.middleware.js';

const router = express.Router();

// Public Routes
router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/logout', logout);

// Private Routes (Require JWT via Cookie)
router.get('/profile', protect, getProfile);

export default router;