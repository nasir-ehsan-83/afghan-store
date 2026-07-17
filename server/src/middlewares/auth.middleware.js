import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/async.handler.js";
import { UserModel } from "../models/user.model.js";

export const getCurrentUser = asyncHandler(async (req, res, next) => {
    // get authorization token from req.headers
    const authHeader = req.headers.authorization || req.headers.Authorization;

    // if authorization-token is not provided or the token type is not Bearer
    if (!authHeader?.startsWith("Bearer ")) {
        const error = new Error("Unauthorized: No token provided");
        error.statusCode = 401;
        throw error;
    }

    // make authHeader an array and get its second element 
    const token = authHeader.split(' ')[1];

    try {
        // decode jwt-token and get user's details
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);
        
        // check if user exist
        const userExists = await UserModel.findById(decoded.id);
        
        // if user does not exist
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
