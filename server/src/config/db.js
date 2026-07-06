import mongoose from "mongoose";

const connectDB = async () => {
    try {
        // connect to the MongoDB 
        await mongoose.connect(process.env.MONGO_URL)
    } catch (error) {
        console.log(`Database Connection Error: ${error}`)
    }
};

export default connectDB;