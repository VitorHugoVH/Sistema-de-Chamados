import { Router } from "express";
import * as categoriesController from "../controllers/categories.controller";
import { autenticar } from "../middlewares/autenticar";
import { validar } from "../middlewares/validar";
import { criarCategoriaSchema } from "../schemas/category.schema";
import { idParamsSchema } from "../schemas/common";

const router = Router();

router.get("/", categoriesController.listar);
router.get("/:id", validar(idParamsSchema), categoriesController.buscarPorId);
router.post("/", autenticar, validar(criarCategoriaSchema), categoriesController.criar);

export default router;
