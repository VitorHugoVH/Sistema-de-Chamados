import { redirect } from "next/navigation";
import { obterToken } from "./sessao";

// só roda no servidor: a url da api e o token nunca vão para o navegador
const API_URL = process.env.API_URL ?? "http://localhost:3333";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    mensagem: string,
    public readonly detalhes: string[] = [],
  ) {
    super(mensagem);
  }
}

interface OpcoesApi extends RequestInit {
  autenticado?: boolean;
}

export async function api<T>(caminho: string, opcoes: OpcoesApi = {}): Promise<T> {
  const { autenticado = true, headers, ...resto } = opcoes;
  const token = autenticado ? await obterToken() : undefined;

  let resposta: Response;
  try {
    resposta = await fetch(`${API_URL}${caminho}`, {
      cache: "no-store",
      ...resto,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
    });
  } catch {
    throw new ApiError(503, "Não foi possível conectar à API. Verifique se o backend está rodando.");
  }

  // token expirado ou inválido: limpa a sessão e volta pro login
  if (resposta.status === 401 && autenticado) {
    redirect("/sair?expirado=1");
  }

  const corpo = await resposta.json().catch(() => null);

  if (!resposta.ok) {
    throw new ApiError(resposta.status, corpo?.erro ?? "Erro ao comunicar com a API", corpo?.detalhes ?? []);
  }

  return corpo as T;
}
