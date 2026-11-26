import type { Metadata } from "next";
import Link from "next/link";
import FiltroChamados from "@/components/FiltroChamados";
import { buscarChamados } from "@/lib/data";
import { STATUS, StatusChamado } from "@/lib/definitions";

export const metadata: Metadata = {
  title: "Meus chamados",
};

// server component: busca os chamados na api usando o jwt do cookie
export default async function ChamadosPage() {
  const chamados = await buscarChamados();

  const totalPorStatus = (Object.keys(STATUS) as StatusChamado[]).map((status) => ({
    status,
    total: chamados.filter((chamado) => chamado.status === status).length,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Meus chamados</h1>
          <p className="text-sm text-slate-600">Acompanhe e gerencie suas solicitações.</p>
        </div>
        <Link href="/chamados/novo" className="botao">
          + Novo chamado
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {totalPorStatus.map(({ status, total }) => (
          <div key={status} className="cartao p-4">
            <p className="text-sm text-slate-500">{STATUS[status]}</p>
            <p className="text-2xl font-bold">{total}</p>
          </div>
        ))}
      </div>

      {chamados.length === 0 ? (
        <div className="cartao space-y-3 p-10 text-center">
          <p className="text-slate-600">Você ainda não abriu nenhum chamado.</p>
          <Link href="/chamados/novo" className="botao">
            Abrir primeiro chamado
          </Link>
        </div>
      ) : (
        <FiltroChamados chamados={chamados} />
      )}
    </div>
  );
}
