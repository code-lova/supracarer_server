import { httpStatusCode } from "../constants/http";
import { AppErrorCode } from "../types";

class AppError extends Error {
  constructor(
    public statusCode: httpStatusCode,
    public message: string,
    public errorCode?: AppErrorCode
  ) {
    super(message);
  }
}

export default AppError;
