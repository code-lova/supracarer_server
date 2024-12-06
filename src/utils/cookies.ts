import { CookieOptions, Response } from "express";
import { fifteenMinutesFromNow, oneMinuteFromNow, sevenDaysFromNow } from "./date";

export const REFRESH_PATH = "/auth/refresh";

// Set secure cookies unless in development mode
const secure = process.env.NODE_ENV !== "development";

// Determine sameSite value based on NODE_ENV
const sameSiteValue: CookieOptions['sameSite'] = process.env.NODE_ENV === "development" ? "strict" : "none";


const defaults: CookieOptions = {
  sameSite: sameSiteValue,
  httpOnly: true,
  secure,
};

// Access token cookie options (expires in 15 minutes)
export const getAccessTokenCookiesOptions = (): CookieOptions => ({
  ...defaults,
  path: "/", // Accessible to all routes
  expires: fifteenMinutesFromNow(),
});


// Refresh token cookie options (expires in 30 days)
export const getRefreshTokenCookiesOptions = (): CookieOptions => ({
  ...defaults,
  expires: sevenDaysFromNow(),
  path: REFRESH_PATH, //increses the security of our token
});

type SetAuthCookiesParams = {
  res: Response;
  accessToken: string;
  refreshToken: string;
};

export const setAuthCookies = ({ res, accessToken, refreshToken }: SetAuthCookiesParams) => {
  return res
    .cookie("accessToken", accessToken, getAccessTokenCookiesOptions())
    .cookie("refreshToken", refreshToken, getRefreshTokenCookiesOptions());
};


// Function to clear authentication cookies
export const clearAuthCookies = (res: Response) => {
  return res
  .clearCookie("accessToken", { ...defaults, path: "/"})
  .clearCookie("refreshToken", { ...defaults, path: REFRESH_PATH });
};