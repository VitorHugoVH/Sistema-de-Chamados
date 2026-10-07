import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/AppError";

// Middleware global de erros: todo erro lançado nas rotas, controllers
// ou services chega aqui (o Express 5 já encaminha erros de funções async).
export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  // Erros de validação do Zod → 400 com a lista de campos inválidos
  if (error instanceof ZodError) {
    return res.status(400).json({
      error: "Dados inválidos",
      details: error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  // Erros conhecidos da aplicação (400, 401, 404, 409...)
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({ error: error.message });
  }

  // JSON malformado no corpo da requisição
  if (error instanceof SyntaxError && "body" in error) {
    return res.status(400).json({ error: "JSON inválido no corpo da requisição" });
  }

  // Erro inesperado → 500, sem expor stack trace ou detalhes internos
  console.error(error);
  return res.status(500).json({ error: "Erro interno do servidor" });
}
