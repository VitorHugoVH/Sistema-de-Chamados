import { Router } from "express";
import * as usersController from "../controllers/users.controller";
import { autenticar } from "../middlewares/autenticar";
import { validar } from "../middlewares/validar";
import { idParamsSchema } from "../schemas/common";

const router = Router();

router.get("/:id", autenticar, validar(idParamsSchema), usersController.buscarPorId);

export default router;
