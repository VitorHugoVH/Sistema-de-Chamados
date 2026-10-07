import { prisma } from "../lib/prisma";
import { ConflictError, NotFoundError } from "../utils/AppError";
import { CreateCategoryInput } from "../validators/category.validator";

export async function listCategories() {
  return prisma.category.findMany({ orderBy: { name: "asc" } });
}

export async function findCategoryById(id: number) {
  const category = await prisma.category.findUnique({
    where: { id },
    include: { _count: { select: { tickets: true } } },
  });

  if (!category) {
    throw new NotFoundError("Categoria não encontrada");
  }

  return category;
}

export async function createCategory(data: CreateCategoryInput) {
  // Regra: não permitir duas categorias com o mesmo nome
  const existing = await prisma.category.findUnique({ where: { name: data.name } });
  if (existing) {
    throw new ConflictError("Já existe uma categoria com esse nome");
  }

  return prisma.category.create({ data });
}
