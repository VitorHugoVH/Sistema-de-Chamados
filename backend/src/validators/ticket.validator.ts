import { z } from "zod";
import { TicketPriority, TicketStatus } from "@prisma/client";

const title = z
  .string({ required_error: "O título é obrigatório" })
  .trim()
  .min(3, "O título deve ter pelo menos 3 caracteres")
  .max(120, "O título deve ter no máximo 120 caracteres");

const description = z
  .string({ required_error: "A descrição é obrigatória" })
  .trim()
  .min(5, "A descrição deve ter pelo menos 5 caracteres")
  .max(2000, "A descrição deve ter no máximo 2000 caracteres");

const categoryId = z
  .number({ required_error: "A categoria é obrigatória", invalid_type_error: "categoryId deve ser um número" })
  .int("categoryId deve ser um número inteiro")
  .positive("categoryId deve ser positivo");

// Os enums vêm do próprio Prisma: o banco e a validação aceitam os mesmos valores
const status = z.nativeEnum(TicketStatus, {
  errorMap: () => ({ message: "Status deve ser OPEN, IN_PROGRESS, RESOLVED ou CLOSED" }),
});

const priority = z.nativeEnum(TicketPriority, {
  errorMap: () => ({ message: "Prioridade deve ser LOW, MEDIUM ou HIGH" }),
});

// Criação: todo chamado nasce com status OPEN.
// Não existe campo userId: o dono do chamado vem do JWT (campos extras são descartados).
export const createTicketSchema = z.object({
  title,
  description,
  categoryId,
  priority: priority.optional(),
});

// Atualização: todos os campos são opcionais, mas pelo menos um deve ser enviado
export const updateTicketSchema = z
  .object({
    title: title.optional(),
    description: description.optional(),
    categoryId: categoryId.optional(),
    priority: priority.optional(),
    status: status.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Informe pelo menos um campo para atualizar",
  });

export type CreateTicketInput = z.infer<typeof createTicketSchema>;
export type UpdateTicketInput = z.infer<typeof updateTicketSchema>;
