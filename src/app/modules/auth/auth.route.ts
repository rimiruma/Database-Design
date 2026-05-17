import { Router } from "express";

import { validateRequest } from "../../middleware/validateSchema";
import {
  ChangePasswordSchema,
  ForgotPasswordSchema,
  LoginValidationSchema,
  RegisterSchema,
  userValidationSchema,
} from "./auth.validation";
import { AuthController } from "./auth.controller";

const router: Router = Router();

router.post("/login", validateRequest(LoginValidationSchema), AuthController.login);

router.post(
  "/register",
  validateRequest(userValidationSchema),
  AuthController.register,
);
router.post('/verify-email', AuthController.verifyEmail);
router.get(
  "/change-password",
  validateRequest(ChangePasswordSchema),
  AuthController.changePassword,
);
router.get(
  "/forgot-password",
  validateRequest(ForgotPasswordSchema),
  AuthController.forgotPassword,
);

router.get("/getAllUsers", AuthController.getAllUseres)

export const AuthRouter = router;
