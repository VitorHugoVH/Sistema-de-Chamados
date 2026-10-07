// Valores fictícios usados apenas nos testes
process.env.NODE_ENV = "test";
process.env.DATABASE_URL = "postgresql://test:test@localhost:5432/test";
process.env.JWT_SECRET = "segredo-apenas-para-testes";

// Substitui o Prisma real por um mock em todos os testes: não precisa de banco
jest.mock("../src/config/db", () => {
  const { criarPrismaMock } = require("./helpers/prismaMock");
  return { prisma: criarPrismaMock() };
});
