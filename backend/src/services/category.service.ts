import { prisma } from "../config/db";
import { ErroConflito, ErroNaoEncontrado } from "../utils/erros";
import { CriarCategoriaInput } from "../schemas/category.schema";

export async function listCategories() {
  return prisma.category.findMany({ orderBy: { name: "asc" } });
}

export async function findCategoryById(id: number) {
  const category = await prisma.category.findUnique({
    where: { id },
    include: { _count: { select: { tickets: true } } },
  });

  if (!category) {
    throw new ErroNaoEncontrado("Categoria não encontrada");
  }

  return category;
}

export async function createCategory(data: CriarCategoriaInput) {
  // Regra: não permitir duas categorias com o mesmo nome
  const existing = await prisma.category.findUnique({ where: { name: data.name } });
  if (existing) {
    throw new ErroConflito("Já existe uma categoria com esse nome");
  }

  return prisma.category.create({ data });
}
