"use client";

import { useActionState } from "react";
import { cadastrar } from "@/lib/actions";
import BotaoEnviar from "./BotaoEnviar";
import MensagemErro from "./MensagemErro";

export default function FormCadastro() {
  const [estado, acao] = useActionState(cadastrar, {});

  return (
    <form action={acao} className="space-y-4">
      <MensagemErro estado={estado} />

      <div>
        <label htmlFor="name" className="rotulo">
          Nome
        </label>
        <input
          id="name"
          name="name"
          required
          minLength={2}
          maxLength={100}
          autoComplete="name"
          defaultValue={estado.valores?.name}
          className="campo"
        />
      </div>

      <div>
        <label htmlFor="email" className="rotulo">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          defaultValue={estado.valores?.email}
          className="campo"
        />
      </div>

      <div>
        <label htmlFor="password" className="rotulo">
          Senha
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={6}
          maxLength={72}
          autoComplete="new-password"
          className="campo"
        />
        <p className="mt-1 text-xs text-slate-500">Mínimo de 6 caracteres.</p>
      </div>

      <BotaoEnviar textoEnviando="Criando conta...">Criar conta</BotaoEnviar>
    </form>
  );
}
