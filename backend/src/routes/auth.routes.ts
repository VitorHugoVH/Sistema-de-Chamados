import { Router } from "express";
import * as authController from "../controllers/auth.controller";
import { validar } from "../middlewares/validar";
import { loginSchema, registrarSchema } from "../schemas/auth.schema";

const router = Router();

router.post("/register", validar(registrarSchema), authController.registrar);
router.post("/login", validar(loginSchema), authController.login);

export default router;
