import catchErrors from "../utils/catchErrors";
import {
  createAcccount,
  loginUser,
  refreshUserAccessToken,
  resetPasswordService,
  sendPasswordRestEmail,
  verifyEmailService,
} from "../services/auth.service";
import { CREATED, OK, UNAUTHORIZED } from "../constants/http";
import {
  emailSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  verificationCodeSchema,
} from "../schemas/auth.schema";
import appAssert from "../utils/appAssert";

export const registerHandler = catchErrors(async (req, res) => {
  //Validate request
  const request = registerSchema.parse(req.body);

  //Call services
  const { newUser } = await createAcccount(request);

  //Return response
  return res.status(CREATED).json({ newUser });
});

export const loginHandler = catchErrors(async (req, res) => {
  //validate the request
  const request = loginSchema.parse(req.body);

  //Call services
  const { user, accessToken, refreshToken } = await loginUser(request);

  // Set cookies
  // setAuthCookies({ res, accessToken, refreshToken });

  return res.status(OK).json({
    message: "Login Successful",
    user,
    accessToken,
    refreshToken,
  });
});


export const refreshHandler = catchErrors(async (req, res) => {
  // Get the access token from req body
  const { refreshToken } = req.body;
  appAssert(refreshToken, UNAUTHORIZED, "Missing refresh token");

  //call the service
  const { accessToken, newRefreshToken } = await refreshUserAccessToken(
    refreshToken
  );

  // Set new cookies securely

  return res.status(OK).json({
    accessToken,
    refreshToken: newRefreshToken,
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
});

export const sendPasswordResetHandler = catchErrors(async (req, res) => {
  //get the email from the request
  const email = emailSchema.parse(req.body.email);

  //call the service
  await sendPasswordRestEmail(email);

  return res.status(OK).json({
    message: "Password reset email sent",
  });
});

export const resetPasswordHandler = catchErrors(async (req, res) => {
  // Validate the request with our schema
  const request = resetPasswordSchema.parse(req.body);

  //call the service
  await resetPasswordService(request);

  return res.status(OK).json({ message: "Password reset successful" });
});
