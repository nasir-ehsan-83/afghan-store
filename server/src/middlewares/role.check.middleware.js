import { asyncHandler } from "../utils/async.handler.js";

export const checkRole = (allowedRoles) => {
    return asyncHandler(async (req, res, next) => {
        // if user or user.role is not provided 
        if (!req.user || !req.user.role) {
            return res.status(401).json({
                status: "error",
                message: "Unauthorized: No user or role found on request object."
            });
        }

        // make user.role as valid string
        const userRoleStr = String(req.user.role).toUpperCase().trim();
        // make allowedRoles;s elements as valid string
        const cleanAllowedRoles = allowedRoles.map(role => String(role).toUpperCase().trim());

        // if allowedRoles does not include user.role 
        if (!cleanAllowedRoles.includes(userRoleStr)) {
            return res.status(403).json({
                status: "error",
                message: `Forbidden: Your role (${userRoleStr}) is not allowed.`
            });
        }
        
        next();
    });
};
