"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordSchema = exports.verificationCodeSchema = exports.registerSchema = exports.loginSchema = exports.emailSchema = void 0;
const zod_1 = require("zod");
exports.emailSchema = zod_1.z.string().email().min(1).max(100).trim();
const passwordSchema = zod_1.z
    .string()
    .min(6)
    .max(100)
    .regex(/[@$!%*?&]/) //Password must contain at least one special character
    .regex(/\d/); // Password must contain at least one number
exports.loginSchema = zod_1.z.object({
    email: exports.emailSchema,
    password: passwordSchema,
    userAgent: zod_1.z.string().optional(),
});
//extending the loginschem and passing it to registerschema
exports.registerSchema = exports.loginSchema
    .extend({
    fullname: zod_1.z.string().min(1).max(50).trim(),
    phone: zod_1.z
        .string()
        .min(2)
        .max(20)
        .regex(/^\+?\d+$/), //Phone number can start with a + and must contain only numbers
    confirmPassword: zod_1.z.string().min(6).max(100),
    role: zod_1.z.enum(["admin", "nurse", "client"]),
})
    .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});
exports.verificationCodeSchema = zod_1.z.string().min(1).max(24).trim();
exports.resetPasswordSchema = zod_1.z.object({
    password: passwordSchema,
    resetVerificationCode: exports.verificationCodeSchema,
});
