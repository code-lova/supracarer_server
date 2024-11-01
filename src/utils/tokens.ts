import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_REFRESH_SECRET } from "../constants/env";
import { accessTokenPayload, refreshTokenPayload } from "../types";


// Verify and decode the access token
export const verifyAccessToken = (token: string): { payload: accessTokenPayload | null; error: string | null } => {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as accessTokenPayload;
    return { payload, error: null }; // Return payload and no error
  } catch (error) {
    // Check if the error is an instance of Error
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return { payload: null, error: errorMessage };
  }
}


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