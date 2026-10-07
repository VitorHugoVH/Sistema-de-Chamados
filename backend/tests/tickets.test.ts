import { beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "../src/app";
import { generateToken } from "../src/utils/jwt";
import { prismaMock } from "./prismaMock";

const user = { id: 1, name: "Maria", email: "maria@teste.com", createdAt: new Date(), updatedAt: new Date() };
const token = generateToken(user.id);
const auth = { Authorization: `Bearer ${token}` };

const validTicket = {
  title: "Impressora não liga",
  description: "A impressora do 2º andar não liga",
  categoryId: 1,
};

beforeEach(() => {
  // O middleware de autenticação busca o usuário do token no banco
  prismaMock.user.findUnique.mockResolvedValue(user);
});

describe("Proteção por JWT", () => {
  it("retorna 401 sem o header Authorization", async () => {
    const response = await request(app).get("/tickets");
    expect(response.status).toBe(401);
  });

  it("retorna 401 com token inválido", async () => {
    const response = await request(app).get("/tickets").set("Authorization", "Bearer token-falso");
    expect(response.status).toBe(401);
  });

  it("retorna 401 quando o formato não é Bearer", async () => {
    const response = await request(app).get("/tickets").set("Authorization", token);
    expect(response.status).toBe(401);
  });

  it("permite o acesso com token válido", async () => {
    prismaMock.ticket.findMany.mockResolvedValue([]);
    const response = await request(app).get("/tickets").set(auth);
    expect(response.status).toBe(200);
  });
});

describe("POST /tickets", () => {
  it("cria o chamado usando o userId do JWT, ignorando o do corpo", async () => {
    prismaMock.category.findUnique.mockResolvedValue({ id: 1, name: "Hardware" });
    prismaMock.ticket.create.mockResolvedValue({ id: 10, ...validTicket, userId: user.id });

    const response = await request(app)
      .post("/tickets")
      .set(auth)
      .send({ ...validTicket, userId: 999 });

    expect(response.status).toBe(201);
    const { data } = prismaMock.ticket.create.mock.calls[0][0];
    expect(data.userId).toBe(user.id);
  });

  it("retorna 400 quando a categoria não existe", async () => {
    prismaMock.category.findUnique.mockResolvedValue(null);

    const response = await request(app).post("/tickets").set(auth).send(validTicket);

    expect(response.status).toBe(400);
    expect(prismaMock.ticket.create).not.toHaveBeenCalled();
  });

  it("retorna 400 com prioridade inválida", async () => {
    const response = await request(app)
      .post("/tickets")
      .set(auth)
      .send({ ...validTicket, priority: "URGENTE" });

    expect(response.status).toBe(400);
    expect(response.body.detalhes[0]).toMatch(/^priority:/);
  });
});

describe("PUT /tickets/:id e DELETE /tickets/:id", () => {
  it("retorna 400 com status inválido", async () => {
    const response = await request(app).put("/tickets/1").set(auth).send({ status: "FEITO" });
    expect(response.status).toBe(400);
  });

  it("retorna 404 ao atualizar chamado inexistente", async () => {
    prismaMock.ticket.findFirst.mockResolvedValue(null);
    const response = await request(app).put("/tickets/99").set(auth).send({ status: "CLOSED" });
    expect(response.status).toBe(404);
    expect(prismaMock.ticket.update).not.toHaveBeenCalled();
  });

  it("retorna 404 ao excluir chamado inexistente", async () => {
    prismaMock.ticket.findFirst.mockResolvedValue(null);
    const response = await request(app).delete("/tickets/99").set(auth);
    expect(response.status).toBe(404);
    expect(prismaMock.ticket.delete).not.toHaveBeenCalled();
  });

  it("retorna 400 quando o id não é numérico", async () => {
    const response = await request(app).get("/tickets/abc").set(auth);
    expect(response.status).toBe(400);
  });
});
