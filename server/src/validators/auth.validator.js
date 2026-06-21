import z from "zod";

export const registerSchema = z.object({
    body: z.object({
        name: z.string().min(3, "Name's length should not be less than 3"),
        username: z.string().min(3, "Username's length should not be less than 3"),
        email: z.string().email("Invalid email format").min(10),
        password: z.string().min(8, "Password length should not be less than 8")
    })
});

export const loginSchema = z.object({
    body: z.object({
        username: z.string().min(3, "Username's length should not be less than 3"),
        password: z.string().min(8, "Password length should not be less than 8")
    })
});