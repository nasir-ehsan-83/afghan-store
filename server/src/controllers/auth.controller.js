import { UserModel } from "../models/user.model"; 
import bcrypt from "bcryptjs"; 
import jwt from "jsonwebtoken"; 

// Handle user registration
export const registerUser = async (req, res) => { 
    try {
        // Extract user details from request body
        const { name, username, email, password } = req.body; 

        // Check if user already exists by email or username using $or array structure
        const userExist = await UserModel.exists({ 
            $or: [{ email }, { username }] 
        }); 

        // Return error and stop execution if user already exists
        if (userExist) { 
            return res.status(400).json({ 
                status: "error", 
                message: "User already exists!" 
            }); 
        } 

        // Hash the password securely using bcrypt
        const hashPassword = await bcrypt.hash(password, 10); 

        // Create new user record in the database
        await UserModel.create({ 
            name, 
            username, 
            email, 
            password: hashPassword 
        }); 

        return res.status(200).json({ 
            success: true, 
            message: "User registered successfully" 
        }); 
    
    } catch (error) {
        // Handle server errors
        return res.status(500).json({ 
            status: "error", 
            message: error.message 
        });
    }
}; 

// Handle user login
export const loginUser = async (req, res) => { 
    try {
        // Extract credentials from request body
        const { username, password } = req.body; 

        // Find user by their username
        const user = await UserModel.findOne({ username }); 

        // Return error if user does not exist
        if (!user) { 
            return res.status(404).json({ 
                status: "error", 
                message: "User does not exist!" 
            }); 
        } 

        // Compare the provided password with the hashed password in database
        const passwordMatch = await bcrypt.compare(password, user.password); 

        // Return error if passwords do not match
        if (!passwordMatch) { 
            return res.status(400).json({ 
                status: "error", 
                message: "Password is not correct" 
            }); 
        } 

        // Generate short-lived access token
        const accessToken = jwt.sign( 
            { 
                "id": user._id, 
                "name": user.name, 
                "username": user.username, 
                "email": user.email 
            }, 
            process.env.ACCESS_TOKEN_SECRET_KEY, 
            { expiresIn: "100s" } 
        ); 

        // Generate long-lived refresh token
        const refreshToken = jwt.sign( 
            { 
                "id": user._id, 
                "name": user.name, 
                "username": user.username, 
                "email": user.email 
            }, 
            process.env.REFRESH_TOKEN_SECRET_KEY, 
            { expiresIn: "1d" } 
        ); 

        // Store the refresh token in the database for session validation
        await UserModel.updateOne(
            { _id: user._id }, 
            { "refresh_token": refreshToken }
        ); 

        // Send refresh token as a secure httpOnly cookie (valid for 24 hours)
        res.cookie( 
            "jwt", 
            refreshToken, 
            { 
                httpOnly: true, 
                maxAge: 24 * 60 * 60 * 1000 
            } 
        ); 

        // Send access token back as JSON response
        return res.json({ accessToken }); 
    
    } catch (error) {
        // Handle server errors
        return res.status(500).json({ 
            status: "error", 
            message: error.message 
        });
    }
}
