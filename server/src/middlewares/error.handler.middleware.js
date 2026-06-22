export const errorHandler = (err, req, res, next) => {
    console.error(`[Error] ${err.message}`);

    const statusCode = err.statusCode || 500;

    // send error as json
    return res.status(statusCode).json({
        status: "error",
        message: err.message || "Internal server error",
    });
}