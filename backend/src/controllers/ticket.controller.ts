import { Request, Response } from "express";
import * as ticketService from "../services/ticket.service";

// req.user é garantido pelo middleware authenticate, aplicado em todas as rotas de tickets

export async function list(req: Request, res: Response) {
  const tickets = await ticketService.listTickets(req.user!.id);
  res.status(200).json(tickets);
}

export async function findById(req: Request, res: Response) {
  const ticket = await ticketService.findTicketById(req.validated.params.id, req.user!.id);
  res.status(200).json(ticket);
}

export async function create(req: Request, res: Response) {
  const ticket = await ticketService.createTicket(req.validated.body, req.user!.id);
  res.status(201).json(ticket);
}

export async function update(req: Request, res: Response) {
  const ticket = await ticketService.updateTicket(req.validated.params.id, req.validated.body, req.user!.id);
  res.status(200).json(ticket);
}

export async function remove(req: Request, res: Response) {
  await ticketService.deleteTicket(req.validated.params.id, req.user!.id);
  res.status(200).json({ mensagem: "Chamado excluído com sucesso" });
}
