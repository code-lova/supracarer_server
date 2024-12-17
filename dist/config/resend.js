"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const env_1 = require("../constants/env");
const appAssert_1 = __importDefault(require("../utils/appAssert"));
const http_1 = require("../constants/http");
const emailConfig = {
    host: "smtp.titan.email",
    port: 465,
    secure: true,
    auth: {
        user: env_1.GRIEVANCE_EMAIL,
        pass: env_1.GRIEVANCE_EMAIL_PASSWORD,
    },
};
const transporter = nodemailer_1.default.createTransport(emailConfig);
const sendEmail = async (to, subject, text, html) => {
    const mailOptions = {
        from: env_1.GRIEVANCE_EMAIL,
        to,
        subject,
        text,
        html,
    };
    const info = await transporter.sendMail(mailOptions).catch((error) => {
        // Log error details
        console.error(`${error.name} - ${error.message}`);
        // Throw an appAssert error to avoid needing a try-catch where sendEmail is called
        (0, appAssert_1.default)(false, http_1.SERVICE_UNAVAILABLE, "Failed to send email");
    });
    if (env_1.NODE_ENV === "development") {
        console.log(`Email sent: ${info.response}`);
    }
    return info;
};
exports.sendEmail = sendEmail;
