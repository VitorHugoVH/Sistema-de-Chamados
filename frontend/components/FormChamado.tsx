"use client";

import Link from "next/link";
import { useActionState } from "react";
import { atualizarChamado, criarChamado } from "@/lib/actions";
import { Categoria, Chamado, PRIORIDADES, STATUS } from "@/lib/definitions";
import BotaoEnviar from "./BotaoEnviar";
import MensagemErro from "./MensagemErro";

interface Props {
  categorias: Categoria[];
  chamado?: Chamado; // presente = modo edição
}

// mesmo formulário para criar e editar
export default function FormChamado({ categorias, chamado }: Props) {
  const acaoServidor = chamado ? atualizarChamado.bind(null, chamado.id) : criarChamado;
  const [estado, acao] = useActionState(acaoServidor, {});

  // após erro, mantém o que o usuário digitou
  const valor = (campo: string, padrao?: string | number) => estado.valores?.[campo] ?? String(padrao ?? "");

  return (
    <form action={acao} className="space-y-5">
      <MensagemErro estado={estado} />

      <div>
        <label htmlFor="title" className="rotulo">
          Título
        </label>
        <input
          id="title"
          name="title"
          required
          minLength={3}
          maxLength={120}
          placeholder="Ex.: Impressora do financeiro não imprime"
          defaultValue={valor("title", chamado?.title)}
          className="campo"
        />
      </div>

      <div>
        <label htmlFor="description" className="rotulo">
          Descrição
        </label>
        <textarea
          id="description"
          name="description"
          required
          minLength={5}
          maxLength={2000}
          rows={5}
          placeholder="Descreva o problema com o máximo de detalhes"
          defaultValue={valor("description", chamado?.description)}
          className="campo"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="categoryId" className="rotulo">
            Categoria
          </label>
          <select
            id="categoryId"
            name="categoryId"
            required
            defaultValue={valor("categoryId", chamado?.categoryId)}
            className="campo"
          >
            <option value="" disabled>
              Selecione...
            </option>
            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="priority" className="rotulo">
            Prioridade
          </label>
          <select
            id="priority"
            name="priority"
            defaultValue={valor("priority", chamado?.priority ?? "MEDIUM")}
            className="campo"
          >
            {Object.entries(PRIORIDADES).map(([chave, rotulo]) => (
              <option key={chave} value={chave}>
                {rotulo}
              </option>
            ))}
          </select>
        </div>

        {/* status só aparece na edição: chamado novo sempre começa aberto */}
        {chamado && (
          <div>
            <label htmlFor="status" className="rotulo">
              Status
            </label>
            <select id="status" name="status" defaultValue={valor("status", chamado.status)} className="campo">
              {Object.entries(STATUS).map(([chave, rotulo]) => (
                <option key={chave} value={chave}>
                  {rotulo}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <BotaoEnviar textoEnviando="Salvando...">{chamado ? "Salvar alterações" : "Abrir chamado"}</BotaoEnviar>
        <Link href={chamado ? `/chamados/${chamado.id}` : "/chamados"} className="botao-secundario">
          Cancelar
        </Link>
      </div>
    </form>
  );
}
