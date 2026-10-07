import { NextFunction, Request, Response } from "express";
import * as authService from "../services/auth.service";
import { ErroNaoAutorizado } from "../utils/erros";

export async function autenticar(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) throw new ErroNaoAutorizado("Token não informado");

  const [esquema, token] = authHeader.split(" ");
  if (esquema !== "Bearer" || !token) {
    throw new ErroNaoAutorizado("Formato do token inválido. Use: Bearer TOKEN");
  }

  req.user = await authService.validarToken(token);

  next();
}
