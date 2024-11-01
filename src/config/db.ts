import mongoose from "mongoose";
import { MONGO_URI } from "../constants/env";

const connectToDatabase = async() => {
    if (!MONGO_URI) {
        console.error("MONGO_URI is not defined. Please add it to your environment variables.");
        process.exit(1);
    }
    const maxRetries = 5;
    for (let i = 0; i < maxRetries; i++) {
        try {
            await mongoose.connect(MONGO_URI, {
                connectTimeoutMS: 10000,
                serverSelectionTimeoutMS: 5000,
            });
            console.log("Connected Successfully to DB");
            return; // Exit the function on successful connection
        } catch (error) {
            console.error(`Attempt ${i + 1} failed:`, error);
            if (i === maxRetries - 1) {
                process.exit(1); // Exit after max retries
            }
            await new Promise(res => setTimeout(res, 2000)); // Wait before retrying
        }
    }
}

export default connectToDatabase;