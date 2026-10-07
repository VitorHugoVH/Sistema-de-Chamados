import { Request } from "express";
import { Prisma } from "@prisma/client";
import { errorHandler } from "../../src/middlewares/errorHandler";
import { ErroNaoEncontrado, ErroValidacao } from "../../src/utils/erros";
import { criarRes } from "../helpers/http";

const req = {} as Request;
const next = jest.fn();

describe("errorHandler", () => {
  it("responde 400 com os detalhes de um ErroValidacao", () => {
    const res = criarRes();
    errorHandler(new ErroValidacao(["email: deve ser um email válido"]), req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res.payload).toEqual({ erro: "Dados inválidos", detalhes: ["email: deve ser um email válido"] });
  });

  it("usa o status dos erros da aplicação", () => {
    const res = criarRes();
    errorHandler(new ErroNaoEncontrado("Chamado não encontrado"), req, res, next);

    expect(res.statusCode).toBe(404);
    expect(res.payload).toEqual({ erro: "Chamado não encontrado" });
  });

  it("traduz o erro P2002 do Prisma (campo único) para 409", () => {
    const res = criarRes();
    const erroPrisma = new Prisma.PrismaClientKnownRequestError("Unique", { code: "P2002", clientVersion: "test" });
    errorHandler(erroPrisma, req, res, next);

    expect(res.statusCode).toBe(409);
  });

  it("responde 500 sem expor detalhes de erros inesperados", () => {
    const res = criarRes();
    jest.spyOn(console, "error").mockImplementation(() => {});
    errorHandler(new Error("senha do banco: 123"), req, res, next);

    expect(res.statusCode).toBe(500);
    expect(res.payload).toEqual({ erro: "Erro interno do servidor" });
  });
});
