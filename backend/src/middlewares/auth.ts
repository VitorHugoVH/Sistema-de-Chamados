import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt";
import { findUserById } from "../services/user.service";
import { ErroNaoAutorizado } from "../utils/erros";

// Protege rotas: exige o header "Authorization: Bearer TOKEN"
export async function authenticate(req: Request, _res: Response, next: NextFunction) {
  // 1. Verifica se o header existe
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    throw new ErroNaoAutorizado("Token não informado");
  }

  // 2. Extrai o token do formato "Bearer TOKEN"
  const [scheme, token] = authHeader.split(" ");
  if (scheme !== "Bearer" || !token) {
    throw new ErroNaoAutorizado("Formato do token inválido. Use: Bearer TOKEN");
  }

  // 3. Valida o JWT (assinatura e expiração)
  let userId: number;
  try {
    userId = Number(verifyToken(token).sub);
  } catch {
    throw new ErroNaoAutorizado("Token inválido ou expirado");
  }

  // 4. Identifica o usuário (o token pode ser de um usuário que não existe mais)
  try {
    const user = await findUserById(userId);
    // 5. Disponibiliza o usuário para as próximas camadas
    req.user = { id: user.id, name: user.name, email: user.email };
  } catch {
    throw new ErroNaoAutorizado("Usuário do token não encontrado");
  }

  next();
}
