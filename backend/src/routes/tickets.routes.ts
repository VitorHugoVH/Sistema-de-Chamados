import { Router } from "express";
import * as ticketsController from "../controllers/tickets.controller";
import { autenticar } from "../middlewares/autenticar";
import { validar } from "../middlewares/validar";
import { idParamsSchema } from "../schemas/common";
import { atualizarTicketSchema, criarTicketSchema } from "../schemas/ticket.schema";

const router = Router();

// Todas as rotas de chamados exigem JWT
router.use(autenticar);

router.get("/", ticketsController.listar);
router.get("/:id", validar(idParamsSchema), ticketsController.buscarPorId);
router.post("/", validar(criarTicketSchema), ticketsController.criar);
router.put("/:id", validar(atualizarTicketSchema), ticketsController.atualizar);
router.delete("/:id", validar(idParamsSchema), ticketsController.remover);

export default router;
