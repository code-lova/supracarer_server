"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordHandler = exports.sendPasswordResetHandler = exports.verifyEmailHandler = exports.refreshHandler = exports.loginHandler = exports.registerHandler = void 0;
const catchErrors_1 = __importDefault(require("../utils/catchErrors"));
const auth_service_1 = require("../services/auth.service");
const http_1 = require("../constants/http");
const auth_schema_1 = require("../schemas/auth.schema");
const appAssert_1 = __importDefault(require("../utils/appAssert"));
exports.registerHandler = (0, catchErrors_1.default)(async (req, res) => {
    //Validate request
    const request = auth_schema_1.registerSchema.parse(req.body);
    //Call services
    const { newUser } = await (0, auth_service_1.createAcccount)(request);
    //Return response
    return res.status(http_1.CREATED).json({ newUser });
});
exports.loginHandler = (0, catchErrors_1.default)(async (req, res) => {
    //validate the request
    const request = auth_schema_1.loginSchema.parse(req.body);
    //Call services
    const { user, accessToken, refreshToken } = await (0, auth_service_1.loginUser)(request);
    // Set cookies
    // setAuthCookies({ res, accessToken, refreshToken });
    return res.status(http_1.OK).json({
        message: "Login Successful",
        user,
        accessToken,
        refreshToken,
    });
});
exports.refreshHandler = (0, catchErrors_1.default)(async (req, res) => {
    // Get the access token from req body
    const { refreshToken } = req.body;
    (0, appAssert_1.default)(refreshToken, http_1.UNAUTHORIZED, "Missing refresh token");
    //call the service
    const { accessToken, newRefreshToken } = await (0, auth_service_1.refreshUserAccessToken)(refreshToken);
    // Set new cookies securely
    return res.status(http_1.OK).json({
        accessToken,
        refreshToken: newRefreshToken,
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
    return res.status(http_1.OK).json({ message: "Password reset successful" });
});
