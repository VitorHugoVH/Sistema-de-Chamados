import { prisma } from "../../src/config/db";
import * as ticketsRepository from "../../src/repositories/tickets.repository";
import * as usersRepository from "../../src/repositories/users.repository";

// prisma aqui é o mock criado em tests/jest.setup.ts
const prismaMock = jest.mocked(prisma);

describe("users.repository", () => {
  it("buscarPorId nunca seleciona o passwordHash", async () => {
    await usersRepository.buscarPorId(1);

    const argumentos = prismaMock.user.findUnique.mock.calls[0][0];
    expect(argumentos.where).toEqual({ id: 1 });
    expect(argumentos.select).not.toHaveProperty("passwordHash");
  });
});

describe("tickets.repository", () => {
  it("buscarPorIdDoUsuario filtra pelo id e pelo dono do chamado", async () => {
    await ticketsRepository.buscarPorIdDoUsuario(3, 7);

    expect(prismaMock.ticket.findFirst.mock.calls[0][0].where).toEqual({ id: 3, userId: 7 });
  });

  it("buscarTodosDoUsuario lista apenas os chamados do usuário", async () => {
    await ticketsRepository.buscarTodosDoUsuario(7);

    expect(prismaMock.ticket.findMany.mock.calls[0][0].where).toEqual({ userId: 7 });
  });
});
