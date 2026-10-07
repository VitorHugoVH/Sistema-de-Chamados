import { vi } from "vitest";

// Substitui o Prisma real pelo mock em todos os testes (não precisa de banco)
vi.mock("../src/config/db", async () => {
  const { prismaMock } = await import("./prismaMock");
  return { prisma: prismaMock };
});
