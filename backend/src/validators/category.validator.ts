import { z } from "zod";

export const createCategorySchema = z.object({
  name: z
    .string({ required_error: "O nome é obrigatório" })
    .trim()
    .min(2, "O nome deve ter pelo menos 2 caracteres")
    .max(50, "O nome deve ter no máximo 50 caracteres"),
  description: z.string().trim().max(255, "A descrição deve ter no máximo 255 caracteres").optional(),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
