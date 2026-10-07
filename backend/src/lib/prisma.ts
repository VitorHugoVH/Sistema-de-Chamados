import { PrismaClient } from "@prisma/client";

// Instância única do Prisma Client, reutilizada por todos os services.
export const prisma = new PrismaClient();
