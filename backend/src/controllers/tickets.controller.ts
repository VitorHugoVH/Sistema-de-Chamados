import { Request, Response } from "express";
import * as ticketsService from "../services/tickets.service";

export async function listar(req: Request, res: Response) {
  const tickets = await ticketsService.listar(req.user!.id);
  res.status(200).json(tickets);
}

export async function buscarPorId(req: Request, res: Response) {
  const ticket = await ticketsService.buscarPorId(req.validated.params.id, req.user!.id);
  res.status(200).json(ticket);
}

export async function criar(req: Request, res: Response) {
  const ticket = await ticketsService.criar(req.validated.body, req.user!.id);
  res.status(201).json(ticket);
}

export async function atualizar(req: Request, res: Response) {
  const ticket = await ticketsService.atualizar(req.validated.params.id, req.validated.body, req.user!.id);
  res.status(200).json(ticket);
}

export async function remover(req: Request, res: Response) {
  await ticketsService.remover(req.validated.params.id, req.user!.id);
  res.status(200).json({ mensagem: "Chamado excluído com sucesso" });
}
