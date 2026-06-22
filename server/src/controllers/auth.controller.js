import bcrypt from "bcryptjs"; 
import jwt from "jsonwebtoken"; 
import { UserModel } from "../models/user.model.js"; 
import { asyncHandler } from "../utils/asyncHandler.js";

export const registerUser = asyncHandler(async (req, res) => {
    // Extract user details from request body
    const { name, username, email, password } = req.body; 

    // Check if user already exists (database query)
    const userExist = await UserModel.exists({ 
        $or: [{ email }, { username }] 
    }); 

    if (userExist) { 
        // Custom error for the global handler
        const error = new Error("User already exists!");
        error.statusCode = 400;
        throw error;
    } 

    // Hash password securely
    const hashPassword = await bcrypt.hash(password, 10); 

    // Create record
    await UserModel.create({ 
        name, 
        username, 
        email, 
        password: hashPassword 
    }); 

    return res.status(201).json({ 
        success: true, 
        message: "User registered successfully" 
    }); 
}); 

export const loginUser = asyncHandler(async (req, res) => {
    const { username, password } = req.body; 

    // Find user
    const user = await UserModel.findOne({ username }); 

    if (!user) { 
        const error = new Error("Invalid credentials: User does not exist");
        error.statusCode = 404;
        throw error;
    } 

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password); 

    if (!passwordMatch) { 
        const error = new Error("Invalid credentials: Correct password required");
        error.statusCode = 401;
        throw error;
    } 

    // Token Payload
    const userPayload = { 
        id: user._id, 
        name: user.name, 
        username: user.username, 
        email: user.email 
    };

    // Generate Tokens
    const accessToken = jwt.sign( 
        userPayload, 
        process.env.ACCESS_TOKEN_SECRET_KEY, 
        { expiresIn: "15m" } // Changed from 100s to 15m for better UX
    ); 

    const refreshToken = jwt.sign( 
        userPayload, 
        process.env.REFRESH_TOKEN_SECRET_KEY, 
        { expiresIn: "1d" } 
    ); 

    // Save Refresh Token to DB
    await UserModel.updateOne(
        { _id: user._id }, 
        { refresh_token: refreshToken }
    ); 

    // Set secure cookie
    res.cookie("jwt", refreshToken, { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === "production", // Secure in production
        sameSite: "Strict",
        maxAge: 24 * 60 * 60 * 1000 
    }); 

    return res.json({ accessToken }); 
});
