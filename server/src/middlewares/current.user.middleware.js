import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/async.handler.js";
import { UserModel } from "../models/user.model.js";

export const getCurrentUser = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader?.startsWith("Bearer ")) {
        const error = new Error("Unauthorized: No token provided");
        error.statusCode = 401;
        throw error;
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);
        
        const userExists = await UserModel.findById(decoded.id);
        
        if (!userExists) {
            const error = new Error("Unauthorized: User account no longer exists");
            error.statusCode = 401;
            throw error;
        }

        req.user = decoded;
        return next();

    } catch (err) {
        const error = new Error("Forbidden: Invalid or expired token");
        error.statusCode = 403;
        throw error;
    }
});
