import { RequestHandler } from "express";
import appAssert from "../utils/appAssert";
import { UNAUTHORIZED } from "../constants/http";
import { AppErrorCode } from "../types";
import { verifyAccessToken } from "../utils/tokens";

const authenticate: RequestHandler = (req, res, next) => {
  // Extract token from Authorization header
  const authHeader = req.headers.authorization;
  const authToken = authHeader && authHeader.startsWith("Bearer ") 
    ? authHeader.split(" ")[1] 
    : undefined;

  appAssert(
    authToken,
    UNAUTHORIZED,
    "Not authorized",
    AppErrorCode.InvalidAccessToken
  );

  // Verify token
  const { payload, error } = verifyAccessToken(authToken);
  appAssert(
    payload,
    UNAUTHORIZED,
    error === "jwt expired" ? "token expired" : "invalid token",
    AppErrorCode.InvalidAccessToken
  );

  // Attach user details to request
  req.user = {
    id: payload.userId,
    role: payload.role,
  };

  next();
};

export default authenticate;
