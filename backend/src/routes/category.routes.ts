import { Router } from "express";
import * as categoryController from "../controllers/category.controller";
import { authenticate } from "../middlewares/auth";
import { validateBody } from "../middlewares/validate";
import { createCategorySchema } from "../validators/category.validator";

export const categoryRoutes = Router();

// Leitura pública; criação exige autenticação
categoryRoutes.get("/", categoryController.list);
categoryRoutes.get("/:id", categoryController.findById);
categoryRoutes.post("/", authenticate, validateBody(createCategorySchema), categoryController.create);
