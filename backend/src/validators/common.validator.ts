import { z } from "zod";

// Valida o parâmetro :id das rotas (precisa ser um inteiro positivo)
export const idParamSchema = z.coerce
  .number({ invalid_type_error: "O id deve ser um número" })
  .int("O id deve ser um número inteiro")
  .positive("O id deve ser positivo");
