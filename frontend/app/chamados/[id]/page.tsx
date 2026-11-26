import type { Metadata } from "next";
import Link from "next/link";
import BotaoExcluir from "@/components/BotaoExcluir";
import { EtiquetaPrioridade, EtiquetaStatus } from "@/components/Etiquetas";
import { buscarChamado } from "@/lib/data";
import { formatarData } from "@/lib/formatar";

interface Props {
  params: Promise<{ id: string }>;
}

// título da aba com o nome do chamado
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const chamado = await buscarChamado(id);
  return { title: `#${chamado.id} ${chamado.title}` };
}

export default async function ChamadoPage({ params }: Props) {
  const { id } = await params;
  const chamado = await buscarChamado(id);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link href="/chamados" className="text-sm text-indigo-600 hover:underline">
        ← Voltar para meus chamados
      </Link>

      <article className="cartao space-y-6 p-6">
        <header className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <EtiquetaStatus status={chamado.status} />
            <EtiquetaPrioridade prioridade={chamado.priority} />
          </div>
          <h1 className="text-2xl font-bold">
            <span className="text-slate-400">#{chamado.id}</span> {chamado.title}
          </h1>
        </header>

        <p className="whitespace-pre-wrap text-slate-700">{chamado.description}</p>

        <dl className="grid gap-4 border-t border-slate-200 pt-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-slate-500">Categoria</dt>
            <dd className="font-medium">{chamado.category.name}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Aberto por</dt>
            <dd className="font-medium">{chamado.user.name}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Aberto em</dt>
            <dd className="font-medium">{formatarData(chamado.createdAt)}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Última atualização</dt>
            <dd className="font-medium">{formatarData(chamado.updatedAt)}</dd>
          </div>
        </dl>

        <footer className="flex flex-wrap items-center gap-3 border-t border-slate-200 pt-4">
          <Link href={`/chamados/${chamado.id}/editar`} className="botao">
            Editar
          </Link>
          <BotaoExcluir id={chamado.id} />
        </footer>
      </article>
    </div>
  );
}
