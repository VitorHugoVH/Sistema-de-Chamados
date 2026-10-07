import { vi } from "vitest";

// Versão "falsa" do Prisma Client: cada método é uma função mockada.
// Nos testes definimos o que cada consulta deve retornar.
export const prismaMock = {
  user: {
    findUnique: vi.fn(),
    create: vi.fn(),
  },
  category: {
    findUnique: vi.fn(),
  },
  ticket: {
    findFirst: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
};
