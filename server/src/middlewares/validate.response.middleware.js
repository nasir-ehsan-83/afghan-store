export const validateResponse = (schema) => (req, res, next) => {
    
    const originalJson = res.json;

    res.json = function (data) {
        try {
            // filter and validate data by using the provided Zod schema
            const safeData = schema.parse(data);
            
            // send clean data to the client by using the original res.json method
            return originalJson.call(this, safeData);
        } catch (error) {
            return originalJson.call(this, {
                status: "error",
                message: "Internal Server Error: Response validation failed"
            });
        }
    };

    next();
};
