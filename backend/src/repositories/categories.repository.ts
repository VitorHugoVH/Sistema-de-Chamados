import { prisma } from "../config/db";

export function buscarTodas() {
  return prisma.category.findMany({ orderBy: { name: "asc" } });
}

export function buscarPorId(id: number) {
  return prisma.category.findUnique({
    where: { id },
    include: { _count: { select: { tickets: true } } },
  });
}

export function buscarPorNome(name: string) {
  return prisma.category.findUnique({ where: { name } });
}

export function criar(dados: { name: string; description?: string }) {
  return prisma.category.create({ data: dados });
}
