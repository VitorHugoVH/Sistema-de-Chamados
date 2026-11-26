"use client";

import { useState, useTransition } from "react";
import { excluirChamado } from "@/lib/actions";

// client component: pede confirmação antes de chamar a server action
export default function BotaoExcluir({ id }: { id: number }) {
  const [confirmando, setConfirmando] = useState(false);
  const [erro, setErro] = useState<string>();
  const [pending, startTransition] = useTransition();

  function excluir() {
    startTransition(async () => {
      const resultado = await excluirChamado(id);
      // só retorna se deu erro; no sucesso a action redireciona
      if (resultado?.erro) setErro(resultado.erro);
    });
  }

  if (!confirmando) {
    return (
      <button type="button" onClick={() => setConfirmando(true)} className="botao-perigo">
        Excluir
      </button>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2">
      <span className="text-sm font-medium text-red-800">Excluir este chamado?</span>
      <button type="button" onClick={excluir} disabled={pending} className="botao-perigo px-3 py-1">
        {pending ? "Excluindo..." : "Sim, excluir"}
      </button>
      <button
        type="button"
        onClick={() => setConfirmando(false)}
        disabled={pending}
        className="botao-secundario px-3 py-1"
      >
        Cancelar
      </button>
      {erro && <span className="w-full text-sm text-red-700">{erro}</span>}
    </div>
  );
}
