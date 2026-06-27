import bcrypt from "bcryptjs";

import { UserModel } from "../models/user.model.js";
import { asyncHandler } from "../utils/async.handler.js";

export const createUser = asyncHandler(async (req, res) => {
    // Extract user details from request body
    const { name, username, email, password, role } = req.body; 

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
        password: hashPassword,
        role
    }); 

    return res.status(201).json({ 
        success: true, 
        message: "User registered successfully" 
    }); 
}); 

export const getUser = asyncHandler(async (req, res) => {
   // get user from database
    const foundUser = await UserModel.findById(req.params.id);

   // if user not found
    if (!foundUser) {
        return res.status(404).json({
            status: "error",
            message: "User not found"
        });
    }

    // Return exact object to match userResponseSchema
    return res.status(200).json(foundUser);
});

export const getAllUsers = asyncHandler(async (req, res) => {
    // get all users from database
    const foundUsers = await UserModel.find({});

    return res.status(200).json({
        users: foundUsers
    });
});


export const updateUser = asyncHandler(async (req, res) => {
    const id = req.user.id;

    // get user from DB
    const foundUser = await UserModel.findOne({
        _id: id
    });

    // if user does not exist
    if (!foundUser) {
        return res.status(404).json({
            status: "error",
            message: "User not found"
        });
    }

    const { name, username, email, password } = req.body;

    // fields to be updated
    const updateData = {name, username, email};

    // if user is updated
    if (password) {
        updateData.password = await bcrypt.hash(password, 10);
    }

    // update user 
    const updateUser = await UserModel.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true }
    );

    return res.status(200).json(updateUser);
});

export const deleteUser = asyncHandler(async (req, res) => {
    const id = req.user.id;

    // delete user directly from DB
    const deletedUser = await UserModel.findByIdAndDelete(id);

    // if user does not exist in DB
    if (!deletedUser) {
        return res.status(404).json({
            status: "error",
            message: "User not found"
        });
    }
     
    // clear jwt-token from cookies after deletting user 
    res.clearCookie(
        "jwt", { 
            httpOnly: true, 
            sameSite: "None", 
            secure: true 
        }
    );


    return res.status(200).json({
        message: "User deleted"
    });
});
