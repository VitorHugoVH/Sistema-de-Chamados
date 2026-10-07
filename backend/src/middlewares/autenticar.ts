import { NextFunction, Request, Response } from "express";
import * as authService from "../services/auth.service";
import { ErroNaoAutorizado } from "../utils/erros";

// Protege rotas: exige o header "Authorization: Bearer TOKEN"
export async function autenticar(req: Request, _res: Response, next: NextFunction) {
  // 1. Verifica se o header existe
  const authHeader = req.headers.authorization;
  if (!authHeader) throw new ErroNaoAutorizado("Token não informado");

  // 2. Extrai o token do formato "Bearer TOKEN"
  const [esquema, token] = authHeader.split(" ");
  if (esquema !== "Bearer" || !token) {
    throw new ErroNaoAutorizado("Formato do token inválido. Use: Bearer TOKEN");
  }

  // 3 e 4. Valida o JWT e identifica o usuário (regra no auth.service)
  // 5. Disponibiliza o usuário autenticado para as próximas camadas
  req.user = await authService.validarToken(token);

  next();
}
