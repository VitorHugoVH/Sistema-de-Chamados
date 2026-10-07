import { Request, Response } from "express";
import * as usersService from "../services/users.service";

export async function buscarPorId(req: Request, res: Response) {
  const usuario = await usersService.buscarPorId(req.validated.params.id);
  res.status(200).json(usuario);
}
