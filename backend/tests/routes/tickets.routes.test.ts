jest.mock("../../src/repositories/users.repository");
jest.mock("../../src/repositories/categories.repository");
jest.mock("../../src/repositories/tickets.repository");

import request from "supertest";
import { app } from "../../src/app";
import * as categoriesRepository from "../../src/repositories/categories.repository";
import * as ticketsRepository from "../../src/repositories/tickets.repository";
import * as usersRepository from "../../src/repositories/users.repository";
import { gerarToken } from "../../src/utils/jwt";

const usuarios = jest.mocked(usersRepository);
const categorias = jest.mocked(categoriesRepository);
const tickets = jest.mocked(ticketsRepository);

const usuario = { id: 1, name: "Maria", email: "maria@teste.com", createdAt: new Date(), updatedAt: new Date() };
const auth = { Authorization: `Bearer ${gerarToken(usuario.id)}` };
const ticketValido = { title: "Impressora não liga", description: "A impressora do 2º andar não liga", categoryId: 1 };

beforeEach(() => {
  // O middleware autenticar busca o usuário dono do token
  usuarios.buscarPorId.mockResolvedValue(usuario);
});

describe("Proteção por JWT", () => {
  it("retorna 401 sem o header Authorization", async () => {
    const resposta = await request(app).get("/tickets");
    expect(resposta.status).toBe(401);
  });

  it("retorna 401 com token inválido", async () => {
    const resposta = await request(app).get("/tickets").set("Authorization", "Bearer token-falso");
    expect(resposta.status).toBe(401);
  });

  it("retorna 401 quando o formato não é Bearer", async () => {
    const resposta = await request(app).get("/tickets").set("Authorization", gerarToken(1));
    expect(resposta.status).toBe(401);
  });

  it("permite o acesso com token válido", async () => {
    tickets.buscarTodosDoUsuario.mockResolvedValue([]);

    const resposta = await request(app).get("/tickets").set(auth);

    expect(resposta.status).toBe(200);
    expect(tickets.buscarTodosDoUsuario).toHaveBeenCalledWith(usuario.id);
  });
});

describe("POST /tickets", () => {
  it("cria o chamado (201) usando o userId do JWT, ignorando o do corpo", async () => {
    categorias.buscarPorId.mockResolvedValue({ id: 1 } as never);
    tickets.criar.mockResolvedValue({ id: 10, ...ticketValido, userId: usuario.id } as never);

    const resposta = await request(app)
      .post("/tickets")
      .set(auth)
      .send({ ...ticketValido, userId: 999 });

    expect(resposta.status).toBe(201);
    expect(tickets.criar).toHaveBeenCalledWith({ ...ticketValido, userId: usuario.id });
  });

  it("retorna 400 quando a categoria não existe", async () => {
    categorias.buscarPorId.mockResolvedValue(null);

    const resposta = await request(app).post("/tickets").set(auth).send(ticketValido);

    expect(resposta.status).toBe(400);
    expect(tickets.criar).not.toHaveBeenCalled();
  });

  it("retorna 400 com prioridade inválida", async () => {
    const resposta = await request(app)
      .post("/tickets")
      .set(auth)
      .send({ ...ticketValido, priority: "URGENTE" });

    expect(resposta.status).toBe(400);
    expect(resposta.body.detalhes[0]).toMatch(/^priority:/);
  });
});

describe("GET, PUT e DELETE /tickets/:id", () => {
  it("retorna 400 quando o id não é numérico", async () => {
    const resposta = await request(app).get("/tickets/abc").set(auth);
    expect(resposta.status).toBe(400);
  });

  it("retorna 404 ao atualizar chamado inexistente", async () => {
    tickets.buscarPorIdDoUsuario.mockResolvedValue(null);

    const resposta = await request(app).put("/tickets/99").set(auth).send({ status: "CLOSED" });

    expect(resposta.status).toBe(404);
  });

  it("exclui o chamado (200)", async () => {
    tickets.buscarPorIdDoUsuario.mockResolvedValue({ id: 5 } as never);
    tickets.remover.mockResolvedValue({} as never);

    const resposta = await request(app).delete("/tickets/5").set(auth);

    expect(resposta.status).toBe(200);
    expect(tickets.remover).toHaveBeenCalledWith(5);
  });
});
