import assert from "node:assert";
import AppError from "./appError";
import { httpStatusCode } from "../constants/http";
import { AppErrorCode } from "../types";

type AppAssert = (
    condition: any,
    httpStatusCode: httpStatusCode,
    message: string,
    appErrorCode?: AppErrorCode
) => asserts condition;

/**
 * Assert a condition and throw an AppError if the condition is falsy 
 */

const appAssert: AppAssert = (
    condition: any,
    httpStatusCode,
    message,
    appErrorCode
)=> assert(condition, new AppError(httpStatusCode, message, appErrorCode));

export default appAssert;