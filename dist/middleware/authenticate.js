"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const appAssert_1 = __importDefault(require("../utils/appAssert"));
const http_1 = require("../constants/http");
const tokens_1 = require("../utils/tokens");
const authenticate = (req, res, next) => {
    const accessToken = req.cookies.accessToken;
    (0, appAssert_1.default)(accessToken, http_1.UNAUTHORIZED, "Not authorized", "InvalidAccessToken" /* AppErrorCode.InvalidAccessToken */);
    const { error, payload } = (0, tokens_1.verifyAccessToken)(accessToken);
    (0, appAssert_1.default)(payload, http_1.UNAUTHORIZED, error === "jwt expired" ? "token expired" : "invalid token", "InvalidAccessToken" /* AppErrorCode.InvalidAccessToken */);
    const typedPayload = payload;
    req.userId = typedPayload.userId; // This should now work without error
    req.sessionId = typedPayload.sessionId;
    next();
};
exports.default = authenticate;
