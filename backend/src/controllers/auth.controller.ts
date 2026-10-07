import { Request, Response } from "express";
import * as authService from "../services/auth.service";

export async function register(req: Request, res: Response) {
  const user = await authService.register(req.validated.body);
  res.status(201).json(user);
}

export async function login(req: Request, res: Response) {
  const result = await authService.login(req.validated.body);
  res.status(200).json(result);
}
