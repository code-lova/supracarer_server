import catchErrors from "../utils/catchErrors";
import {
  createAcccount,
  loginUser,
  refreshUserAccessToken,
  verifyEmailService,
} from "../services/auth.service";
import {
  clearAuthCookies,
  getAccessTokenCookiesOptions,
  getRefreshTokenCookiesOptions,
  setAuthCookies,
} from "../utils/cookies";
import { CREATED, OK, UNAUTHORIZED } from "../constants/http";
import { loginSchema, registerSchema, verificationCodeSchema } from "../schemas/auth.schema";
import { verifyAccessToken } from "../utils/tokens";
import Session from "../models/session.model";
import appAssert from "../utils/appAssert";



export const registerHandler = catchErrors(async (req, res) => {
  //Validate request
  const request = registerSchema.parse({
    ...req.body,
    userAgent: req.headers["user-agent"],
  });

  //Call services
  const { newUser, accessToken, refreshToken } = await createAcccount(request);

  //Return response
  return setAuthCookies({ res, accessToken, refreshToken })
    .status(CREATED)
    .json(newUser);
});



export const loginHandler = catchErrors(async (req, res) => {
  //validate the request
  const request = loginSchema.parse({
    ...req.body,
    userAgent: req.headers["user-agent"],
  });

  //Call services
  const { accessToken, refreshToken } = await loginUser(request);

  //return response
  return setAuthCookies({ res, accessToken, refreshToken })
    .status(OK)
    .json({ message: "Login Successful" });
});



export const logoutHandler = catchErrors(async (req, res) => {
  // Get the access token from cookies
  const accessToken = req.cookies.accessToken as string | undefined;

  // Verify and decode the access token
  const payload = verifyAccessToken(accessToken || "");
  appAssert(payload, UNAUTHORIZED, "Invalid or expired token");

  // Delete the session using sessionId from the token payload
  await Session.findByIdAndDelete(payload.sessionId);

  // Clear auth cookies and return response
  return clearAuthCookies(res)
    .status(OK)
    .json({ message: "Logout successful" });
});



export const refreshHandler = catchErrors(async (req, res) => {
  // Get the access token from cookies
  const refreshToken = req.cookies.refreshToken as string | undefined;
  appAssert(refreshToken, UNAUTHORIZED, "Missing refresh token");

  //call the service
  const { accessToken, newRefreshToken } = await refreshUserAccessToken(
    refreshToken
  );

  if(newRefreshToken){
    res.cookie("refreshToken", newRefreshToken, getRefreshTokenCookiesOptions());
  }

  //Return response
  return res
    .status(OK)
    .cookie("accessToken", accessToken, getAccessTokenCookiesOptions())
    .json({
      message: "Access Token Refreshed",
    });
});


export const verifyEmailHandler = catchErrors(async (req, res) => {
    //validate the request
    const verificationCode = verificationCodeSchema.parse(req.params.code);

    //call the service
    await verifyEmailService(verificationCode);

    return res.status(OK).json({
        message: "Email Verified Successfully",
    });
})
