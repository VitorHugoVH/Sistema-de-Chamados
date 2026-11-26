"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { api, ApiError } from "./api";
import { Categoria, Chamado, EstadoFormulario, RespostaLogin, Usuario } from "./definitions";
import { encerrarSessao, salvarSessao } from "./sessao";

// server actions: rodam no servidor, chamadas direto pelos formulários

function texto(formData: FormData, campo: string) {
  return String(formData.get(campo) ?? "").trim();
}

// transforma o erro da api no estado que o formulário mostra
function estadoDeErro(erro: unknown, valores?: Record<string, string>): EstadoFormulario {
  if (erro instanceof ApiError) {
    return { erro: erro.message, detalhes: erro.detalhes, valores };
  }
  throw erro;
}

// evita redirecionar para outro site depois do login
function destinoSeguro(destino: string) {
  return destino.startsWith("/") && !destino.startsWith("//") ? destino : "/chamados";
}

// ---------- autenticação ----------

export async function login(_estado: EstadoFormulario, formData: FormData): Promise<EstadoFormulario> {
  const email = texto(formData, "email");
  const password = String(formData.get("password") ?? "");

  try {
    const { token, user } = await api<RespostaLogin>("/auth/login", {
      method: "POST",
      autenticado: false,
      body: JSON.stringify({ email, password }),
    });
    await salvarSessao(token, user);
  } catch (erro) {
    return estadoDeErro(erro, { email });
  }

  redirect(destinoSeguro(texto(formData, "redirect")));
}

export async function cadastrar(_estado: EstadoFormulario, formData: FormData): Promise<EstadoFormulario> {
  const name = texto(formData, "name");
  const email = texto(formData, "email");
  const password = String(formData.get("password") ?? "");

  try {
    await api<Usuario>("/auth/register", {
      method: "POST",
      autenticado: false,
      body: JSON.stringify({ name, email, password }),
    });

    // depois de cadastrar já entra no sistema
    const { token, user } = await api<RespostaLogin>("/auth/login", {
      method: "POST",
      autenticado: false,
      body: JSON.stringify({ email, password }),
    });
    await salvarSessao(token, user);
  } catch (erro) {
    return estadoDeErro(erro, { name, email });
  }

  redirect("/chamados");
}

export async function sair() {
  await encerrarSessao();
  redirect("/login");
}

// ---------- chamados ----------

function dadosDoChamado(formData: FormData) {
  return {
    title: texto(formData, "title"),
    description: texto(formData, "description"),
    categoryId: Number(formData.get("categoryId")),
    priority: texto(formData, "priority"),
  };
}

function valoresDoFormulario(formData: FormData) {
  return Object.fromEntries(
    ["title", "description", "categoryId", "priority", "status"].map((campo) => [campo, texto(formData, campo)]),
  );
}

export async function criarChamado(_estado: EstadoFormulario, formData: FormData): Promise<EstadoFormulario> {
  let chamado: Chamado;
  try {
    chamado = await api<Chamado>("/tickets", {
      method: "POST",
      body: JSON.stringify(dadosDoChamado(formData)),
    });
  } catch (erro) {
    return estadoDeErro(erro, valoresDoFormulario(formData));
  }

  revalidatePath("/chamados");
  redirect(`/chamados/${chamado.id}`);
}

// o id chega via .bind() no componente
export async function atualizarChamado(
  id: number,
  _estado: EstadoFormulario,
  formData: FormData,
): Promise<EstadoFormulario> {
  try {
    await api<Chamado>(`/tickets/${id}`, {
      method: "PUT",
      body: JSON.stringify({ ...dadosDoChamado(formData), status: texto(formData, "status") }),
    });
  } catch (erro) {
    return estadoDeErro(erro, valoresDoFormulario(formData));
  }

  revalidatePath("/chamados");
  revalidatePath(`/chamados/${id}`);
  redirect(`/chamados/${id}`);
}

export async function excluirChamado(id: number): Promise<EstadoFormulario> {
  try {
    await api(`/tickets/${id}`, { method: "DELETE" });
  } catch (erro) {
    return estadoDeErro(erro);
  }

  revalidatePath("/chamados");
  redirect("/chamados");
}

// ---------- categorias ----------

export async function criarCategoria(_estado: EstadoFormulario, formData: FormData): Promise<EstadoFormulario> {
  const name = texto(formData, "name");
  const description = texto(formData, "description");

  try {
    const categoria = await api<Categoria>("/categories", {
      method: "POST",
      body: JSON.stringify({ name, description: description || undefined }),
    });
    revalidatePath("/categorias");
    return { sucesso: `Categoria "${categoria.name}" criada.` };
  } catch (erro) {
    return estadoDeErro(erro, { name, description });
  }
}
