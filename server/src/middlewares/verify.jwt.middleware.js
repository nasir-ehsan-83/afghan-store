import jwt from "jsonwebtoken";

export const verifyJWT = (req, res, next) => {
    try {    
        const authHeader = req.headers.authorization || req.headers.Authorization;

        // Check if the header exists and starts with "Bearer "
        if (!authHeader?.startsWith("Bearer ")) {
            return res.status(401).json({ 
                status: "error", 
                message: "Unauthorized: No token provided" 
            });
        }

        // get token from header
        const token = authHeader.split(' ')[1];

        // verify token 
        jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET_KEY,
            (err, decoded) => {
                if (err) {
                    // Return forbidden if token is expired or altered
                    return res.status(403).json({ 
                        status: "error", 
                        message: "Forbidden: Invalid or expired token" 
                    });
                }
                req.user = decoded;

                next();
            }
        );
    } catch(error) {
        // Handle unexpected server errors
        return res.status(500).json({ 
            status: "error", 
            message: error.message 
        });
    }
};