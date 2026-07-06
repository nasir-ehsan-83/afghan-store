import { object, z } from 'zod';

// implement objectIdSchema to validate MongoDB's ObjectId 
export const objectIdSchema = z.preprocess(
    (val) => val?.toString(), 
    z.string().regex(/^[0-9a-fA-F]{24}$/, {
        message: "Invalid MongoDB ObjectId"
    })
);

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
    _id: objectIdSchema,
    username: z.string(),
    email: z.string().email(),
    role: z.string()
})  // use strip to remove unexpected fields and use transform to convert MongoDB's ObjectId to a valid string
.strict()
.transform((data) => ({
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
        id: objectIdSchema,
    }),
});
