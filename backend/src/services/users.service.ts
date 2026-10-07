import * as usersRepository from "../repositories/users.repository";
import { ErroNaoEncontrado } from "../utils/erros";

export async function buscarPorId(id: number) {
  const usuario = await usersRepository.buscarPorId(id);
  if (!usuario) throw new ErroNaoEncontrado("Usuário não encontrado");
  return usuario;
}
