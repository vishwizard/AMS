import express from 'express';
import { register, login } from '../controllers/auth.controller.js';
import authenticateJWT from '../middlewares/authenticate.js';
import authorize from '../middlewares/authorize.js';

const router = express.Router();

// Public Routes
router.post('/register', register);
router.post('/login', login);

// Protected Route (only accessible to admins)
router.get('/admin', authenticateJWT, authorize('admin'), (req, res) => {
    res.json({ message: 'Welcome to the admin panel' });
});

export default router;
