import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/async.handler.js";
import { UserModel } from "../models/user.model.js";
import { forbidden, unuathorized } from "../utils/error.js";

export const getCurrentUser = asyncHandler(async (req, res, next) => {

    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader?.startsWith("Bearer ")) {
        return unuathorized("No token provided");
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET_KEY
        );

        const userExists = await UserModel.findById(decoded.id);

        if (!userExists) {
            return unuathorized("User account no longer exists");
        }

        req.user = decoded;
        return next();

    } catch (err) {
        return forbidden("Forbidden: Invalid or expired token");
    }
});
