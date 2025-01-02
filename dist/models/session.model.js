"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const date_1 = require("../utils/date");
const sessionSchema = new mongoose_1.default.Schema({
    userId: {
        ref: "User",
        type: mongoose_1.default.Schema.Types.ObjectId,
        index: true,
    },
    userAgent: {
        type: String,
    },
    expiresAt: {
        type: Date,
        default: date_1.thirtyDaysFromNow,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
    }
});
// Expire documents after `expiresAt`
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
const Session = mongoose_1.default.model("Session", sessionSchema);
exports.default = Session;
