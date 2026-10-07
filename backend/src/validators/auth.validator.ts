import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string({ required_error: "O nome é obrigatório" })
    .trim()
    .min(2, "O nome deve ter pelo menos 2 caracteres")
    .max(100, "O nome deve ter no máximo 100 caracteres"),
  email: z
    .string({ required_error: "O email é obrigatório" })
    .trim()
    .toLowerCase()
    .email("Email inválido"),
  password: z
    .string({ required_error: "A senha é obrigatória" })
    .min(6, "A senha deve ter pelo menos 6 caracteres")
    .max(72, "A senha deve ter no máximo 72 caracteres"),
});

export const loginSchema = z.object({
  email: z
    .string({ required_error: "O email é obrigatório" })
    .trim()
    .toLowerCase()
    .email("Email inválido"),
  password: z.string({ required_error: "A senha é obrigatória" }).min(1, "A senha é obrigatória"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
