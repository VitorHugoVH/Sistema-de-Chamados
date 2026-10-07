import { idParamSchema } from "../validators/common.validator";

// Converte o :id da URL para número (lança ZodError → 400 se inválido)
export function parseId(id: string): number {
  return idParamSchema.parse(id);
}
