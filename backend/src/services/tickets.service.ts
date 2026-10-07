import * as categoriesRepository from "../repositories/categories.repository";
import * as ticketsRepository from "../repositories/tickets.repository";
import { AtualizarTicketInput, CriarTicketInput } from "../schemas/ticket.schema";
import { ErroNaoEncontrado, ErroValidacao } from "../utils/erros";

export async function listar(userId: number) {
  return ticketsRepository.buscarTodosDoUsuario(userId);
}

// só acessa os próprios chamados
export async function buscarPorId(id: number, userId: number) {
  const ticket = await ticketsRepository.buscarPorIdDoUsuario(id, userId);
  if (!ticket) throw new ErroNaoEncontrado("Chamado não encontrado");
  return ticket;
}

// userId vem do token
export async function criar(dados: CriarTicketInput, userId: number) {
  await garantirCategoriaExiste(dados.categoryId);
  return ticketsRepository.criar({ ...dados, userId });
}

export async function atualizar(id: number, dados: AtualizarTicketInput, userId: number) {
  await buscarPorId(id, userId);

  if (dados.categoryId !== undefined) {
    await garantirCategoriaExiste(dados.categoryId);
  }

  return ticketsRepository.atualizar(id, dados);
}

export async function remover(id: number, userId: number) {
  await buscarPorId(id, userId);
  await ticketsRepository.remover(id);
}

async function garantirCategoriaExiste(categoryId: number) {
  const categoria = await categoriesRepository.buscarPorId(categoryId);
  if (!categoria) {
    throw new ErroValidacao([`categoryId ${categoryId} não corresponde a nenhuma categoria existente`]);
  }
}
