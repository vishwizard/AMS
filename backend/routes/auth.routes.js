import express from 'express';
import { register, login, getUserProfile } from '../controllers/auth.controller.js';
import authorize from '../middlewares/authorize.js';
import authenticate from '../middlewares/authHandler.js';

const router = express.Router();

// Public Routes
router.post('/register', authenticate, authorize('admin'), register);
router.post('/login', login);

// Protected Route (only accessible to admins)
router.get('/admin', authenticate, authorize('admin'), (req, res) => {
    res.json({ message: 'Welcome to the admin panel' });
});

router.get('/userinfo', authenticate, getUserProfile);

export default router;
