import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    fullName: String,
    phone: {
        type: String,
        required: true
    },
    addressLine: String,
    city: {
        type: String,
        required: true
    },
    state: {
        tyep: String,
        required: true
    },
    pincode: String
},{
    timestamps: true
});

export const AddressModel = mongoose.model("Address", addressSchema);