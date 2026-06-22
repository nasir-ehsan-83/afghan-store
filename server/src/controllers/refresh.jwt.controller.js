import jwt from "jsonwebtoken";
import { UserModel } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const handleRefreshToken = asyncHandler(async (req, res) => {
    const cookies = req.cookies;

    // Check if the JWT cookie exists in the request
    if (!cookies?.jwt) {
        return res.sendStatus(401); // Unauthorized
    }

    // Extract the refresh token from cookies
    const refreshToken = cookies.jwt;

    // Find the user who owns this refresh token in the database
    const foundUser = await UserModel.findOne({ refresh_token: refreshToken });

    // If no user matches this token, return forbidden
    if (!foundUser) {
        return res.sendStatus(403); // Forbidden
    }

    // Verify the validity of the refresh token
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET_KEY,
        (err, decoded) => {
            // Return forbidden if token is expired, tampered with, or user mismatched
            if (err || foundUser.username !== decoded.username) {
                return res.sendStatus(403); // Forbidden
            }

            // Generate a new short-lived access token with the original user payload
            const accessToken = jwt.sign(
                {
                    "id": foundUser._id,
                    "name": foundUser.name,
                    "username": foundUser.username,
                    "email": foundUser.email
                },
                process.env.ACCESS_TOKEN_SECRET_KEY,
                { expiresIn: "100s" }
            );

            // Send the new access token back to the client
            return res.json({ accessToken });
        }
    );
});
