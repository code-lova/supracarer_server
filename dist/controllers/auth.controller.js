"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordHandler = exports.sendPasswordResetHandler = exports.verifyEmailHandler = exports.refreshHandler = exports.logoutHandler = exports.loginHandler = exports.registerHandler = void 0;
const catchErrors_1 = __importDefault(require("../utils/catchErrors"));
const auth_service_1 = require("../services/auth.service");
const cookies_1 = require("../utils/cookies");
const http_1 = require("../constants/http");
const auth_schema_1 = require("../schemas/auth.schema");
const tokens_1 = require("../utils/tokens");
const session_model_1 = __importDefault(require("../models/session.model"));
const appAssert_1 = __importDefault(require("../utils/appAssert"));
exports.registerHandler = (0, catchErrors_1.default)(async (req, res) => {
    //Validate request
    const request = auth_schema_1.registerSchema.parse({
        ...req.body,
        userAgent: req.headers["user-agent"],
    });
    //Call services
    const { newUser, accessToken, refreshToken } = await (0, auth_service_1.createAcccount)(request);
    //Return response
    return (0, cookies_1.setAuthCookies)({ res, accessToken, refreshToken })
        .status(http_1.CREATED)
        .json(newUser);
});
exports.loginHandler = (0, catchErrors_1.default)(async (req, res) => {
    //validate the request
    const request = auth_schema_1.loginSchema.parse({
        ...req.body,
        userAgent: req.headers["user-agent"],
    });
    //Call services
    const { accessToken, refreshToken } = await (0, auth_service_1.loginUser)(request);
    //return response
    return (0, cookies_1.setAuthCookies)({ res, accessToken, refreshToken })
        .status(http_1.OK)
        .json({ message: "Login Successful" });
});
exports.logoutHandler = (0, catchErrors_1.default)(async (req, res) => {
    // Get the access token from cookies
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;
    // Ensure at least one token is present
    (0, appAssert_1.default)(accessToken || refreshToken, http_1.UNAUTHORIZED, "Unauthorized: No valid tokens provided.");
    // Handle session deletion based on access token validity
    if (accessToken) {
        try {
            // Verify and decode the access token
            const { payload } = (0, tokens_1.verifyAccessToken)(accessToken);
            (0, appAssert_1.default)(payload, http_1.UNAUTHORIZED, "Invalid or expired access token.");
            // Delete the session associated with the access token
            if (payload?.sessionId) {
                await session_model_1.default.findByIdAndDelete(payload.sessionId);
            }
        }
        catch (error) {
            // Proceed if access token is invalid; fallback to refresh token handling
            (0, appAssert_1.default)(refreshToken, http_1.UNAUTHORIZED, "Access token invalid and no refresh token provided.");
        }
    }
    // Clear authentication cookies to log the user out
    res.set("Cache-Control", "no-store");
    return (0, cookies_1.clearAuthCookies)(res)
        .status(http_1.OK)
        .json({ message: "Logout successful" });
});
exports.refreshHandler = (0, catchErrors_1.default)(async (req, res) => {
    // Get the access token from cookies
    const refreshToken = req.cookies.refreshToken;
    (0, appAssert_1.default)(refreshToken, http_1.UNAUTHORIZED, "Missing refresh token");
    //call the service
    const { accessToken, newRefreshToken } = await (0, auth_service_1.refreshUserAccessToken)(refreshToken);
    if (newRefreshToken) {
        res.cookie("refreshToken", newRefreshToken, (0, cookies_1.getRefreshTokenCookiesOptions)());
    }
    //Return response
    return res
        .status(http_1.OK)
        .cookie("accessToken", accessToken, (0, cookies_1.getAccessTokenCookiesOptions)())
        .json({
        message: "Access Token Refreshed",
    });
});
exports.verifyEmailHandler = (0, catchErrors_1.default)(async (req, res) => {
    //validate the request
    const verificationCode = auth_schema_1.verificationCodeSchema.parse(req.params.code);
    //call the service
    await (0, auth_service_1.verifyEmailService)(verificationCode);
    return res.status(http_1.OK).json({
        message: "Email Verified Successfully",
    });
});
exports.sendPasswordResetHandler = (0, catchErrors_1.default)(async (req, res) => {
    //get the email from the request
    const email = auth_schema_1.emailSchema.parse(req.body.email);
    //call the service
    await (0, auth_service_1.sendPasswordRestEmail)(email);
    return res.status(http_1.OK).json({
        message: "Password reset email sent",
    });
});
exports.resetPasswordHandler = (0, catchErrors_1.default)(async (req, res) => {
    // Validate the request with our schema
    const request = auth_schema_1.resetPasswordSchema.parse(req.body);
    //call the service
    await (0, auth_service_1.resetPasswordService)(request);
    return (0, cookies_1.clearAuthCookies)(res).status(http_1.OK).json({
        message: "Password Reset Successfully",
    });
});
