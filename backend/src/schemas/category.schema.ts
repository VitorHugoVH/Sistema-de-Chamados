import { z } from "zod";

export const criarCategoriaSchema = z.object({
  body: z.object({
    name: z
      .string({ error: "é obrigatório" })
      .trim()
      .min(2, { error: "deve ter pelo menos 2 caracteres" })
      .max(50, { error: "deve ter no máximo 50 caracteres" }),
    description: z
      .string({ error: "deve ser um texto" })
      .trim()
      .max(255, { error: "deve ter no máximo 255 caracteres" })
      .optional(),
  }),
});

export type CriarCategoriaInput = z.infer<typeof criarCategoriaSchema>["body"];
