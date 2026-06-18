"use client";

import { useEffect, useState } from "react";
import { ColunaTarefa, COLUNAS_TAREFA, NovaTarefa, Prioridade, Tarefa } from "@/lib/types";

function valoresIniciais(
  colunaPadrao: ColunaTarefa,
  prazoPadrao?: string,
  responsavelPadrao?: string
): NovaTarefa {
  return {
    titulo: "",
    descricao: "",
    responsavel: responsavelPadrao ?? "",
    prazo: prazoPadrao ?? "",
    prioridade: "media",
    coluna: colunaPadrao,
  };
}

export default function TaskModal({
  tarefa,
  colunaPadrao,
  prazoPadrao,
  responsavelPadrao,
  onFechar,
  onSalvar,
  onExcluir,
  onDuplicar,
}: {
  tarefa: Tarefa | null;
  colunaPadrao: ColunaTarefa;
  prazoPadrao?: string;
  responsavelPadrao?: string;
  onFechar: () => void;
  onSalvar: (id: string | null, valores: NovaTarefa) => Promise<void>;
  onExcluir: (id: string) => Promise<void>;
  onDuplicar: (tarefa: Tarefa) => void;
}) {
  const [valores, setValores] = useState<NovaTarefa>(
    tarefa
      ? {
          titulo: tarefa.titulo,
          descricao: tarefa.descricao ?? "",
          responsavel: tarefa.responsavel ?? "",
          prazo: tarefa.prazo ?? "",
          prioridade: tarefa.prioridade,
          coluna: tarefa.coluna,
        }
      : valoresIniciais(colunaPadrao, prazoPadrao, responsavelPadrao)
  );
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  function campo<K extends keyof NovaTarefa>(chave: K, valor: NovaTarefa[K]) {
    setValores((v) => ({ ...v, [chave]: valor }));
  }

  async function salvar() {
    if (!valores.titulo.trim()) return;
    setSalvando(true);
    try {
      await onSalvar(tarefa?.id ?? null, {
        ...valores,
        descricao: valores.descricao?.trim() ? valores.descricao : null,
        responsavel: valores.responsavel?.trim() ? valores.responsavel : null,
        prazo: valores.prazo || null,
      });
    } finally {
      setSalvando(false);
    }
  }

  async function fecharSalvando() {
    if (valores.titulo.trim()) {
      await salvar();
    } else {
      onFechar();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="absolute inset-0" onClick={fecharSalvando} />
      <div className="relative flex max-h-[90vh] w-full max-w-md flex-col overflow-y-auto rounded-xl bg-zinc-800 shadow-2xl">
        <div className="flex items-center justify-between border-b border-zinc-700 px-5 py-4">
          <h2 className="text-base font-semibold text-zinc-100">
            {tarefa ? "Editar tarefa" : "Nova tarefa"}
          </h2>
          <button
            onClick={fecharSalvando}
            className="rounded p-1 text-zinc-600 hover:bg-zinc-900 hover:text-zinc-300"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col gap-4 px-5 py-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-400">
              Título
            </label>
            <input
              value={valores.titulo}
              onChange={(e) => campo("titulo", e.target.value)}
              className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-400">
              Descrição
            </label>
            <textarea
              value={valores.descricao ?? ""}
              onChange={(e) => campo("descricao", e.target.value)}
              rows={3}
              className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-400">
                Responsável
              </label>
              <input
                value={valores.responsavel ?? ""}
                onChange={(e) => campo("responsavel", e.target.value)}
                placeholder="Ex: Victoria"
                className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-400">
                Prazo
              </label>
              <input
                type="date"
                value={valores.prazo ?? ""}
                onChange={(e) => campo("prazo", e.target.value)}
                className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-400">
                Prioridade
              </label>
              <select
                value={valores.prioridade}
                onChange={(e) => campo("prioridade", e.target.value as Prioridade)}
                className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100"
              >
                <option value="baixa">Baixa</option>
                <option value="media">Média</option>
                <option value="alta">Alta</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-400">
                Coluna
              </label>
              <select
                value={valores.coluna}
                onChange={(e) => campo("coluna", e.target.value as ColunaTarefa)}
                className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100"
              >
                {COLUNAS_TAREFA.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.titulo}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 border-t border-zinc-700 px-5 py-4">
          {tarefa ? (
            <div className="flex items-center gap-1">
              <button
                onClick={() => onExcluir(tarefa.id)}
                className="rounded-md px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-500/10"
              >
                Excluir
              </button>
              <button
                onClick={() => onDuplicar(tarefa)}
                className="rounded-md px-3 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-900"
              >
                Duplicar
              </button>
            </div>
          ) : (
            <span />
          )}
          <button
            onClick={fecharSalvando}
            disabled={salvando}
            className="rounded-md bg-oliva px-4 py-2 text-sm font-medium text-white hover:bg-oliva-forte disabled:opacity-50"
          >
            {salvando ? "Salvando..." : "Fechar"}
          </button>
        </div>
      </div>
    </div>
  );
}
