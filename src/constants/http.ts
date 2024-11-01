export const OK = 200;
export const CREATED = 201;
export const BAD_REQUEST = 400;
export const UNAUTHORIZED = 401;
export const FORBIDDEN = 403;
export const NOT_FOUND = 404;
export const CONFLICT = 409;
export const UNPROCESSABLE_CONTENT = 422;
export const TOO_MANY_REQUEST = 429;
export const INTERNAL_SERVER_ERROR = 500;
export const SERVICE_UNAVAILABLE = 503;

// Define the type for HTTP status codes
export type httpStatusCode = 
    | typeof OK
    | typeof CREATED
    | typeof BAD_REQUEST
    | typeof UNAUTHORIZED
    | typeof FORBIDDEN
    | typeof NOT_FOUND
    | typeof CONFLICT
    | typeof UNPROCESSABLE_CONTENT
    | typeof TOO_MANY_REQUEST
    | typeof INTERNAL_SERVER_ERROR
    | typeof SERVICE_UNAVAILABLE;