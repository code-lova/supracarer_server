"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GRIEVANCE_EMAIL_PASSWORD = exports.GRIEVANCE_EMAIL = exports.JWT_REFRESH_SECRET = exports.JWT_SECRET = exports.APP_ORIGIN = exports.PORT = exports.NODE_ENV = exports.MONGO_URI = void 0;
const getEnv = (key, defaultValue) => {
    const value = process.env[key] || defaultValue;
    if (value === undefined) {
        throw new Error(`Missing enviroment variable ${key}`);
    }
    return value;
};
exports.MONGO_URI = getEnv("MONGO_URI");
exports.NODE_ENV = getEnv("NODE_ENV", "production");
exports.PORT = getEnv("PORT", "4004");
exports.APP_ORIGIN = getEnv("APP_ORIGIN");
exports.JWT_SECRET = getEnv("JWT_SECRET");
exports.JWT_REFRESH_SECRET = getEnv("JWT_REFRESH_SECRET");
exports.GRIEVANCE_EMAIL = getEnv("GRIEVANCE_EMAIL");
exports.GRIEVANCE_EMAIL_PASSWORD = getEnv("GRIEVANCE_EMAIL_PASSWORD");
