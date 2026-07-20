import { asyncHandler } from "../utils/async.handler.js";
import { forbidden, unauthorized } from "../utils/error.js";

export const checkRole = (allowedRoles) => {
    return asyncHandler(async (req, res, next) => {

        if (!req.user || !req.user.role) {
            return unauthorized("No user or role found on request object.");
        }

        const userRoleStr = String(req.user.role).toUpperCase().trim();

        const cleanAllowedRoles = allowedRoles.map((role) => {
            String(role).toUpperCase().trim()
        });

        if (!cleanAllowedRoles.includes(userRoleStr)) {
            return forbidden(`Forbidden: Your role (${userRoleStr}) is not allowed.`);
        }

        next();
    });
};
