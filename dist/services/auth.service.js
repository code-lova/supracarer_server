"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordService = exports.sendPasswordRestEmail = exports.verifyEmailService = exports.refreshUserAccessToken = exports.loginUser = exports.createAcccount = void 0;
const session_model_1 = __importDefault(require("../models/session.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const verificationCode_model_1 = __importDefault(require("../models/verificationCode.model"));
const date_1 = require("../utils/date");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../constants/env");
const appAssert_1 = __importDefault(require("../utils/appAssert"));
const http_1 = require("../constants/http");
const tokens_1 = require("../utils/tokens");
const resend_1 = require("../config/resend");
const emailTemplates_1 = require("../utils/emailTemplates");
const bcrypt_1 = require("../utils/bcrypt");
const createAcccount = async (data) => {
    // Verify the user doesn't already exist
    const existingUser = await user_model_1.default.exists({
        email: data.email,
    });
    (0, appAssert_1.default)(!existingUser, http_1.CONFLICT, "Email already in use");
    //create the user
    const newUser = (await user_model_1.default.create({
        fullname: data.fullname,
        email: data.email,
        phone: data.phone,
        role: data.role,
        password: data.password,
    }));
    const newUserId = newUser._id;
    //create a verification code
    const newVerificationCode = await verificationCode_model_1.default.create({
        userId: newUser._id,
        type: "email_verification" /* verificationCodeType.EmailVerification */,
        expiresAt: (0, date_1.oneYearFromNow)(),
    });
    // TODO: Send a verification email (add your email sending function here)
    const url = `${env_1.APP_ORIGIN}/email/verify/${newVerificationCode._id}`;
    const { subject, text, html } = (0, emailTemplates_1.getVerifiedEmailTemplates)(url);
    await (0, resend_1.sendEmail)(newUser.email, subject, text, html);
    //create a session in the system
    const newSession = await session_model_1.default.create({
        newUserId,
        userAgent: data.userAgent || "unknown",
    });
    // Set audience to the selected user role
    const audience = [data.role];
    // Sign access and refresh token with role-based audience
    const refreshToken = jsonwebtoken_1.default.sign({ sessionId: newSession._id }, env_1.JWT_REFRESH_SECRET, {
        audience,
        expiresIn: "30d",
    });
    // Sign access and access token with role-based audience
    const accessToken = jsonwebtoken_1.default.sign({
        newUserId,
        sessionId: newSession._id,
    }, env_1.JWT_SECRET, {
        audience,
        expiresIn: "1m",
    });
    //return the user & token
    return {
        newUser: newUser.omitPassword(),
        accessToken,
        refreshToken,
    };
};
exports.createAcccount = createAcccount;
const loginUser = async ({ email, password, userAgent, }) => {
    //get the user email
    const user = await user_model_1.default.findOne({ email });
    (0, appAssert_1.default)(user, http_1.UNAUTHORIZED, "Invalid email or password");
    //verify they exists then validate the password from request
    const userIsValid = await user.comparePassword(password);
    (0, appAssert_1.default)(userIsValid, http_1.UNAUTHORIZED, "Invalid email or password");
    //create a session
    const userId = user._id;
    const session = await session_model_1.default.create({
        userId,
        userAgent,
    });
    const sessionInfo = {
        sessionId: session._id,
    };
    //sign our access and refresh token/set audience to role
    // Set audience to the selected user role
    const audience = user.role;
    // Sign access and refresh token with role-based audience
    const refreshToken = jsonwebtoken_1.default.sign(sessionInfo, env_1.JWT_REFRESH_SECRET, {
        audience,
        expiresIn: "7d",
    });
    // Sign access and access token with role-based audience
    const accessToken = jsonwebtoken_1.default.sign({
        ...sessionInfo,
        userId,
    }, env_1.JWT_SECRET, {
        audience,
        expiresIn: "15m",
    });
    //return the user & tokens
    return {
        user: user.omitPassword(),
        accessToken,
        refreshToken,
    };
};
exports.loginUser = loginUser;
const refreshUserAccessToken = async (refreshToken) => {
    // Step 1: Verify the refresh token
    const decoded = (0, tokens_1.verifyRefreshToken)(refreshToken);
    (0, appAssert_1.default)(decoded, http_1.UNAUTHORIZED, "Invalid or expired refresh token");
    // Step 2: Check the session associated with the token is active
    const session = await session_model_1.default.findById(decoded.sessionId);
    (0, appAssert_1.default)(session, http_1.UNAUTHORIZED, "Session not found or has expired");
    // Step 3: Find the user associated with the session
    const user = await user_model_1.default.findById(session.userId);
    (0, appAssert_1.default)(user, http_1.UNAUTHORIZED, "User not found");
    // Step 4: Generate a new access token
    const newAccessToken = jsonwebtoken_1.default.sign({
        userId: user._id,
        sessionId: session._id,
    }, env_1.JWT_SECRET, {
        audience: user.role,
        expiresIn: "15m",
    });
    // Step 5: Check if a new refresh token is needed based on issuance date
    const decodedPayload = (0, tokens_1.decodeToken)(refreshToken);
    const issuanceTime = decodedPayload?.iat ? decodedPayload.iat * 1000 : 0;
    const isRefreshTokenNearExpiry = Date.now() - issuanceTime > 23 * 24 * 60 * 60 * 1000; // 7 days left for 30-day expiry
    let newRefreshToken;
    if (isRefreshTokenNearExpiry) {
        newRefreshToken = jsonwebtoken_1.default.sign({ sessionId: session._id }, env_1.JWT_REFRESH_SECRET, {
            audience: user.role,
            expiresIn: "30d",
        });
    }
    // Step 6: Return the new tokens
    return {
        accessToken: newAccessToken,
        newRefreshToken: newRefreshToken || refreshToken,
    };
};
exports.refreshUserAccessToken = refreshUserAccessToken;
const verifyEmailService = async (code) => {
    //get the verification code
    const validCode = await verificationCode_model_1.default.findOne({
        _id: code,
        type: "email_verification" /* verificationCodeType.EmailVerification */,
        expiresAt: { $gt: new Date() },
    });
    (0, appAssert_1.default)(validCode, http_1.NOT_FOUND, "Invalid or expired verification code");
    //update the user verified to true
    const updatedUser = await user_model_1.default.findByIdAndUpdate(validCode.userId, { verified: true }, { new: true });
    (0, appAssert_1.default)(updatedUser, http_1.INTERNAL_SERVER_ERROR, "Failed to verify email");
    //delete the verification code
    await validCode.deleteOne();
    //Return the user
    return {
        user: updatedUser.omitPassword(),
    };
};
exports.verifyEmailService = verifyEmailService;
const sendPasswordRestEmail = async (email) => {
    //get the user by email
    const user = await user_model_1.default.findOne({ email });
    (0, appAssert_1.default)(user, http_1.NOT_FOUND, "Please Try again later");
    //check email rate limit
    const fiveMinsAgo = (0, date_1.fiveMinutesAgo)();
    const count = await verificationCode_model_1.default.countDocuments({
        userId: user._id,
        type: "password_reset" /* verificationCodeType.PasswordReset */,
        createdAt: { $gt: fiveMinsAgo },
    });
    (0, appAssert_1.default)(count <= 1, http_1.TOO_MANY_REQUEST, "Too many request, try again later");
    //create verification code
    const expiresAt = (0, date_1.oneHourFromNow)();
    const verifyCode = await verificationCode_model_1.default.create({
        userId: user._id,
        type: "password_reset" /* verificationCodeType.PasswordReset */,
        expiresAt,
    });
    //send verification email
    const url = `${env_1.APP_ORIGIN}/password/reset?code=${verifyCode._id}&exp=${expiresAt.getTime()}`;
    const { subject, text, html } = (0, emailTemplates_1.getPasswordResetTemplate)(url);
    const emailResponse = await (0, resend_1.sendEmail)(user.email, subject, text, html);
    //return response
    return {
        url,
        verifyCodeId: verifyCode._id,
        emailStatus: emailResponse,
    };
};
exports.sendPasswordRestEmail = sendPasswordRestEmail;
const resetPasswordService = async ({ password, resetVerificationCode, }) => {
    // get the verification code
    const validCode = await verificationCode_model_1.default.findOne({
        _id: resetVerificationCode,
        type: "password_reset" /* verificationCodeType.PasswordReset */,
        expiresAt: { $gt: new Date() },
    });
    (0, appAssert_1.default)(validCode, http_1.NOT_FOUND, "Invalid or expired verification code");
    // Hash the new password
    const hashedPassword = await (0, bcrypt_1.hashValue)(password);
    // valid update the user password
    const updateUser = await user_model_1.default.findByIdAndUpdate(validCode.userId, {
        password: hashedPassword,
    });
    (0, appAssert_1.default)(updateUser, http_1.INTERNAL_SERVER_ERROR, "Failed to reset password");
    //delete the verification code
    await validCode.deleteOne();
    //delete all sessions on all devices
    await session_model_1.default.deleteMany({ userId: updateUser._id }); //delete all session related to this user
    return {
        user: updateUser.omitPassword(),
    };
};
exports.resetPasswordService = resetPasswordService;
