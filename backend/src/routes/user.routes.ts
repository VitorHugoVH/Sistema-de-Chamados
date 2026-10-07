import { Router } from "express";
import * as userController from "../controllers/user.controller";
import { authenticate } from "../middlewares/auth";
import { validar } from "../middlewares/validar";
import { idParamsSchema } from "../schemas/common";

export const userRoutes = Router();

userRoutes.get("/:id", authenticate, validar(idParamsSchema), userController.findById);
