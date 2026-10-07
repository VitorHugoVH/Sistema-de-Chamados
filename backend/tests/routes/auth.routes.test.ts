jest.mock("../../src/repositories/users.repository");

import bcrypt from "bcrypt";
import request from "supertest";
import { app } from "../../src/app";
import * as usersRepository from "../../src/repositories/users.repository";

const repo = jest.mocked(usersRepository);
const usuario = { id: 1, name: "Maria", email: "maria@teste.com", createdAt: new Date(), updatedAt: new Date() };

describe("rotas /auth", () => {
  describe("POST /auth/register", () => {
    it("cadastra o usuário (201) sem retornar passwordHash", async () => {
      repo.buscarPorEmail.mockResolvedValue(null);
      repo.criar.mockResolvedValue(usuario);

      const resposta = await request(app)
        .post("/auth/register")
        .send({ name: "Maria", email: "maria@teste.com", password: "senha123" });

      expect(resposta.status).toBe(201);
      expect(resposta.body).not.toHaveProperty("passwordHash");
    });

    it("retorna 400 com a lista de campos inválidos", async () => {
      const resposta = await request(app)
        .post("/auth/register")
        .send({ name: "M", email: "email-invalido", password: "123" });

      expect(resposta.status).toBe(400);
      expect(resposta.body.erro).toBe("Dados inválidos");
      expect(resposta.body.detalhes).toHaveLength(3);
      expect(repo.criar).not.toHaveBeenCalled();
    });

    it("retorna 409 quando o email já está cadastrado", async () => {
      repo.buscarPorEmail.mockResolvedValue({ ...usuario, passwordHash: "hash" });

      const resposta = await request(app)
        .post("/auth/register")
        .send({ name: "Maria", email: "maria@teste.com", password: "senha123" });

      expect(resposta.status).toBe(409);
    });
  });

  describe("POST /auth/login", () => {
    it("retorna 200 com o token", async () => {
      repo.buscarPorEmail.mockResolvedValue({ ...usuario, passwordHash: await bcrypt.hash("senha123", 4) });

      const resposta = await request(app).post("/auth/login").send({ email: "maria@teste.com", password: "senha123" });

      expect(resposta.status).toBe(200);
      expect(typeof resposta.body.token).toBe("string");
    });

    it("retorna 401 com senha errada", async () => {
      repo.buscarPorEmail.mockResolvedValue({ ...usuario, passwordHash: await bcrypt.hash("senha123", 4) });

      const resposta = await request(app).post("/auth/login").send({ email: "maria@teste.com", password: "errada" });

      expect(resposta.status).toBe(401);
    });
  });
});
