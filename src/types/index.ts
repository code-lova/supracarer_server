import { sessionDocument } from "../models/session.model";
import { UserDocument } from "../models/user.model";

export type UserRole = "admin" | "nurse" | "client";

export const UserRoles: UserRole[] = ["admin", "nurse", "client"];

export const enum verificationCodeType {
  EmailVerification = "email_verification",
  PasswordReset = "password_reset",
}

export const enum AppErrorCode {
    InvalidAccessToken = "InvalidAccessToken",
}

export type CreateAccountParams = {
  fullname: string;
  email: string;
  phone: string;
  role: UserRole;
  password: string;
  userAgent?: string;
};

export type loginUserParams = {
  email: string;
  password: string;
  userAgent?: string;
};

export type refreshTokenPayload = {
  sessionId: sessionDocument["_id"],
};

export type accessTokenPayload = {
  userId: UserDocument["_id"],
  sessionId: sessionDocument["_id"]
}