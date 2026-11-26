import type { Metadata } from "next";
import Link from "next/link";
import FormChamado from "@/components/FormChamado";
import { buscarCategorias } from "@/lib/data";

export const metadata: Metadata = {
  title: "Novo chamado",
};

export default async function NovoChamadoPage() {
  const categorias = await buscarCategorias();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link href="/chamados" className="text-sm text-indigo-600 hover:underline">
          ← Voltar
        </Link>
        <h1 className="mt-2 text-2xl font-bold">Novo chamado</h1>
      </div>

      <div className="cartao p-6">
        {categorias.length === 0 ? (
          <p className="text-slate-600">
            Nenhuma categoria cadastrada.{" "}
            <Link href="/categorias" className="font-semibold text-indigo-600 hover:underline">
              Crie uma categoria
            </Link>{" "}
            antes de abrir um chamado.
          </p>
        ) : (
          <FormChamado categorias={categorias} />
        )}
      </div>
    </div>
  );
}
