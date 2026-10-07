import { Router } from "express";
import * as authController from "../controllers/auth.controller";
import { validar } from "../middlewares/validar";
import { loginSchema, registrarSchema } from "../schemas/auth.schema";

export const authRoutes = Router();

authRoutes.post("/register", validar(registrarSchema), authController.register);
authRoutes.post("/login", validar(loginSchema), authController.login);
