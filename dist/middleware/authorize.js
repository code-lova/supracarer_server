"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const appAssert_1 = __importDefault(require("../utils/appAssert"));
const http_1 = require("../constants/http");
// Accepts an array of allowed roles
const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        const userRole = req.user?.role;
        (0, appAssert_1.default)(allowedRoles.includes(userRole), http_1.FORBIDDEN, "Access Denied", "Forbidden" /* AppErrorCode.Forbidden */);
        next();
    };
};
exports.default = authorize;
