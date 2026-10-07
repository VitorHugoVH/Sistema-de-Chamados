import { Router } from "express";
import * as authController from "../controllers/auth.controller";
import { validateBody } from "../middlewares/validate";
import { loginSchema, registerSchema } from "../validators/auth.validator";

export const authRoutes = Router();

authRoutes.post("/register", validateBody(registerSchema), authController.register);
authRoutes.post("/login", validateBody(loginSchema), authController.login);
