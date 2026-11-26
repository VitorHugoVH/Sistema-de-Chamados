import { cookies } from "next/headers";
import { COOKIE_TOKEN, COOKIE_USUARIO, DURACAO_SESSAO_SEGUNDOS } from "./constantes";
import { Usuario } from "./definitions";

// httpOnly: o javascript do navegador não consegue ler o token
const opcoesCookie = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: DURACAO_SESSAO_SEGUNDOS,
};

export async function salvarSessao(token: string, usuario: Usuario) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_TOKEN, token, opcoesCookie);
  cookieStore.set(COOKIE_USUARIO, JSON.stringify(usuario), opcoesCookie);
}

export async function encerrarSessao() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_TOKEN);
  cookieStore.delete(COOKIE_USUARIO);
}

export async function obterToken() {
  return (await cookies()).get(COOKIE_TOKEN)?.value;
}

export async function obterUsuario(): Promise<Usuario | null> {
  const cookieStore = await cookies();
  if (!cookieStore.get(COOKIE_TOKEN)) return null;

  const valor = cookieStore.get(COOKIE_USUARIO)?.value;
  if (!valor) return null;

  try {
    const usuario = JSON.parse(valor) as Usuario;
    return typeof usuario?.name === "string" ? usuario : null;
  } catch {
    return null;
  }
}
