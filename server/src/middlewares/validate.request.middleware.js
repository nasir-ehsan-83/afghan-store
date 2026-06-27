import { ZodError } from 'zod';

export const validateRequest = (schema) => (req, res, next) => {
    try {
        const validatedData = schema.parse({
            body: req.body,
            query: req.query,
            params: req.params
        });

        // FIX: Mutate or use Object.assign instead of direct assignment (=)
        req.body = validatedData.body;
        
        // Clear old query properties and assign new, validated ones
        if (validatedData.query) {
            Object.keys(req.query).forEach(key => delete req.query[key]);
            Object.assign(req.query, validatedData.query);
        }
        
        // Clear old param properties and assign new, validated ones
        if (validatedData.params) {
            Object.keys(req.params).forEach(key => delete req.params[key]);
            Object.assign(req.params, validatedData.params);
        }

        return next();
    } catch (error) {
        console.error(error);

        if (error instanceof ZodError) {
            return res.status(400).json({
                status: "error",
                errors: error.errors.map(err => ({
                    field: err.path.join('.'), 
                    message: err.message 
                }))
            });
        }

        return next(error);
    }
}
