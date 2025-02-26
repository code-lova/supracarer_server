
export type UserRole = "admin" | "nurse" | "client";

export const UserRoles: UserRole[] = ["admin", "nurse", "client"];

export const enum verificationCodeType {
  EmailVerification = "email_verification",
  PasswordReset = "password_reset",
}

export const enum AppErrorCode {
    InvalidAccessToken = "InvalidAccessToken",
    Forbidden = "Forbidden",
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
};

export type accessTokenPayload = {
  userId: string;
  role: UserRole;
}

export type refreshTokenPayload = {
  userId: string;
  role: string;
};


export type EmailConfig = {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
};

export type resetPasswordType = {
  password: string;
  resetVerificationCode: string;
};