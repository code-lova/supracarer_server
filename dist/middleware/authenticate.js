"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const appAssert_1 = __importDefault(require("../utils/appAssert"));
const http_1 = require("../constants/http");
const tokens_1 = require("../utils/tokens");
const authenticate = (req, res, next) => {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    const authToken = authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : undefined;
    (0, appAssert_1.default)(authToken, http_1.UNAUTHORIZED, "Not authorized", "InvalidAccessToken" /* AppErrorCode.InvalidAccessToken */);
    // Verify token
    const { payload, error } = (0, tokens_1.verifyAccessToken)(authToken);
    (0, appAssert_1.default)(payload, http_1.UNAUTHORIZED, error === "jwt expired" ? "token expired" : "invalid token", "InvalidAccessToken" /* AppErrorCode.InvalidAccessToken */);
    // Attach user details to request
    req.user = {
        id: payload.userId,
        role: payload.role,
    };
    next();
};
exports.default = authenticate;
