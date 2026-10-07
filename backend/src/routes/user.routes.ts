import { Router } from "express";
import * as userController from "../controllers/user.controller";
import { authenticate } from "../middlewares/auth";

export const userRoutes = Router();

userRoutes.get("/:id", authenticate, userController.findById);
