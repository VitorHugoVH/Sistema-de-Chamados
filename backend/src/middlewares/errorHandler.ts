import { NextFunction, Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { AppError, ErroValidacao } from "../utils/erros";

// Códigos de erro do Prisma tratados aqui
const PRISMA_ERRO_UNIQUE = "P2002"; // violação de campo único
const PRISMA_ERRO_NAO_ENCONTRADO = "P2025"; // registro não encontrado
const PRISMA_ERRO_FK = "P2003"; // violação de chave estrangeira

// Middleware global de erros: todo erro lançado nas rotas, controllers,
// services ou repositories chega aqui (o Express 5 já encaminha erros de funções async).
export function errorHandler(erro: unknown, _req: Request, res: Response, _next: NextFunction) {
  // 400 — dados inválidos, com a lista de problemas
  if (erro instanceof ErroValidacao) {
    return res.status(erro.status).json({ erro: erro.message, detalhes: erro.detalhes });
  }

  // Erros conhecidos da aplicação (401, 404, 409...)
  if (erro instanceof AppError) {
    return res.status(erro.status).json({ erro: erro.message });
  }

  // Erros do próprio Prisma
  if (erro instanceof Prisma.PrismaClientKnownRequestError) {
    if (erro.code === PRISMA_ERRO_UNIQUE) {
      return res.status(409).json({ erro: "Já existe um registro com esse valor único" });
    }
    if (erro.code === PRISMA_ERRO_NAO_ENCONTRADO) {
      return res.status(404).json({ erro: "Registro não encontrado" });
    }
    if (erro.code === PRISMA_ERRO_FK) {
      return res.status(409).json({ erro: "Operação bloqueada: este registro está sendo usado por outro" });
    }
  }

  // JSON malformado no corpo da requisição
  if (erro instanceof SyntaxError && "body" in erro) {
    return res.status(400).json({ erro: "JSON inválido no corpo da requisição" });
  }

  // Erro inesperado → 500, sem expor stack trace ou detalhes internos
  console.error(erro);
  return res.status(500).json({ erro: "Erro interno do servidor" });
}
