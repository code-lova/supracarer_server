"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRefreshToken = exports.generateAccessToken = exports.decodeToken = exports.verifyRefreshToken = exports.verifyAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../constants/env");
// Verify and decode the access token
const verifyAccessToken = (token) => {
    try {
        const payload = jsonwebtoken_1.default.verify(token, env_1.JWT_SECRET);
        return { payload, error: null }; // Return payload and no error
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
        return { payload: null, error: errorMessage };
    }
};
exports.verifyAccessToken = verifyAccessToken;
// Function to verify and decode refresh token
const verifyRefreshToken = (token) => {
    try {
        return jsonwebtoken_1.default.verify(token, env_1.REFRESH_TOKEN_SECRET);
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
const generateAccessToken = (userId, role) => {
    return jsonwebtoken_1.default.sign({ userId, role }, env_1.JWT_SECRET, { expiresIn: "2d" }); // 2days
};
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = (userId, role) => {
    return jsonwebtoken_1.default.sign({ userId, role }, env_1.REFRESH_TOKEN_SECRET, { expiresIn: "7d" }); // 7 days
};
exports.generateRefreshToken = generateRefreshToken;
