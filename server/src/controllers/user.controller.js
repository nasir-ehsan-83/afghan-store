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

export const getUser = asyncHandler(async (req, res) => {
   // get user from database
    const foundUser = await UserModel.findOne({
        _id: req.user.id
    });

   // if user not found
    if (!foundUser) {
        return res.status(404).json({
            status: "error",
            message: "User not found"
        });
    }

    return res.status(200).json({
        user: foundUser
    })
});

export const getAllUsers = asyncHandler(async (req, res) => {
    // get all users from database
    const foundUsers = await UserModel.findAll().toList();

    return res.status(200).json({
        users: foundUsers
    });
});