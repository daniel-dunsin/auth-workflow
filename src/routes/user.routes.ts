import { Router } from "express";
import validate_input from "../middlewares/validate_input";
import {
  CreateUserSchema,
  LoginInput,
  RefreshTokenInput,
  RequestPasswordCodeInput,
  ResetPasswordInput,
  VerifyUserInput,
} from "../schemas/user.schema";
import user_controller from "../controllers/auth.controller";
import is_auth from "../middlewares/is_auth";

const router = Router();

router.get("/", is_auth, user_controller.get_profile);

router.post(
  "/register",
  validate_input(CreateUserSchema),
  user_controller.register
);

router.post("/login", validate_input(LoginInput), user_controller.login);

router.get("/logout", is_auth, user_controller.logout);

router.get(
  "/verify-user/:id/:token",
  validate_input(VerifyUserInput),
  user_controller.verify_email_otp
);

router.post(
  "/forgot-password",
  validate_input(RequestPasswordCodeInput),
  user_controller.request_reset_password_code
);

router.patch(
  "/reset-password/:token",
  validate_input(ResetPasswordInput),
  user_controller.reset_password
);

router.post(
  "/refresh",
  validate_input(RefreshTokenInput),
  user_controller.refresh_access_token
);

router.get("/login/google", user_controller.get_google_login);
router.get("/google/authenticate", user_controller.login_with_google);

export default router;
