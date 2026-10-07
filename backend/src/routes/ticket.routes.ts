import { Router } from "express";
import * as ticketController from "../controllers/ticket.controller";
import { authenticate } from "../middlewares/auth";
import { validateBody } from "../middlewares/validate";
import { createTicketSchema, updateTicketSchema } from "../validators/ticket.validator";

export const ticketRoutes = Router();

// Todas as rotas de chamados exigem JWT
ticketRoutes.use(authenticate);

ticketRoutes.post("/", validateBody(createTicketSchema), ticketController.create);
ticketRoutes.get("/", ticketController.list);
ticketRoutes.get("/:id", ticketController.findById);
ticketRoutes.put("/:id", validateBody(updateTicketSchema), ticketController.update);
ticketRoutes.delete("/:id", ticketController.remove);
