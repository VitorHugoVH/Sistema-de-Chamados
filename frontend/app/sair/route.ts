import { NextRequest, NextResponse } from "next/server";
import { COOKIE_TOKEN, COOKIE_USUARIO } from "@/lib/constantes";

// route handler: usado quando a api responde 401 (token expirado)
// limpa os cookies e manda pro login
export function GET(request: NextRequest) {
  const url = new URL("/login", request.url);
  if (request.nextUrl.searchParams.get("expirado")) {
    url.searchParams.set("expirado", "1");
  }

  const resposta = NextResponse.redirect(url);
  resposta.cookies.delete(COOKIE_TOKEN);
  resposta.cookies.delete(COOKIE_USUARIO);
  return resposta;
}
