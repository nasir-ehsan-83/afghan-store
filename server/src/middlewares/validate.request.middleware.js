import { ZodError } from 'zod';

export const validateRequest = (schema) => (req, res, next) => {
    try {
        // parse request's body with provided Zod schema
        const validatedData = schema.parse({
            body: req.body,
            query: req.query,
            params: req.params
        });

        // mutate existing objects to avoid "read-only" errors
        req.body = validatedData.body;
        Object.assign(req.query, validatedData.query);
        Object.assign(req.params, validatedData.params);

        return next();
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({
                status: "error",
                errors: error.issues.map(issue => ({
                    field: issue.path.join('.'), 
                    message: issue.message 
                }))
            });
        }

        // if no errors continue other process
        return next(error);
    }
}
