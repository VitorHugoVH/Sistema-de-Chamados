"use client";

import { useActionState } from "react";
import { criarCategoria } from "@/lib/actions";
import BotaoEnviar from "./BotaoEnviar";
import MensagemErro from "./MensagemErro";

export default function FormCategoria() {
  const [estado, acao] = useActionState(criarCategoria, {});

  // o react limpa o formulário sozinho depois que a action termina
  return (
    <form action={acao} className="space-y-4">
      <MensagemErro estado={estado} />
      {estado.sucesso && (
        <p role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {estado.sucesso}
        </p>
      )}

      <div>
        <label htmlFor="name" className="rotulo">
          Nome
        </label>
        <input
          id="name"
          name="name"
          required
          minLength={2}
          maxLength={50}
          defaultValue={estado.valores?.name}
          className="campo"
        />
      </div>

      <div>
        <label htmlFor="description" className="rotulo">
          Descrição <span className="font-normal text-slate-400">(opcional)</span>
        </label>
        <input
          id="description"
          name="description"
          maxLength={255}
          defaultValue={estado.valores?.description}
          className="campo"
        />
      </div>

      <BotaoEnviar textoEnviando="Criando...">Criar categoria</BotaoEnviar>
    </form>
  );
}
