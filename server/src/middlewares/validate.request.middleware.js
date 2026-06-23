export const validateRequest = (schema) => (req, res, next) => {
    try {
        const validatedData = schema.parse({
            body: req.body,
            query: req.query,
            params: req.params
        });

        req.body = validatedData.body;
        req.query = validatedData.query;
        req.params = validatedData.params;

        return next();
    } catch (error) {
        return res.status(400).json({
            status: "error",
            errors: error.errors.map(err => ({
                field: err.path.slice(1).join('.'), 
                message: err.message 
            }))
        });
    }
}
