import mongoose from "mongoose";
import { MONGO_URI } from "../constants/env";

const connectToDatabase = async() => {
    if (!MONGO_URI) {
        console.error("MONGO_URI is not defined. Please add it to your environment variables.");
        process.exit(1);
    }
    try{
        await mongoose.connect(MONGO_URI);
        console.log("Connected Successfully to DB")

    }catch(error){
        console.log("Could not connect to database", error);
        process.exit(1);
    }
}

export default connectToDatabase;