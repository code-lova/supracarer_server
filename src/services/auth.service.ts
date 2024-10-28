import Session from "../models/session.model";
import User, { UserDocument } from "../models/user.model";
import verificationCode from "../models/verificationCode.model";
import { verificationCodeType } from "../types";
import { oneYearFromNow } from "../utils/date";
import jwt from "jsonwebtoken";
import { JWT_REFRESH_SECRET, JWT_SECRET } from "../constants/env";
import appAssert from "../utils/appAssert";
import { CONFLICT, INTERNAL_SERVER_ERROR, NOT_FOUND, UNAUTHORIZED } from "../constants/http";
import { CreateAccountParams, loginUserParams } from "../types";
import { decodeToken, verifyRefreshToken } from "../utils/tokens";

export const createAcccount = async (data: CreateAccountParams) => {
  // Verify the user doesn't already exist
  const existingUser = await User.exists({
    email: data.email,
  });

  appAssert(!existingUser, CONFLICT, "Email already in use");

  //create the user
  const newUser = (await User.create({
    fullname: data.fullname,
    email: data.email,
    phone: data.phone,
    role: data.role,
    password: data.password,
  })) as UserDocument;

  const newUserId = newUser._id;

  //create a verification code
  const newVerificationCode = await verificationCode.create({
    newUserId,
    type: verificationCodeType.EmailVerification,
    expiresAt: oneYearFromNow(),
  });

  // TODO: Send a verification email (add your email sending function here)

  //create a session in the system
  const newSession = await Session.create({
    newUserId,
    userAgent: data.userAgent || "unknown",
  });

  // Set audience to the selected user role
  const audience = [data.role];

  // Sign access and refresh token with role-based audience
  const refreshToken = jwt.sign(
    { sessionId: newSession._id },
    JWT_REFRESH_SECRET,
    {
      audience,
      expiresIn: "30d",
    }
  );

  // Sign access and access token with role-based audience
  const accessToken = jwt.sign(
    {
      newUserId,
      sessionId: newSession._id,
    },
    JWT_SECRET,
    {
      audience,
      expiresIn: "15m",
    }
  );

  //return the user & token
  return {
    newUser: newUser.omitPassword(),
    accessToken,
    refreshToken,
  };
};

export const loginUser = async ({
  email,
  password,
  userAgent,
}: loginUserParams) => {
  //get the user email
  const user = await User.findOne({ email });
  appAssert(user, UNAUTHORIZED, "Invalid email or password");

  //verify they exists then validate the password from request
  const userIsValid = await user.comparePassword(password);
  appAssert(user, UNAUTHORIZED, "Invalid email or password");

  //create a session
  const userId = user._id;
  const session = await Session.create({
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
  const refreshToken = jwt.sign(sessionInfo, JWT_REFRESH_SECRET, {
    audience,
    expiresIn: "30d",
  });

  // Sign access and access token with role-based audience
  const accessToken = jwt.sign(
    {
      ...sessionInfo,
      userId,
    },
    JWT_SECRET,
    {
      audience,
      expiresIn: "15m",
    }
  );

  //return the user & tokens
  return {
    user: user.omitPassword(),
    accessToken,
    refreshToken,
  };
};

export const refreshUserAccessToken = async (refreshToken: string) => {
  // Step 1: Verify the refresh token
  const decoded = verifyRefreshToken(refreshToken);
  appAssert(decoded, UNAUTHORIZED, "Invalid or expired refresh token");

  // Step 2: Check the session associated with the token is active
  const session = await Session.findById(decoded.sessionId);
  appAssert(session, UNAUTHORIZED, "Session not found or has expired");

  // Step 3: Find the user associated with the session
  const user = await User.findById(session.userId);
  appAssert(user, UNAUTHORIZED, "User not found");

  // Step 4: Generate a new access token
  const newAccessToken = jwt.sign(
    {
      userId: user._id,
      sessionId: session._id,
    },
    JWT_SECRET,
    {
      audience: user.role,
      expiresIn: "15m",
    }
  );

  // Step 5: Check if a new refresh token is needed based on issuance date
  const decodedPayload = decodeToken(refreshToken);
  const issuanceTime = decodedPayload?.iat ? decodedPayload.iat * 1000 : 0;
  const isRefreshTokenNearExpiry =
    Date.now() - issuanceTime > 23 * 24 * 60 * 60 * 1000; // 7 days left for 30-day expiry

  let newRefreshToken;
  if (isRefreshTokenNearExpiry) {
    newRefreshToken = jwt.sign({ sessionId: session._id }, JWT_REFRESH_SECRET, {
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


export const verifyEmailService = async (code: string) => {
  //get the verification code
  const validCode = await verificationCode.findOne({
    _id: code,
    type: verificationCodeType.EmailVerification,
    expiresAt: { $gt: new Date() },
  });
  appAssert(validCode, NOT_FOUND, "Invalid or expired verification code");

  //update the user verified to true
  const updatedUser = await User.findByIdAndUpdate(
    validCode.userId, { verified: true}, { new: true }
  );
  appAssert(updatedUser, INTERNAL_SERVER_ERROR, "Failed to verify email");

  //delete the verification code
  await validCode.deleteOne();

  //Return the user
  return {
    user: updatedUser.omitPassword(),
  };
  
};
