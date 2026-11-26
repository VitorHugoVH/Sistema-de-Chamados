"use client";

import { useActionState } from "react";
import { login } from "@/lib/actions";
import BotaoEnviar from "./BotaoEnviar";
import MensagemErro from "./MensagemErro";

export default function FormLogin({ redirect }: { redirect?: string }) {
  // useActionState guarda o retorno da server action (erros) entre os envios
  const [estado, acao] = useActionState(login, {});

  return (
    <form action={acao} className="space-y-4">
      <MensagemErro estado={estado} />
      <input type="hidden" name="redirect" value={redirect ?? "/chamados"} />

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
        <input id="password" name="password" type="password" required autoComplete="current-password" className="campo" />
      </div>

      <BotaoEnviar textoEnviando="Entrando...">Entrar</BotaoEnviar>
    </form>
  );
}
