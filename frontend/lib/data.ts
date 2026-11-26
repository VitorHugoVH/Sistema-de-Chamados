import { notFound } from "next/navigation";
import { api, ApiError } from "./api";
import { Categoria, Chamado } from "./definitions";

// funções de leitura usadas pelos server components

export function buscarCategorias() {
  return api<Categoria[]>("/categories", { autenticado: false });
}

export function buscarChamados() {
  return api<Chamado[]>("/tickets");
}

export async function buscarChamado(id: string) {
  try {
    return await api<Chamado>(`/tickets/${id}`);
  } catch (erro) {
    // 404 (não existe ou é de outro usuário) e 400 (id inválido) viram página de não encontrado
    if (erro instanceof ApiError && (erro.status === 404 || erro.status === 400)) notFound();
    throw erro;
  }
}
