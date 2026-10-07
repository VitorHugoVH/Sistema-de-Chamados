import { Prisma } from "@prisma/client";
import { prisma } from "../config/db";

const incluirRelacionamentos = {
  user: { select: { id: true, name: true, email: true } },
  category: { select: { id: true, name: true } },
};

export function buscarTodosDoUsuario(userId: number) {
  return prisma.ticket.findMany({
    where: { userId },
    include: incluirRelacionamentos,
    orderBy: { createdAt: "desc" },
  });
}

export function buscarPorIdDoUsuario(id: number, userId: number) {
  return prisma.ticket.findFirst({
    where: { id, userId },
    include: incluirRelacionamentos,
  });
}

export function criar(dados: Prisma.TicketUncheckedCreateInput) {
  return prisma.ticket.create({ data: dados, include: incluirRelacionamentos });
}

export function atualizar(id: number, dados: Prisma.TicketUncheckedUpdateInput) {
  return prisma.ticket.update({
    where: { id },
    data: dados,
    include: incluirRelacionamentos,
  });
}

export function remover(id: number) {
  return prisma.ticket.delete({ where: { id } });
}
