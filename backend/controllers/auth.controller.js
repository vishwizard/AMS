import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { JWT_SECRET, JWT_EXPIRATION } from '../config/jwtConfig.js';
import asyncHandler from '../utils/AsyncHandler.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import { z } from 'zod';

const userSchema = z.object({
    username: z.string(),
    password: z.string(),
    role: z.string().optional().default('user').refine((role) => ['user', 'admin', 'developer'].includes(role), {
        message: "Invalid role",
    }),
});

export const register = asyncHandler(async (req, res) => {
    const { username, password, role } = req.body;

    const parsedData = userSchema.safeParse({ username, password, role });
    if (!parsedData.success) {
        throw new ApiError(400, {}, "Failed to validate");
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
        throw new ApiError(409, {}, "Username already taken");
    }

    const newUser = new User({ username, password, role });
    const response = await newUser.save().select('-password');
    console.log(response);
    res.status(201).json(new ApiResponse(201, response, 'User registered successfully'));
});


export const login = asyncHandler(async (req, res) => {
    const { username, password } = req.body; // Use req.body instead of req.params
    console.log(req.body);
    if (!username || !password) {
        throw new ApiError(400, {}, "Username and Password are required");
    }

    const user = await User.findOne({ username });
    if (!user) {
        throw new ApiError(404, {}, "User not found");
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        throw new ApiError(401, {}, "Invalid credentials");
    }

    const token = jwt.sign({ id:user._id,username: username, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });

    const response ={
        username:user.username,
        role:user.role,
        token:token
    }
    res.status(200).json(new ApiResponse(200,response,"Login Successful"));
});


export const getUserProfile = asyncHandler(async (req, res) => {
    const userId = req.user.id; 

    const user = await User.findById(userId).select('-password'); // Exclude password from the response
    if (!user) {
        throw new ApiError(404, {}, "User not found");
    }

    res.status(200).json(new ApiResponse(200, user, "User profile fetched successfully"));
});


