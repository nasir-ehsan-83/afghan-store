import z from "zod";
import { objectIdSchema } from "./user.validator.js";

export const addToCartSchema = z.object({
    body: z.strictObject({
        userId: objectIdSchema,
        productId: objectIdSchema,
        quantity: z.number().optional()
    })
});

export const cartResponse = z.strictObject({
    message: z.string(), 
    cart: z.object({
        _id: objectIdSchema,
        userId: objectIdSchema,
        items: z.array(
            z.object({
                _id: objectIdSchema,
                productId: z.any(),
                quantity: z.number(),
            })
        )
    })
    // use transform to convert MongoDB's ObjectId to a valid string
}).transform((data) => ({
    message: data.message,
    cart: {
        _id: data.cart._id.toString(),
        userId: data.cart.userId.toString(),
        items: data.cart.items.map((item) => ({
            _id: item._id.toString(),
            quantity: item.quantity,        
            productId: item.productId 
        }))
    }
}));
