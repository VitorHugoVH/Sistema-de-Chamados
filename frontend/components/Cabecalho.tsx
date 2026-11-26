import Image from "next/image";
import Link from "next/link";
import { sair } from "@/lib/actions";
import { obterUsuario } from "@/lib/sessao";
import LinkNavegacao from "./LinkNavegacao";

// server component: lê o usuário do cookie no servidor
export default async function Cabecalho() {
  const usuario = await obterUsuario();

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Image src="/logo.svg" alt="Logo da Central de Chamados" width={32} height={32} priority />
          <span>Central de Chamados</span>
        </Link>

        <nav className="flex flex-wrap items-center gap-1 text-sm">
          <LinkNavegacao href="/categorias">Categorias</LinkNavegacao>

          {usuario ? (
            <>
              <LinkNavegacao href="/chamados">Meus chamados</LinkNavegacao>
              <span className="hidden px-2 text-slate-500 sm:inline">Olá, {usuario.name.split(" ")[0]}</span>
              <form action={sair}>
                <button type="submit" className="botao-secundario px-3 py-1.5">
                  Sair
                </button>
              </form>
            </>
          ) : (
            <>
              <LinkNavegacao href="/login">Entrar</LinkNavegacao>
              <Link href="/cadastro" className="botao px-3 py-1.5">
                Criar conta
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
