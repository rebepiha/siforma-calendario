"use client";

import { useEffect, useState } from "react";
import {
  COLUNAS_SITE,
  NovaTarefaSite,
  Prioridade,
  StatusTarefaSite,
  TarefaSite,
} from "@/lib/types";

export default function SiteTaskModal({
  tarefa,
  statusPadrao,
  onFechar,
  onSalvar,
  onExcluir,
}: {
  tarefa: TarefaSite | null;
  statusPadrao: StatusTarefaSite;
  onFechar: () => void;
  onSalvar: (id: string | null, valores: NovaTarefaSite) => Promise<void>;
  onExcluir: (id: string) => Promise<void>;
}) {
  const [valores, setValores] = useState<NovaTarefaSite>(
    tarefa
      ? {
          titulo: tarefa.titulo,
          descricao: tarefa.descricao ?? "",
          status: tarefa.status,
          prioridade: tarefa.prioridade,
          cor: null,
          ordem: tarefa.ordem,
        }
      : {
          titulo: "",
          descricao: "",
          status: statusPadrao,
          prioridade: "media",
          cor: null,
          ordem: 0,
        }
  );
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  function campo<K extends keyof NovaTarefaSite>(chave: K, valor: NovaTarefaSite[K]) {
    setValores((v) => ({ ...v, [chave]: valor }));
  }

  async function salvar() {
    if (!valores.titulo.trim()) return;
    setSalvando(true);
    try {
      await onSalvar(tarefa?.id ?? null, {
        ...valores,
        descricao: valores.descricao?.trim() ? valores.descricao : null,
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
              autoFocus
              value={valores.titulo}
              onChange={(e) => campo("titulo", e.target.value)}
              placeholder="Nome da tarefa"
              className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-400">
              Detalhes
            </label>
            <textarea
              value={valores.descricao ?? ""}
              onChange={(e) => campo("descricao", e.target.value)}
              rows={6}
              placeholder="Anotações, contexto, links, o que precisar..."
              className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-400">
                Status
              </label>
              <select
                value={valores.status}
                onChange={(e) => campo("status", e.target.value as StatusTarefaSite)}
                className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100"
              >
                {COLUNAS_SITE.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.titulo}
                  </option>
                ))}
              </select>
            </div>
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
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 border-t border-zinc-700 px-5 py-4">
          {tarefa ? (
            <button
              onClick={() => onExcluir(tarefa.id)}
              className="rounded-md px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-500/10"
            >
              Excluir
            </button>
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
