import z from "zod";

export const registerSchema = z.object({
    body: z.object({
        username: z.string().min(3, "Username length should not be less than 3"),
        email: z.string().email("Invalid email format"),
        password: z.string().min(8, "Password length should not be less than 8")
    })
});
