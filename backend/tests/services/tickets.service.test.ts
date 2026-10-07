jest.mock("../../src/repositories/tickets.repository");
jest.mock("../../src/repositories/categories.repository");

import * as categoriesRepository from "../../src/repositories/categories.repository";
import * as ticketsRepository from "../../src/repositories/tickets.repository";
import * as ticketsService from "../../src/services/tickets.service";

const tickets = jest.mocked(ticketsRepository);
const categorias = jest.mocked(categoriesRepository);

const categoria = { id: 1, name: "Hardware", description: null, createdAt: new Date(), updatedAt: new Date() };
const dados = { title: "Impressora", description: "Não liga desde ontem", categoryId: 1 };

describe("tickets.service", () => {
  describe("criar", () => {
    it("usa o userId recebido (do JWT) como dono do chamado", async () => {
      categorias.buscarPorId.mockResolvedValue(categoria as never);
      tickets.criar.mockResolvedValue({ id: 10 } as never);

      await ticketsService.criar(dados, 7);

      expect(tickets.criar).toHaveBeenCalledWith({ ...dados, userId: 7 });
    });

    it("lança ErroValidacao (400) quando a categoria não existe", async () => {
      categorias.buscarPorId.mockResolvedValue(null);

      await expect(ticketsService.criar(dados, 7)).rejects.toMatchObject({ name: "ErroValidacao", status: 400 });
      expect(tickets.criar).not.toHaveBeenCalled();
    });
  });

  describe("buscarPorId", () => {
    it("busca filtrando pelo dono do chamado", async () => {
      tickets.buscarPorIdDoUsuario.mockResolvedValue({ id: 1 } as never);

      await ticketsService.buscarPorId(1, 7);

      expect(tickets.buscarPorIdDoUsuario).toHaveBeenCalledWith(1, 7);
    });

    it("lança ErroNaoEncontrado (404) quando o chamado não existe ou é de outro usuário", async () => {
      tickets.buscarPorIdDoUsuario.mockResolvedValue(null);
      await expect(ticketsService.buscarPorId(1, 7)).rejects.toMatchObject({ status: 404 });
    });
  });

  describe("atualizar e remover", () => {
    it("não atualiza chamado inexistente", async () => {
      tickets.buscarPorIdDoUsuario.mockResolvedValue(null);

      await expect(ticketsService.atualizar(99, { status: "CLOSED" }, 7)).rejects.toMatchObject({ status: 404 });
      expect(tickets.atualizar).not.toHaveBeenCalled();
    });

    it("não exclui chamado inexistente", async () => {
      tickets.buscarPorIdDoUsuario.mockResolvedValue(null);

      await expect(ticketsService.remover(99, 7)).rejects.toMatchObject({ status: 404 });
      expect(tickets.remover).not.toHaveBeenCalled();
    });

    it("valida a nova categoria ao atualizar", async () => {
      tickets.buscarPorIdDoUsuario.mockResolvedValue({ id: 1 } as never);
      categorias.buscarPorId.mockResolvedValue(null);

      await expect(ticketsService.atualizar(1, { categoryId: 5 }, 7)).rejects.toMatchObject({ status: 400 });
      expect(tickets.atualizar).not.toHaveBeenCalled();
    });
  });
});
