jest.mock("../../src/repositories/users.repository");

import bcrypt from "bcrypt";
import * as usersRepository from "../../src/repositories/users.repository";
import * as authService from "../../src/services/auth.service";
import { gerarToken, verificarToken } from "../../src/utils/jwt";

const repo = jest.mocked(usersRepository);
const usuario = { id: 1, name: "Maria", email: "maria@teste.com", createdAt: new Date(), updatedAt: new Date() };

describe("auth.service", () => {
  describe("registrar", () => {
    it("salva o hash da senha, nunca a senha em texto puro", async () => {
      repo.buscarPorEmail.mockResolvedValue(null);
      repo.criar.mockResolvedValue(usuario);

      await authService.registrar({ name: "Maria", email: "maria@teste.com", password: "senha123" });

      const dados = repo.criar.mock.calls[0][0];
      expect(dados.passwordHash).not.toBe("senha123");
      expect(await bcrypt.compare("senha123", dados.passwordHash)).toBe(true);
    });

    it("lança ErroConflito (409) quando o email já existe", async () => {
      repo.buscarPorEmail.mockResolvedValue({ ...usuario, passwordHash: "hash" });

      await expect(
        authService.registrar({ name: "Maria", email: "maria@teste.com", password: "senha123" }),
      ).rejects.toMatchObject({ name: "ErroConflito", status: 409 });
      expect(repo.criar).not.toHaveBeenCalled();
    });
  });

  describe("login", () => {
    it("retorna um JWT válido quando email e senha estão corretos", async () => {
      repo.buscarPorEmail.mockResolvedValue({ ...usuario, passwordHash: await bcrypt.hash("senha123", 4) });

      const resultado = await authService.login({ email: "maria@teste.com", password: "senha123" });

      expect(verificarToken(resultado.token).sub).toBe("1");
      expect(resultado.user).toEqual({ id: 1, name: "Maria", email: "maria@teste.com" });
    });

    it("lança ErroNaoAutorizado (401) quando a senha está errada", async () => {
      repo.buscarPorEmail.mockResolvedValue({ ...usuario, passwordHash: await bcrypt.hash("senha123", 4) });

      await expect(authService.login({ email: "maria@teste.com", password: "errada" })).rejects.toMatchObject({
        status: 401,
      });
    });

    it("lança ErroNaoAutorizado (401) quando o email não existe", async () => {
      repo.buscarPorEmail.mockResolvedValue(null);

      await expect(authService.login({ email: "x@teste.com", password: "senha123" })).rejects.toMatchObject({
        status: 401,
      });
    });
  });

  describe("validarToken", () => {
    it("retorna o usuário dono de um token válido", async () => {
      repo.buscarPorId.mockResolvedValue(usuario);

      await expect(authService.validarToken(gerarToken(1))).resolves.toEqual({
        id: 1,
        name: "Maria",
        email: "maria@teste.com",
      });
    });

    it("lança 401 para token inválido", async () => {
      await expect(authService.validarToken("token-falso")).rejects.toMatchObject({ status: 401 });
    });

    it("lança 401 quando o usuário do token não existe mais", async () => {
      repo.buscarPorId.mockResolvedValue(null);
      await expect(authService.validarToken(gerarToken(99))).rejects.toMatchObject({ status: 401 });
    });
  });
});
