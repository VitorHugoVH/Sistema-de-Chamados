import { Router } from "express";
import * as ticketController from "../controllers/ticket.controller";
import { authenticate } from "../middlewares/auth";
import { validar } from "../middlewares/validar";
import { idParamsSchema } from "../schemas/common";
import { atualizarTicketSchema, criarTicketSchema } from "../schemas/ticket.schema";

export const ticketRoutes = Router();

// Todas as rotas de chamados exigem JWT
ticketRoutes.use(authenticate);

ticketRoutes.post("/", validar(criarTicketSchema), ticketController.create);
ticketRoutes.get("/", ticketController.list);
ticketRoutes.get("/:id", validar(idParamsSchema), ticketController.findById);
ticketRoutes.put("/:id", validar(atualizarTicketSchema), ticketController.update);
ticketRoutes.delete("/:id", validar(idParamsSchema), ticketController.remove);
