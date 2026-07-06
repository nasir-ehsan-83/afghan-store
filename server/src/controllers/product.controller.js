import { ProductModel } from "../models/product.model.js";
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

    // if product does not exist
    if (!foundProduct) {
        return res.status(404).json({
            status: "error",
            message: "Product not found"
        });
    }

    return res.status(200).json(foundProduct);
});

export const getAllProducts = asyncHandler(async (req, res) => {
    // get search and category filtering
    const { search, category } = req.query;

    // filter options
    const filter = {};

    if (search) {
        filter.name = {$regex: search, $options: 'i'};
    }

    if (category) {
        filter.category = category;
    }

    // find products by filterring search and categories
    const products = await ProductModel.find(filter).sort({createdAt: -1});

    return res.status(200).json(products);
});

export const updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // find product from DB
    const foundProduct = await ProductModel.findOne({
        _id: id
    });

    // if product not found
    if (!foundProduct) {
        return res.status(404).json({
            status: "error",
            message: "Product does not exist"
        });
    }

    // get fields by destructuring req.body
    const { name, description, price, category, imageURL, stock } = req.body;

    // store destructured fields to updateData object
    const updatedData = { name, description, price, category, imageURL, stock };

    // add updateData to the DB
    const updateProduct = await ProductModel.findByIdAndUpdate(
        id,
        { $set: updatedData },
        { new: true }
    );

    return res.status(200).json(updateProduct);
});

export const deleteProduct = asyncHandler(async (req, res) => {
    // get id from req.params
    const { id } = req.params;

    // delete product directly from DB
    const deletedProduct = await ProductModel.findByIdAndDelete(id);

    // if product does not exist
    if (!deletedProduct) {
        return res.status(404).json({
            status: "error",
            message: "Product does not exist"
        });
    }

    return res.status(200).json({
        status: "successful",
        message: "Product deleted"
    });    
});