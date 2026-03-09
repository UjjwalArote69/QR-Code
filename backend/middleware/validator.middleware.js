import { z } from 'zod';

export const validate = (schema) => (req, res, next) => {
    try {
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        next();
    } catch (e) {
        return res.status(400).json({ errors: e.errors });
    }
};

// Specific schema for registration
export const registerSchema = z.object({
    body: z.object({
        name: z.string().min(2, "Name is too short"),
        email: z.string().email("Invalid email format"),
        password: z.string().min(6, "Password must be at least 6 characters"),
    }),
});