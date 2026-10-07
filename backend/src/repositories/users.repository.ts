import { prisma } from "../config/db";

// Campos públicos do usuário: passwordHash NUNCA é selecionado
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

// Retorna também o passwordHash: usado apenas no login, para comparar a senha
export function buscarPorEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export function criar(dados: { name: string; email: string; passwordHash: string }) {
  return prisma.user.create({ data: dados, select: camposPublicos });
}
