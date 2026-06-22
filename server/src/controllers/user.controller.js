import bcrypt from "bcryptjs";

import { UserModel } from "../models/user.model.js";
import { asyncHandler } from "../utils/async.handler.js";

export const createUser = asyncHandler(async (req, res) => {
    // Extract user details from request body
    const { name, username, email, password } = req.body; 

    // Check if user already exists 
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
