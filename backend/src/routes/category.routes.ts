import { Router } from "express";
import * as categoryController from "../controllers/category.controller";
import { authenticate } from "../middlewares/auth";
import { validar } from "../middlewares/validar";
import { idParamsSchema } from "../schemas/common";
import { criarCategoriaSchema } from "../schemas/category.schema";

export const categoryRoutes = Router();

// Leitura pública; criação exige autenticação
categoryRoutes.get("/", categoryController.list);
categoryRoutes.get("/:id", validar(idParamsSchema), categoryController.findById);
categoryRoutes.post("/", authenticate, validar(criarCategoriaSchema), categoryController.create);
