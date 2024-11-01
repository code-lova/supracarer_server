import { RequestHandler } from "express";
import appAssert from "../utils/appAssert";
import { UNAUTHORIZED } from "../constants/http";
import { AppErrorCode } from "../types";
import { verifyAccessToken } from "../utils/tokens";
import { accessTokenPayload } from "../types";

const authenticate: RequestHandler = (req, res, next) => {
  const accessToken = req.cookies.accessToken as string | undefined;
  appAssert(
    accessToken,
    UNAUTHORIZED,
    "Not authorized",
    AppErrorCode.InvalidAccessToken
  );

  const { error, payload } = verifyAccessToken(accessToken);
  appAssert(
    payload,
    UNAUTHORIZED,
    error === "jwt expired" ? "token expired" : "invalid token",
    AppErrorCode.InvalidAccessToken
  );

  const typedPayload = payload as accessTokenPayload;

  req.userId = typedPayload.userId; // This should now work without error
  req.sessionId = typedPayload.sessionId;
  next();

};

export default authenticate;
