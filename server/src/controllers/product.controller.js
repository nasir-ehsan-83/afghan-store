import ProductModel from "../models/product.model.js";
import { asyncHandler } from "../utils/async.handler.js";

export const createProduct = asyncHandler(async (req, res) => {
    // create new product
    const product = await ProductModel.create(req.body);

    return res.status(200).json({
        status: "successful",
        product: product
    });
});

export const getProduct = asyncHandler(async (req, res) => {
    // get id from parameter
    const { id } = req.params;

    // get product from DB
    const foundProduct = await ProductModel.findById(id);

    if (!foundProduct) {
        return res.status(404).json({
            status: "error",
            message: "Product not found"
        });
    }

    return res.status(200).json(foundProduct);
});

export const getAllProducts = asyncHandler(async (req, res) => {
    const products = await ProductModel.find().sort({createdAt: -1});

    return res.status(200).json(products);
});