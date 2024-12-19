import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/jwtConfig.js';

const authenticateJWT = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        req.user = user;  // Add user info to request
        next();
    });
};

export default authenticateJWT;
