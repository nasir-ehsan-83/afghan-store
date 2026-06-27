import { z } from 'zod';
import mongoose from 'mongoose';

export const createUserSchema = z.object({
    body: z.strictObject({
        name: z.string().min(3, "Name's length should not be less than 3"),
        username: z.string().min(3, "Username's length should not be less than 3"),
        email: z.string().email("Invalid email format").min(7),
        password: z.string().min(8, "Password length should not be less than 8"),
        role: z.enum(["USER", "ADMIN"], {
            errorMap: () => ({ 
                message: "Role must be either USER or ADMIN" 
            })
        }).optional() 
    })
});

export const userResponseSchema = z.object({
    _id: z.union([z.string(), z.object({ toString: z.function().returns(z.string()) })]),
    username: z.string(),
    email: z.string().email(),
    role: z.string()
}).transform((data) => ({
    id: data._id.toString(),
    name: data.name,
    username: data.username,
    email: data.email,
    role: data.role
}));

export const allUsersResponseSchema = z.object({
    users: z.array(userResponseSchema)
});

export const updateUserSchema = z.object({
    body: z.strictObject({
        name: z.string().min(3, "Name's length should not be less than 3"),
        username: z.string().min(3, "Username's length should not be less than 3"),
        email: z.string().email("Invalid email format").min(10),
        password: z.string().min(8, "Password length should not be less than 8"),
    }).partial() // use partial to make fields optional
});

export const getUserParamsSchema = z.object({
    params: z.object({
        id: z.string().refine(
            (val) => mongoose.Types.ObjectId.isValid(val), 
            {
                message: "Invalid User ID format",
            }
        ),
    }),
});
