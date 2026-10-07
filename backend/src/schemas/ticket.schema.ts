import { z } from "zod";
import { TicketPriority, TicketStatus } from "@prisma/client";
import { idParamsSchema } from "./common";

const title = z
  .string({ error: "é obrigatório" })
  .trim()
  .min(3, { error: "deve ter pelo menos 3 caracteres" })
  .max(120, { error: "deve ter no máximo 120 caracteres" });

const description = z
  .string({ error: "é obrigatória" })
  .trim()
  .min(5, { error: "deve ter pelo menos 5 caracteres" })
  .max(2000, { error: "deve ter no máximo 2000 caracteres" });

const categoryId = z
  .int({ error: "é obrigatório e deve ser um número inteiro" })
  .positive({ error: "deve ser um número inteiro positivo" });

// Os enums vêm do próprio Prisma: o banco e a validação aceitam os mesmos valores
const status = z.enum(TicketStatus, {
  error: `deve ser um dos valores: ${Object.values(TicketStatus).join(", ")}`,
});

const priority = z.enum(TicketPriority, {
  error: `deve ser um dos valores: ${Object.values(TicketPriority).join(", ")}`,
});

// Criação: todo chamado nasce com status OPEN.
// Não existe campo userId: o dono do chamado vem do JWT (campos extras são descartados).
export const criarTicketSchema = z.object({
  body: z.object({
    title,
    description,
    categoryId,
    priority: priority.optional(),
  }),
});

// Atualização: todos os campos são opcionais, mas pelo menos um deve ser enviado
export const atualizarTicketSchema = z.object({
  params: idParamsSchema.shape.params,
  body: z
    .object({
      title: title.optional(),
      description: description.optional(),
      categoryId: categoryId.optional(),
      priority: priority.optional(),
      status: status.optional(),
    })
    .refine((dados) => Object.keys(dados).length > 0, {
      error: "informe pelo menos um campo para atualizar",
    }),
});

export type CriarTicketInput = z.infer<typeof criarTicketSchema>["body"];
export type AtualizarTicketInput = z.infer<typeof atualizarTicketSchema>["body"];
