import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";

// Valida o corpo da requisição com um schema do Zod ANTES do controller.
// Se for inválido, o ZodError segue para o errorHandler (400).
// Se for válido, req.body passa a conter apenas os campos do schema.
export function validateBody(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    req.body = schema.parse(req.body);
    next();
  };
}
