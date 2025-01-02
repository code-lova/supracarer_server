"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const verificationCodeSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
}, {
    timestamps: { createdAt: true, updatedAt: false },
});
// Automatically remove expired documents
verificationCodeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
const verificationCode = mongoose_1.default.model("verificationCode", verificationCodeSchema, "verification_codes");
exports.default = verificationCode;
