import { prisma } from "../config/db";
import { ErroNaoEncontrado, ErroValidacao } from "../utils/erros";
import { AtualizarTicketInput, CriarTicketInput } from "../schemas/ticket.schema";

// Dados relacionados retornados junto com cada chamado
const ticketInclude = {
  user: { select: { id: true, name: true, email: true } },
  category: { select: { id: true, name: true } },
};

// Regra: o chamado precisa pertencer a uma categoria existente
async function ensureCategoryExists(categoryId: number) {
  const category = await prisma.category.findUnique({ where: { id: categoryId } });
  if (!category) {
    throw new ErroValidacao([`categoryId ${categoryId} não corresponde a nenhuma categoria existente`]);
  }
}

// Regra: o usuário só acessa os próprios chamados.
// Chamado inexistente ou de outro usuário → 404.
export async function findTicketById(id: number, userId: number) {
  const ticket = await prisma.ticket.findFirst({
    where: { id, userId },
    include: ticketInclude,
  });

  if (!ticket) {
    throw new ErroNaoEncontrado("Chamado não encontrado");
  }

  return ticket;
}

export async function listTickets(userId: number) {
  return prisma.ticket.findMany({
    where: { userId },
    include: ticketInclude,
    orderBy: { createdAt: "desc" },
  });
}

// O userId vem do JWT (req.user), nunca do corpo da requisição
export async function createTicket(data: CriarTicketInput, userId: number) {
  await ensureCategoryExists(data.categoryId);

  return prisma.ticket.create({
    data: { ...data, userId },
    include: ticketInclude,
  });
}

export async function updateTicket(id: number, data: AtualizarTicketInput, userId: number) {
  await findTicketById(id, userId); // não permite atualizar chamado inexistente

  if (data.categoryId !== undefined) {
    await ensureCategoryExists(data.categoryId);
  }

  return prisma.ticket.update({
    where: { id },
    data,
    include: ticketInclude,
  });
}

export async function deleteTicket(id: number, userId: number) {
  await findTicketById(id, userId); // não permite excluir chamado inexistente

  await prisma.ticket.delete({ where: { id } });
}
