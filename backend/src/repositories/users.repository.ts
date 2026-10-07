import { prisma } from "../config/db";

// sem passwordHash
const camposPublicos = {
  id: true,
  name: true,
  email: true,
  createdAt: true,
  updatedAt: true,
};

export function buscarPorId(id: number) {
  return prisma.user.findUnique({ where: { id }, select: camposPublicos });
}

// usado no login (traz o hash)
export function buscarPorEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export function criar(dados: { name: string; email: string; passwordHash: string }) {
  return prisma.user.create({ data: dados, select: camposPublicos });
}
