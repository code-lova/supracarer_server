"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeToken = exports.verifyRefreshToken = exports.verifyAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../constants/env");
// Verify and decode the access token
const verifyAccessToken = (token) => {
    try {
        const payload = jsonwebtoken_1.default.verify(token, env_1.JWT_SECRET);
        return { payload, error: null }; // Return payload and no error
    }
    catch (error) {
        // Check if the error is an instance of Error
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
        return { payload: null, error: errorMessage };
    }
};
exports.verifyAccessToken = verifyAccessToken;
// Function to verify and decode refresh token
const verifyRefreshToken = (token) => {
    try {
        return jsonwebtoken_1.default.verify(token, env_1.JWT_REFRESH_SECRET);
    }
    catch (error) {
        return null; // Return null if token verification fails
    }
};
exports.verifyRefreshToken = verifyRefreshToken;
const decodeToken = (token) => {
    try {
        const decoded = jsonwebtoken_1.default.decode(token);
        if (decoded && typeof decoded === "object") {
            return decoded;
        }
        return null;
    }
    catch {
        return null;
    }
};
exports.decodeToken = decodeToken;
