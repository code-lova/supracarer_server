import mongoose from "mongoose";
import { verificationCodeType } from "../types";

export interface verificationCodeDocument extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  type: verificationCodeType;
  expiresAt: Date;
  createdAt: Date;
}

const verificationCodeSchema = new mongoose.Schema<verificationCodeDocument>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
      index: true,
    },
    type: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Automatically remove expired documents
verificationCodeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });


const verificationCode = mongoose.model<verificationCodeDocument>(
  "verificationCode",
  verificationCodeSchema,
  "verification_codes"
);

export default verificationCode;
