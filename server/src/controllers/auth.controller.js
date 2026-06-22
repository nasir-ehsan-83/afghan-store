import bcrypt from "bcryptjs"; 
import jwt from "jsonwebtoken"; 
import { UserModel } from "../models/user.model.js"; 
import { asyncHandler } from "../utils/asyncHandler.js";

export const handleLoginUser = asyncHandler(async (req, res) => {
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


export const handleLogoutUser = asyncHandler(async (req, res) => {
    const cookies = req.cookies;

    // if no cookie exist, just clear the client-side cookie and return
    if (!cookies?.jwt) {
        res.clearCookie("jwt", { 
            httpOnly: true, 
            sameSite: "None", 
            secure: true 
        });
        return res.sendStatus(204); 
    }

    const refreshToken = cookies.jwt;

    //  find user by refresh token in DB
    const foundUser = await UserModel.findOne({ refresh_token: refreshToken });

    // if token exists in cookie but not in DB, still clear the cookie
    if (!foundUser) {
        res.clearCookie("jwt", { 
            httpOnly: true, 
            sameSite: "None", 
            secure: true 
        });
        return res.sendStatus(204);
    }

    // delete refresh_token from database
    await UserModel.updateOne(
        { _id: foundUser._id },
        { $set: { refresh_token: null } }
    );

    // clear jwt-token from cookies
    res.clearCookie("jwt", { 
        httpOnly: true, 
        sameSite: "None", 
        secure: true 
    });
    
    return res.sendStatus(204);
});
