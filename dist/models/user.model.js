"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const types_1 = require("../types");
const bcrypt_1 = require("../utils/bcrypt");
const userSchema = new mongoose_1.default.Schema({
    fullname: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, "Email is invalid"], // Regex for email validation
    },
    phone: {
        type: String,
        required: true,
        trim: true,
        match: [/^\+?[1-9]\d{1,14}$/, "Phone number is invalid"], // Allow optional + sign at the start
    },
    role: {
        type: String,
        enum: types_1.UserRoles,
        required: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    verified: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
});
// Middleware to hash password before saving the document
userSchema.pre("save", async function (next) {
    const user = this;
    if (!user.isModified("password")) {
        return next();
    }
    user.password = await (0, bcrypt_1.hashValue)(user.password); // Use the hashValue function
    next();
});
// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
    const user = this;
    return (0, bcrypt_1.compareValue)(candidatePassword, user.password);
};
// Method to omit the password field when returning user data
userSchema.methods.omitPassword = function () {
    const user = this.toObject();
    delete user.password; // Remove the password property
    return user;
};
const User = mongoose_1.default.model("User", userSchema);
exports.default = User;
