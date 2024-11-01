import nodemailer from "nodemailer";
import { EmailConfig } from "../types";
import { GRIEVANCE_EMAIL, GRIEVANCE_EMAIL_PASSWORD, NODE_ENV } from "../constants/env";
import appAssert from "../utils/appAssert";
import { SERVICE_UNAVAILABLE } from "../constants/http";

const emailConfig: EmailConfig = {
    host: "smtp.titan.email",
    port: 465,
    secure: true,
    auth: {
        user: GRIEVANCE_EMAIL,
        pass: GRIEVANCE_EMAIL_PASSWORD,
    },
}; 


const transporter = nodemailer.createTransport(emailConfig);

export const sendEmail = async (to: string, subject: string, text: string, html: string) => {
    const mailOptions = {
      from: GRIEVANCE_EMAIL,
      to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions).catch((error) => {
        // Log error details
        console.error(`${error.name} - ${error.message}`);
        // Throw an appAssert error to avoid needing a try-catch where sendEmail is called
        appAssert(false, SERVICE_UNAVAILABLE, "Failed to send email");
    });

    if (NODE_ENV === "development") {
        console.log(`Email sent: ${info.response}`);
    }
    return info;
};