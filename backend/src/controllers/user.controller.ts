import { Request, Response } from "express";
import * as userService from "../services/user.service";

export async function findById(req: Request, res: Response) {
  const user = await userService.findUserById(req.validated.params.id);
  res.status(200).json(user);
}
