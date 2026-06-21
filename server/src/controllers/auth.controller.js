import { UserModel } from "../models/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { success } from "zod";

export const registerUser = async (req, res) => {
    // get name, username, email and password from body
    const {name, username, email, password} = req.body;

    const userExist = UserModel.exists({
        "$or": {email, username}
    });

    if (userExist) {
        res.status(400).json({
            status: "error",
            message: "User already exists!"
        });
    }

    const hashPassword = bcrypt(password, 10);

    await UserModel.create({
        name,
        username,
        email,
        password: hashPassword
    });

    res.status(200).json({
        success: true,
        message: "User registered successfully"
    });
};