"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearAuthCookies = exports.setAuthCookies = exports.getRefreshTokenCookiesOptions = exports.getAccessTokenCookiesOptions = exports.REFRESH_PATH = void 0;
const date_1 = require("./date");
exports.REFRESH_PATH = "/auth/refresh";
// Set secure cookies unless in development mode
const secure = process.env.NODE_ENV === "production";
// Determine sameSite value based on NODE_ENV
const sameSiteValue = process.env.NODE_ENV === "production" ? "strict" : "lax";
const defaults = {
    sameSite: sameSiteValue,
    httpOnly: true,
    secure,
    domain: process.env.NODE_ENV === "production" ? "supracarer.onrender.com" : undefined,
};
// Access token cookie options (expires in 15 minutes)
const getAccessTokenCookiesOptions = () => ({
    ...defaults,
    path: "/",
    expires: (0, date_1.fifteenMinutesFromNow)(),
});
exports.getAccessTokenCookiesOptions = getAccessTokenCookiesOptions;
// Refresh token cookie options (expires in 30 days)
const getRefreshTokenCookiesOptions = () => ({
    ...defaults,
    expires: (0, date_1.sevenDaysFromNow)(),
    path: exports.REFRESH_PATH, //increses the security of our token
});
exports.getRefreshTokenCookiesOptions = getRefreshTokenCookiesOptions;
const setAuthCookies = ({ res, accessToken, refreshToken }) => {
    return res
        .cookie("accessToken", accessToken, (0, exports.getAccessTokenCookiesOptions)())
        .cookie("refreshToken", refreshToken, (0, exports.getRefreshTokenCookiesOptions)());
};
exports.setAuthCookies = setAuthCookies;
// Function to clear authentication cookies
const clearAuthCookies = (res) => {
    return res
        .clearCookie("accessToken", { ...defaults, path: "/" })
        .clearCookie("refreshToken", { ...defaults, path: exports.REFRESH_PATH });
};
exports.clearAuthCookies = clearAuthCookies;
