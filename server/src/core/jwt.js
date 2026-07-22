import jwt from "jsonwebtoken";

export const createAccessToken = (userPayload) => {

    return jwt.sign(
        userPayload,
        process.env.ACCESS_TOKEN_SECRET_KEY,
        { expiresIn: "15m" }
    );

};

export const verifyAccessToken = (accessToken) => {

    return jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET_KEY
    );

};

export const createRefreshToken = (userPayload) => {

    return jwt.sign(
        userPayload,
        process.env.REFRESH_TOKEN_SECRET_KEY,
        { expiresIn: "1d" }
    )

};

export const verifyRefreshToken = (refreshToken) => {

    return jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET_KEY
    );

}