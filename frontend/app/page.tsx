import Image from "next/image";
import Link from "next/link";
import { buscarCategorias } from "@/lib/data";
import { obterUsuario } from "@/lib/sessao";

// página inicial pública (server component)
export default async function Home() {
  const [usuario, categorias] = await Promise.all([obterUsuario(), buscarCategorias().catch(() => [])]);

  return (
    <div className="space-y-12">
      <section className="flex flex-col items-center gap-6 py-10 text-center">
        <Image src="/logo.svg" alt="" width={88} height={88} priority />
        <h1 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
          Abra e acompanhe seus chamados de suporte
        </h1>
        <p className="max-w-xl text-lg text-slate-600">
          Registre problemas, defina a prioridade e acompanhe cada solicitação até ser resolvida.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {usuario ? (
            <>
              <Link href="/chamados" className="botao">
                Ver meus chamados
              </Link>
              <Link href="/chamados/novo" className="botao-secundario">
                Abrir chamado
              </Link>
            </>
          ) : (
            <>
              <Link href="/cadastro" className="botao">
                Criar conta grátis
              </Link>
              <Link href="/login" className="botao-secundario">
                Já tenho conta
              </Link>
            </>
          )}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Categorias atendidas</h2>
        {categorias.length === 0 ? (
          <p className="text-slate-500">Nenhuma categoria disponível no momento.</p>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {categorias.map((categoria) => (
              <li key={categoria.id} className="cartao p-4">
                <p className="font-semibold">{categoria.name}</p>
                {categoria.description && <p className="mt-1 text-sm text-slate-600">{categoria.description}</p>}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
