import { Request, Response } from "express";

// Resposta para rotas que não existem
export function notFound(req: Request, res: Response) {
  res.status(404).json({ erro: `Rota ${req.method} ${req.path} não encontrada` });
}
