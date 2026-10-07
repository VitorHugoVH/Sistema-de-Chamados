import { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";
import { formatarErrosZod } from "../schemas/common";
import { ErroValidacao } from "../utils/erros";

// valida body, params e query antes do controller
export function validar(schema: ZodType) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const resultado = schema.safeParse({
      body: req.body ?? {},
      params: req.params,
      query: req.query,
    });

    if (!resultado.success) {
      return next(new ErroValidacao(formatarErrosZod(resultado.error)));
    }

    req.validated = resultado.data as Request["validated"];
    next();
  };
}
