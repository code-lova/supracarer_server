import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_REFRESH_SECRET } from "../constants/env";
import { accessTokenPayload, refreshTokenPayload } from "../types";

// Verify and decode the access token
export const verifyAccessToken = (token: string): accessTokenPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as accessTokenPayload;
  } catch (error) {
    return null; // Return null if token verification fails
  }
};


// Function to verify and decode refresh token
export const verifyRefreshToken = (token: string): refreshTokenPayload | null => {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET) as refreshTokenPayload;
  } catch (error) {
    return null; // Return null if token verification fails
  }
};


export const decodeToken = (token: string) => {
  try {
    const decoded = jwt.decode(token);
    if (decoded && typeof decoded === "object") {
      return decoded;
    }
    return null;
  } catch {
    return null;
  }
};