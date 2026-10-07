import { describe, expect, it } from "vitest";
import request from "supertest";
import bcrypt from "bcrypt";
import { app } from "../src/app";
import { verificarToken } from "../src/utils/jwt";
import { prismaMock } from "./prismaMock";

const publicUser = {
  id: 1,
  name: "Maria",
  email: "maria@teste.com",
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("POST /auth/register", () => {
  it("cadastra o usuário, salva o hash da senha e não retorna passwordHash", async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);
    prismaMock.user.create.mockResolvedValue(publicUser);

    const response = await request(app)
      .post("/auth/register")
      .send({ name: "Maria", email: "Maria@Teste.com", password: "senha123" });

    expect(response.status).toBe(201);
    expect(response.body).not.toHaveProperty("passwordHash");

    const { data } = prismaMock.user.create.mock.calls[0][0];
    expect(data.email).toBe("maria@teste.com"); // email normalizado
    expect(data.passwordHash).not.toBe("senha123");
    expect(await bcrypt.compare("senha123", data.passwordHash)).toBe(true);
  });

  it("retorna 409 quando o email já está cadastrado", async () => {
    prismaMock.user.findUnique.mockResolvedValue({ ...publicUser, passwordHash: "hash" });

    const response = await request(app)
      .post("/auth/register")
      .send({ name: "Maria", email: "maria@teste.com", password: "senha123" });

    expect(response.status).toBe(409);
    expect(prismaMock.user.create).not.toHaveBeenCalled();
  });

  it("retorna 400 com os campos inválidos", async () => {
    const response = await request(app)
      .post("/auth/register")
      .send({ name: "M", email: "email-invalido", password: "123" });

    expect(response.status).toBe(400);
    const fields = response.body.detalhes.map((detalhe: string) => detalhe.split(":")[0]);
    expect(fields).toEqual(["name", "email", "password"]);
  });
});

describe("POST /auth/login", () => {
  it("retorna um JWT válido e os dados básicos do usuário", async () => {
    const passwordHash = await bcrypt.hash("senha123", 4);
    prismaMock.user.findUnique.mockResolvedValue({ ...publicUser, passwordHash });

    const response = await request(app)
      .post("/auth/login")
      .send({ email: "maria@teste.com", password: "senha123" });

    expect(response.status).toBe(200);
    expect(response.body.user).toEqual({ id: 1, name: "Maria", email: "maria@teste.com" });
    expect(verificarToken(response.body.token).sub).toBe("1");
  });

  it("retorna 401 quando a senha está errada", async () => {
    const passwordHash = await bcrypt.hash("senha123", 4);
    prismaMock.user.findUnique.mockResolvedValue({ ...publicUser, passwordHash });

    const response = await request(app)
      .post("/auth/login")
      .send({ email: "maria@teste.com", password: "errada" });

    expect(response.status).toBe(401);
  });

  it("retorna 401 quando o email não existe", async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);

    const response = await request(app)
      .post("/auth/login")
      .send({ email: "ninguem@teste.com", password: "senha123" });

    expect(response.status).toBe(401);
  });
});
