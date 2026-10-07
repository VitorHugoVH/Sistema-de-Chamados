import { Request, Response } from "express";
import * as userService from "../services/user.service";
import { parseId } from "../utils/parseId";

export async function findById(req: Request, res: Response) {
  const user = await userService.findUserById(parseId(req.params.id));
  res.status(200).json(user);
}
