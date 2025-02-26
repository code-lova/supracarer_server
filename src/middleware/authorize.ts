import { RequestHandler } from "express";
import appAssert from "../utils/appAssert";
import { FORBIDDEN } from "../constants/http";
import { AppErrorCode } from "../types";

// Accepts an array of allowed roles
const authorize = (...allowedRoles: string[]): RequestHandler => {
  return (req, res, next) => {
    const userRole = req.user?.role;

    appAssert(
      allowedRoles.includes(userRole),
      FORBIDDEN,
      "Access Denied",
      AppErrorCode.Forbidden
    );

    next();
  };
};

export default authorize;
