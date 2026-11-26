"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Chamado, PRIORIDADES, STATUS, StatusChamado } from "@/lib/definitions";
import { formatarData } from "@/lib/formatar";
import { EtiquetaPrioridade, EtiquetaStatus } from "./Etiquetas";

// client component: os dados chegam prontos do servidor e o filtro roda no navegador (useState)
export default function FiltroChamados({ chamados }: { chamados: Chamado[] }) {
  const [busca, setBusca] = useState("");
  const [status, setStatus] = useState<StatusChamado | "TODOS">("TODOS");
  const [prioridade, setPrioridade] = useState("TODAS");

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return chamados.filter(
      (chamado) =>
        (status === "TODOS" || chamado.status === status) &&
        (prioridade === "TODAS" || chamado.priority === prioridade) &&
        (!termo ||
          chamado.title.toLowerCase().includes(termo) ||
          chamado.description.toLowerCase().includes(termo) ||
          chamado.category.name.toLowerCase().includes(termo)),
    );
  }, [chamados, busca, status, prioridade]);

  const temFiltro = busca !== "" || status !== "TODOS" || prioridade !== "TODAS";

  function limpar() {
    setBusca("");
    setStatus("TODOS");
    setPrioridade("TODAS");
  }

  return (
    <div className="space-y-4">
      <div className="cartao flex flex-col gap-3 p-4 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label htmlFor="busca" className="rotulo">
            Buscar
          </label>
          <input
            id="busca"
            type="search"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Título, descrição ou categoria"
            className="campo"
          />
        </div>
        <div>
          <label htmlFor="filtro-status" className="rotulo">
            Status
          </label>
          <select
            id="filtro-status"
            value={status}
            onChange={(e) => setStatus(e.target.value as StatusChamado | "TODOS")}
            className="campo"
          >
            <option value="TODOS">Todos</option>
            {Object.entries(STATUS).map(([chave, rotulo]) => (
              <option key={chave} value={chave}>
                {rotulo}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="filtro-prioridade" className="rotulo">
            Prioridade
          </label>
          <select
            id="filtro-prioridade"
            value={prioridade}
            onChange={(e) => setPrioridade(e.target.value)}
            className="campo"
          >
            <option value="TODAS">Todas</option>
            {Object.entries(PRIORIDADES).map(([chave, rotulo]) => (
              <option key={chave} value={chave}>
                {rotulo}
              </option>
            ))}
          </select>
        </div>
        {temFiltro && (
          <button type="button" onClick={limpar} className="botao-secundario">
            Limpar
          </button>
        )}
      </div>

      <p className="text-sm text-slate-500" aria-live="polite">
        {filtrados.length} de {chamados.length} chamado(s)
      </p>

      {filtrados.length === 0 ? (
        <div className="cartao p-8 text-center text-slate-500">Nenhum chamado encontrado com esses filtros.</div>
      ) : (
        <ul className="space-y-3">
          {filtrados.map((chamado) => (
            <li key={chamado.id}>
              <Link
                href={`/chamados/${chamado.id}`}
                className="cartao block p-4 transition hover:border-indigo-300 hover:shadow-md"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="font-semibold">
                    <span className="text-slate-400">#{chamado.id}</span> {chamado.title}
                  </h2>
                  <EtiquetaStatus status={chamado.status} />
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-slate-600">{chamado.description}</p>
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                  <span className="rounded bg-slate-100 px-2 py-0.5 font-medium text-slate-700">
                    {chamado.category.name}
                  </span>
                  <EtiquetaPrioridade prioridade={chamado.priority} />
                  <span>Aberto em {formatarData(chamado.createdAt)}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
