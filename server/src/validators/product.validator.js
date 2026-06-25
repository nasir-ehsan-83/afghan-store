import z from "zod";

export const createProductSchema = z.object({
    body: z.strictObject({
        name: z.string(),
        description: z.string().partial(),
        price: z.number(),
        category: z.string(),
        imageURL: z.string(),
        stock: z.number().partial()
    })
});

export const productResponseSchema = z.object({
    _id: z.any(), // to get mongo's ObjectId
    name: z.string(),
    description: z.string(),
    price: z.number(),
    category: z.string(),
    imageURL: z.string(),
    stock: z.number()
}).transform((data) => ({
    id: data._id.toString(), // convert mongo's ObjectId to string
    name: data.name,
    description: data.description,
    price: data.price,
    category: data.category,
    imageURL: data.imageURL,
    stock: data.stock
}));

export const allProductsResponseSchema = z.object({
    users: z.array(productResponseSchema)
});