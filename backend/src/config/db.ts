import { PrismaClient } from "@prisma/client";

// Instância única do Prisma Client, usada apenas pelos repositories.
export const prisma = new PrismaClient();
