import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    // Check for Authorization header and Bearer prefix
    if (!authHeader?.startsWith("Bearer ")) {
        const error = new Error("Unauthorized: No token provided");
        error.statusCode = 401;
        throw error;
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET_KEY,
        (err, decoded) => {
            if (err) {
                return res.status(403).json({ 
                    status: "error", 
                    message: "Forbidden: Invalid or expired token" 
                });
            }

            req.user = decoded;
            
            next();
        }
    );
});
