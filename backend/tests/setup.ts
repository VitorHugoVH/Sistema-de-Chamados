import { vi } from "vitest";

// Substitui o Prisma real pelo mock em todos os testes (não precisa de banco)
vi.mock("../src/lib/prisma", async () => {
  const { prismaMock } = await import("./prismaMock");
  return { prisma: prismaMock };
});
