import { AddressModel } from "../models/address.model.js";
import { asyncHandler } from "../utils/async.handler.js";
import { notFound } from "../utils/error.js";

export const saveAddress = asyncHandler(async (req, res) => {
    // save address to DB
    const address = await AddressModel.create(req.body);

    return res.status(200).json({
        message: "Address saved successfully",
        address
    });
});

export const getAddress = asyncHandler(async (req, res) => {
    // find address from DB
    const address = await AddressModel.findOne({
        userId: req.params.userId
    });

    // if address does not exist
    if (!address) {
        return notFound("Address does not exist");
    }

    res.status(200).json({
        message: "Address found",
        address
    });
});