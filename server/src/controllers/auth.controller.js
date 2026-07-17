import bcrypt from "bcryptjs"; 
import jwt from "jsonwebtoken"; 
import { UserModel } from "../models/user.model.js"; 
import { asyncHandler } from "../utils/async.handler.js";
import { 
    AppError,
    forbidden,
    notFound,
    unauthorized
 } from "../utils/error.js";


export const handleLoginUser = asyncHandler(async (req, res) => {
    const { username, password } = req.body; 

    // find user
    const user = await UserModel.findOne({ username }); 

    if (!user) { 
        return notFound("User does not exist");
    } 

    // compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password); 

    if (!passwordMatch) { 
        return unauthorized("Correct password required");
    } 

    // token Payload
    const userPayload = { 
        id: user._id,
        name: user.name,
        role: user.role
    };

    // generate Tokens
    const accessToken = jwt.sign( 
        userPayload, 
        process.env.ACCESS_TOKEN_SECRET_KEY, 
        { expiresIn: "15m" }
    ); 

    const refreshToken = jwt.sign( 
        userPayload, 
        process.env.REFRESH_TOKEN_SECRET_KEY, 
        { expiresIn: "1d" } 
    ); 

    // save Refresh-Token to DB
    await UserModel.updateOne(
        { _id: user._id }, 
        { refresh_token: refreshToken }
    ); 

    // set secure cookie
    res.cookie("jwt", refreshToken, { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === "production", // Secure in production
        sameSite: "Strict",
        maxAge: 24 * 60 * 60 * 1000 
    }); 

    return res.json({ 
        accessToken,
        userPayload
    }); 
});



export const handleRefreshToken = asyncHandler(async (req, res) => {
    const cookies = req.cookies;

    // check if the JWT cookie exists in the request
    if (!cookies?.jwt) {
        return unauthorized()
    }

    // extract the refresh-token from cookies
    const refreshToken = cookies.jwt;

    // find the user who owns this refresh token in the DB
    const foundUser = await UserModel.findOne({ refresh_token: refreshToken });

    // if no user matches this token
    if (!foundUser) {
        return forbidden("Forbidden");
    }

    // verify the refresh-token
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET_KEY,
        (err, decoded) => {
            if (err || foundUser.username !== decoded.username) {
                return forbidden("Forbidden");
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



export const handleLogoutUser = asyncHandler(async (req, res) => {
    const cookies = req.cookies;

    // if no cookie exist, just clear the client-side cookie and return
    if (!cookies?.jwt) {
        res.clearCookie("jwt", { 
            httpOnly: true, 
            sameSite: "None", 
            secure: true 
        });
        return AppError("", 204);
    }

    const refreshToken = cookies.jwt;

    //  find user by refresh token in DB
    const foundUser = await UserModel.findOne({ refresh_token: refreshToken });

    // if token exists in cookie but not in DB, still clear the cookie
    if (!foundUser) {
        res.clearCookie("jwt", { 
            httpOnly: true, 
            sameSite: "None", 
            secure: true 
        });
        return AppError("", 204);
    }

    // delete refresh_token from database
    await UserModel.updateOne(
        { _id: foundUser._id },
        { $set: { refresh_token: null } }
    );

    // clear jwt-token from cookies
    res.clearCookie("jwt", { 
        httpOnly: true, 
        sameSite: "None", 
        secure: true 
    });
    
    return res.sendStatus(204);
});
