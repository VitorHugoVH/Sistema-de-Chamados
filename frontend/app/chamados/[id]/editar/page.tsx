import type { Metadata } from "next";
import Link from "next/link";
import FormChamado from "@/components/FormChamado";
import { buscarCategorias, buscarChamado } from "@/lib/data";

export const metadata: Metadata = {
  title: "Editar chamado",
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditarChamadoPage({ params }: Props) {
  const { id } = await params;
  // as duas buscas em paralelo
  const [chamado, categorias] = await Promise.all([buscarChamado(id), buscarCategorias()]);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link href={`/chamados/${chamado.id}`} className="text-sm text-indigo-600 hover:underline">
          ← Voltar
        </Link>
        <h1 className="mt-2 text-2xl font-bold">
          Editar chamado <span className="text-slate-400">#{chamado.id}</span>
        </h1>
      </div>

      <div className="cartao p-6">
        <FormChamado categorias={categorias} chamado={chamado} />
      </div>
    </div>
  );
}
