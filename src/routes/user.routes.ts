import { Router } from "express";
import validate_input from "../middlewares/validate_input";
import {
  CreateUserSchema,
  RequestPasswordCodeInput,
  ResetPasswordInput,
  VerifyUserInput,
} from "../schemas/user.schema";
import user_controller from "../controllers/auth.controller";

const router = Router();

router.post(
  "/register",
  validate_input(CreateUserSchema),
  user_controller.register
);

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

router.post(
  "/reset-password/:token",
  validate_input(ResetPasswordInput),
  user_controller.reset_password
);

export default router;
