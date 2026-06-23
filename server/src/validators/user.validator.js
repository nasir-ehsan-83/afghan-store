import z from "zod";

export const createUserSchema = z.object({
    body: z.strictObject({
        name: z.string().min(3, "Name's length should not be less than 3"),
        username: z.string().min(3, "Username's length should not be less than 3"),
        email: z.string().email("Invalid email format").min(10),
        password: z.string().min(8, "Password length should not be less than 8")
    })
});

export const userResponseSchema = z.object({
    _id: z.any(), // to get mongo's ObjectId
    name: z.string(),
    username: z.string(),
    email: z.string().email(),
}).transform((data) => ({
    id: data._id.toString(), // convert mongo's ObjectId to string
    name: data.name,
    username: data.username,
    email: data.email
}));

export const allUsersResponseSchema = z.object({
    users: z.array(userResponseSchema)
});
