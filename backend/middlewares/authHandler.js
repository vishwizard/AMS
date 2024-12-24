import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/jwtConfig.js';
import asyncHandler from '../utils/AsyncHandler.js';
import ApiError from '../utils/ApiError.js';

const authenticate = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        throw new ApiError(401, {}, "Unauthorized: No token provided");
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = { id: decoded.id, role: decoded.role };
        next();
    } catch (error) {
        throw new ApiError(401, {}, "Unauthorized: Token verification failed");
    }
});

export default authenticate;


