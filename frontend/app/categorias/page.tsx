import type { Metadata } from "next";
import Link from "next/link";
import FormCategoria from "@/components/FormCategoria";
import { buscarCategorias } from "@/lib/data";
import { obterUsuario } from "@/lib/sessao";

export const metadata: Metadata = {
  title: "Categorias",
  description: "Categorias de chamados atendidas pelo suporte.",
};

// leitura é pública; criar categoria exige login (rota protegida na api)
export default async function CategoriasPage() {
  const [categorias, usuario] = await Promise.all([buscarCategorias(), obterUsuario()]);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <section className="space-y-4">
        <h1 className="text-2xl font-bold">Categorias</h1>
        {categorias.length === 0 ? (
          <p className="text-slate-500">Nenhuma categoria cadastrada.</p>
        ) : (
          <ul className="space-y-3">
            {categorias.map((categoria) => (
              <li key={categoria.id} className="cartao p-4">
                <p className="font-semibold">{categoria.name}</p>
                {categoria.description && <p className="mt-1 text-sm text-slate-600">{categoria.description}</p>}
              </li>
            ))}
          </ul>
        )}
      </section>

      <aside className="cartao h-fit space-y-4 p-6">
        <h2 className="text-lg font-semibold">Nova categoria</h2>
        {usuario ? (
          <FormCategoria />
        ) : (
          <p className="text-sm text-slate-600">
            <Link href="/login?redirect=/categorias" className="font-semibold text-indigo-600 hover:underline">
              Entre
            </Link>{" "}
            para cadastrar categorias.
          </p>
        )}
      </aside>
    </div>
  );
}
