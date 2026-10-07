import { idParamSchema } from "../validators/common.validator";

// Converte o :id da URL para número (lança ZodError → 400 se inválido)
export function parseId(id: unknown): number {
  return idParamSchema.parse(id, { path: ["id"] });
}
