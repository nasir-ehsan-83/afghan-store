import z from "zod";
import { objectIdSchema } from "./user.validator.js";

export const createProductSchema = z.object({
    body: z.strictObject({
        name: z.string().min(3, "Product name must be at least 3 characters"),
        description: z.string().optional(),
        price: z.number().positive("Price must be a positive number"),
        category: z.string().min(2, "Category is required"),
        imageURL: z.string().url("Invalid image URL format"), 
        stock: z.number().int("Stock must be an integer").nonnegative("Stock cannot be negative").default(0) 
    })
});

export const productResponseSchema = z.object({
    _id: objectIdSchema,
    name: z.string(),
    description: z.string().nullable().optional(),
    price: z.number(),
    category: z.string(),
    imageURL: z.string(),
    stock: z.number()
})  // use strip to remove unexpected fields and use transform to convert MongoDB's ObjectId to a valid string
.strip() 
.transform((data) => ({
    id: data._id ? data._id.toString() : "",
    name: data.name,
    description: data.description || "", 
    price: data.price,
    category: data.category,
    imageURL: data.imageURL,
    stock: data.stock
}));

export const allProductsResponseSchema = z.array(productResponseSchema);

export const updateProductSchema = z.object({
    body: z.strictObject({
        name: z.string().min(3),
        description: z.string(),
        price: z.number().positive(),
        category: z.string(),
        imageURL: z.string().url(),
        stock: z.number().int().nonnegative()
        // use partial() to make all fields optional
    }).partial() 
});