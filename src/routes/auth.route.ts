import { Router } from "express";
import {
  loginHandler,
  logoutHandler,
  refreshHandler,
  registerHandler,
  verifyEmailHandler,
} from "../controllers/auth.controller";

const authRoutes = Router();

// Prefix: /auth
authRoutes.post("/register", registerHandler);
authRoutes.post("/login", loginHandler);
authRoutes.get("/refresh", refreshHandler);
authRoutes.post("/logout", logoutHandler);
authRoutes.get("/email/verify/:code", verifyEmailHandler);


export default authRoutes;

