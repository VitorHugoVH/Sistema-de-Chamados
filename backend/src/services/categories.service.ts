import * as categoriesRepository from "../repositories/categories.repository";
import { CriarCategoriaInput } from "../schemas/category.schema";
import { ErroConflito, ErroNaoEncontrado } from "../utils/erros";

export async function listar() {
  return categoriesRepository.buscarTodas();
}

export async function buscarPorId(id: number) {
  const categoria = await categoriesRepository.buscarPorId(id);
  if (!categoria) throw new ErroNaoEncontrado("Categoria não encontrada");
  return categoria;
}

export async function criar(dados: CriarCategoriaInput) {
  const existente = await categoriesRepository.buscarPorNome(dados.name);
  if (existente) throw new ErroConflito("Já existe uma categoria com esse nome");

  return categoriesRepository.criar(dados);
}
