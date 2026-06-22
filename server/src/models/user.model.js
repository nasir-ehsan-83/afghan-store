import mongoose from "mongoose";

// Define the User Schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        // Removes unnecessary whitespace
        trim: true 
    },
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: true,
        trim: true,
        // Ensures  that"Admin" and "admin" are treated as the same
        lowercase: true 
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        lowercase: true,
        // Basic regex for email validation
        match: [/^[\w-\]+@([\w-]+\.)+[\w-]{2,4}$/, "Please enter a valid email address"]
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    refresh_token: {
        type: String,
        default: null 
    }
}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
});


export const UserModel = mongoose.model("User", userSchema);