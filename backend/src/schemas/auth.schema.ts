import { z } from "zod";

const email = z
  .string({ error: "é obrigatório" })
  .trim()
  .toLowerCase()
  .pipe(z.email({ error: "deve ser um email válido" }));

export const registrarSchema = z.object({
  body: z.object({
    name: z
      .string({ error: "é obrigatório" })
      .trim()
      .min(2, { error: "deve ter pelo menos 2 caracteres" })
      .max(100, { error: "deve ter no máximo 100 caracteres" }),
    email,
    password: z
      .string({ error: "é obrigatória" })
      .min(6, { error: "deve ter pelo menos 6 caracteres" })
      .max(72, { error: "deve ter no máximo 72 caracteres" }),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email,
    password: z.string({ error: "é obrigatória" }).min(1, { error: "é obrigatória" }),
  }),
});

export type RegistrarInput = z.infer<typeof registrarSchema>["body"];
export type LoginInput = z.infer<typeof loginSchema>["body"];
