import { NextRequest, NextResponse } from "next/server";
import { COOKIE_TOKEN, COOKIE_USUARIO } from "./lib/constantes";

// lê o "exp" do jwt sem verificar a assinatura (quem verifica é a api)
// só serve para não renderizar a página com um token já vencido
function tokenValido(token: string | undefined) {
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    return typeof payload.exp === "number" && payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

// roda antes da página: protege as rotas privadas
export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const token = request.cookies.get(COOKIE_TOKEN)?.value;
  const logado = tokenValido(token);
  const rotaDeAuth = pathname === "/login" || pathname === "/cadastro";

  // sem token (ou vencido) tentando acessar área privada: vai pro login e volta depois
  if (!logado && !rotaDeAuth) {
    const url = new URL("/login", request.url);
    url.searchParams.set("redirect", pathname + search);
    if (token) url.searchParams.set("expirado", "1");

    const resposta = NextResponse.redirect(url);
    resposta.cookies.delete(COOKIE_TOKEN);
    resposta.cookies.delete(COOKIE_USUARIO);
    return resposta;
  }

  // já logado não precisa ver login/cadastro
  if (logado && rotaDeAuth) {
    return NextResponse.redirect(new URL("/chamados", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/chamados/:path*", "/login", "/cadastro"],
};
