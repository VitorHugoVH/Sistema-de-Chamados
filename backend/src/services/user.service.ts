import { prisma } from "../config/db";
import { NotFoundError } from "../utils/AppError";

// Campos públicos do usuário: passwordHash NUNCA é selecionado
export const publicUserSelect = {
  id: true,
  name: true,
  email: true,
  createdAt: true,
  updatedAt: true,
};

export async function findUserById(id: number) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: publicUserSelect,
  });

  if (!user) {
    throw new NotFoundError("Usuário não encontrado");
  }

  return user;
}
