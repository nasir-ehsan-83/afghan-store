import z from "zod";
import { objectIdSchema } from "./user.validator.js";

export const createAddressSchema = z.object({
    body: z.strictObject({
        userId: objectIdSchema,
        fullName: z.string(),
        phone: z.string(),
        street: z.string(),
        city: z.string(),
        state: z.string(),
        country: z.string(),
        zipCode: z.string()
    })
});

export const addressParamsSchema = z.strictObject({
    params: z.object({
        userId: objectIdSchema
    })
});

export const addressResponseSchema = z.strictObject({
    message: z.string(), 
    address: z.object({
        _id: objectIdSchema,
        userId: objectIdSchema,
        fullName: z.string(),
        phone: z.string(),
        street: z.string(),
        city: z.string(),
        state: z.string(),
        country: z.string(),
        zipCode: z.string()
    })
    // use transform to convert MongoDB's ObjectId to valid string
}).transform((data) => ({
    message: data.message,
    address: {
        id: data.address._id.toString(),            
        userId: data.address.userId.toString(),
        fullName: data.address.fullName,            
        phone: data.address.phone,                 
        street: data.address.street,     
        city: data.address.city,                   
        state: data.address.state,                 
        country: data.country,
        zipCode: data.address.zipCode             
    }
}));
