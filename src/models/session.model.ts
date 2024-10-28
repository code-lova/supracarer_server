import mongoose from "mongoose";
import { thirtyDaysFromNow } from "../utils/date";


export interface sessionDocument extends mongoose.Document {
    userId: mongoose.Types.ObjectId;
    userAgent?: string;
    createdAt: Date;
    expiresAt: Date;
}



const sessionSchema = new mongoose.Schema<sessionDocument>({

    userId: {
        ref: "User",
        type: mongoose.Schema.Types.ObjectId,
        index: true,
    },
    userAgent: {
        type: String,
    },
    expiresAt: {
        type: Date,
        default: thirtyDaysFromNow,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
    }

});

// Expire documents after `expiresAt`
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Session = mongoose.model<sessionDocument>("Session", sessionSchema);

export default Session;