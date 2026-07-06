import jwt from "jsonwebtoken";
import { UserModel } from "../models/user.model.js";
import { asyncHandler } from "../utils/async.handler.js";

export const handleRefreshToken = asyncHandler(async (req, res) => {
    const cookies = req.cookies;

    // check if the JWT cookie exists in the request
    if (!cookies?.jwt) {
        return res.sendStatus(401); // Unauthorized
    }

    // extract the refresh-token from cookies
    const refreshToken = cookies.jwt;

    // find the user who owns this refresh token in the DB
    const foundUser = await UserModel.findOne({ refresh_token: refreshToken });

    // if no user matches this token
    if (!foundUser) {
        return res.sendStatus(403).json({
            status: "error",
            message: "Forbidden"
        });
    }

    // verify the refresh-token
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET_KEY,
        (err, decoded) => {
            if (err || foundUser.username !== decoded.username) {
                return res.sendStatus(403).json({
                    status: "error",
                    message: "Forbidden"
                });
            }

            // generate a new access token
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

            // send the new access token back to the client
            return res.json({ accessToken });
        }
    );
});
