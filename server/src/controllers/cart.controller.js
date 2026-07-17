import { CartModel } from "../models/cart.model.js";
import { ProductModel } from "../models/product.model.js";
import { asyncHandler } from "../utils/async.handler.js";
import { badRequest, notFound } from "../utils/error.js";

export const addToCart = asyncHandler(async (req, res) => {
    // get userId, productId from req.body
    const { userId, productId, quantity = 1 } = req.body;

    // find product from DB
    const product = await ProductModel.findById(productId);

    // if product does not exist in DB
    if (!product) {
        return notFound("Product not found");
    }
    
    // otherwise if product.stock is less than quantity
    if (product.stock < quantity) {
        return badRequest(`Only ${product.stock} units available`);
    }
    
    // find Cart from DB and update it
    let cart = await CartModel.findOneAndUpdate(
        { userId, "items.productId": productId },
        { $inc: { "items.$.quantity": quantity } },
        { new: true }
    );

    // if Cart does not exists in DB
    if (!cart) {
        cart = await CartModel.findOneAndUpdate(
            { userId },
            { $push: { items: { productId, quantity } } },
            { upsert: true, new: true }
        );
    }

    res.status(200).json({
        message: "Item added to cart",
        cart
    });
});

export const removeItem = asyncHandler(async (req, res) => {
    // get userId and productId from req.body
    const { userId, productId } = req.body;

    // find Cart and update that by removing items
    const cart = await CartModel.findOneAndUpdate(
        { userId },
        { $pull: { items: { productId } } },
        { new: true }
    );

    // if Cart does not exist
    if (!cart) {
        return notFound("Car not found");
    }

    // if number of items is 0
    if (cart.items.length === 0) {
        await CartModel.deleteOne({ userId });
        return res.status(200).json({
            message: "Cart is now empty and removed",
            cart: null
        });
    }

    return res.status(200).json({
        message: "Item removed from cart",
        cart
    });
});

export const updateQuantity = asyncHandler(async (req, res) => {
    // get userId, productId and quantity from req.body
    const { userId, productId, quantity } = req.body;

    // if quanity is 0 or less than that
    if (quantity <= 0) {
        return badRequest("Quantity must be a positive number");
    }

    // get product from DB
    const product = await ProductModel.findById(productId);

    // if prodcut exists and its stock is greater than guantity
    if (product && product.stock < quantity) {
        return badRequest(`Insufficient stock. Only ${product.stock} available`);
    }

    // find Cart and update it 
    const cart = await CartModel.findOneAndUpdate(
        { userId, "items.productId": productId },
        { $set: { "items.$.quantity": quantity } },
        { new: true }
    );

    // if Cart does not exist
    if (!cart) {
        return notFound("Cart or Item not found");
    }

    return res.status(200).json({
        message: "Quantity updated",
        cart
    });
});

export const getCart = asyncHandler(async (req, res) => {
    // get userId from req.params
    const { userId } = req.params;

    // find Cart from DB
    const cart = await CartModel.findOne({ userId })
        .populate("items.productId", "name price imageURL category");

    // if Cart does not exist in DB
    if (!cart) {
        return res.status(200).json({
            message: "Cart is empty",
            cart: {
                _id: userId, 
                userId: userId,
                items: []
            }
        });
    }

    return res.status(200).json({
        message: "Cart retrieved successfully",
        cart
    });
});

