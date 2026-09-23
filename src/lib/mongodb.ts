import mongoose from "mongoose";

export const connectToDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI!);
        console.log("MongoDB connected");
    } catch (error) {
        console.log("Error in connect to MongoDB", error);
    }
};