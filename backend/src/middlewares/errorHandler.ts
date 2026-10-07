import { NextFunction, Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { AppError, ErroValidacao } from "../utils/erros";

// códigos de erro do prisma
const PRISMA_ERRO_UNIQUE = "P2002";
const PRISMA_ERRO_NAO_ENCONTRADO = "P2025";
const PRISMA_ERRO_FK = "P2003";

export function errorHandler(erro: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (erro instanceof ErroValidacao) {
    return res.status(erro.status).json({ erro: erro.message, detalhes: erro.detalhes });
  }

  if (erro instanceof AppError) {
    return res.status(erro.status).json({ erro: erro.message });
  }

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

  // json inválido no body
  if (erro instanceof SyntaxError && "body" in erro) {
    return res.status(400).json({ erro: "JSON inválido no corpo da requisição" });
  }

  console.error(erro);
  return res.status(500).json({ erro: "Erro interno do servidor" });
}
