import jwt from "jsonwebtoken";
import { accessTokenPayload, refreshTokenPayload } from "../types";
import { JWT_SECRET, REFRESH_TOKEN_SECRET } from "../constants/env";

// Verify and decode the access token
export const verifyAccessToken = (
  token: string
): { payload: accessTokenPayload | null; error: string | null } => {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as accessTokenPayload;
    return { payload, error: null }; // Return payload and no error
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return { payload: null, error: errorMessage };
  }
};

// Function to verify and decode refresh token
export const verifyRefreshToken = (
  token: string
): refreshTokenPayload | null => {
  try {
    return jwt.verify(token, REFRESH_TOKEN_SECRET) as refreshTokenPayload;
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

export const generateAccessToken = (userId: string, role: string) => {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: "2d" }); // 2days
};

export const generateRefreshToken = (userId: string, role: string) => {
  return jwt.sign({ userId, role }, REFRESH_TOKEN_SECRET, { expiresIn: "7d" }); // 7 days
};
