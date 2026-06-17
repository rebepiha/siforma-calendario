"use client";

import { useEffect, useState } from "react";
import { Meta, NovaMeta } from "@/lib/types";

function valoresIniciais(): NovaMeta {
  return {
    titulo: "",
    valor_atual: 0,
    valor_meta: 0,
    unidade: "",
    prazo: "",
    categoria: "",
  };
}

export default function GoalModal({
  meta,
  onFechar,
  onSalvar,
  onExcluir,
}: {
  meta: Meta | null;
  onFechar: () => void;
  onSalvar: (id: string | null, valores: NovaMeta) => Promise<void>;
  onExcluir: (id: string) => Promise<void>;
}) {
  const [valores, setValores] = useState<NovaMeta>(
    meta
      ? {
          titulo: meta.titulo,
          valor_atual: meta.valor_atual,
          valor_meta: meta.valor_meta,
          unidade: meta.unidade ?? "",
          prazo: meta.prazo ?? "",
          categoria: meta.categoria ?? "",
        }
      : valoresIniciais()
  );
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  function campo<K extends keyof NovaMeta>(chave: K, valor: NovaMeta[K]) {
    setValores((v) => ({ ...v, [chave]: valor }));
  }

  async function salvar() {
    if (!valores.titulo.trim() || valores.valor_meta <= 0) return;
    setSalvando(true);
    try {
      await onSalvar(meta?.id ?? null, {
        ...valores,
        unidade: valores.unidade?.trim() ? valores.unidade : null,
        categoria: valores.categoria?.trim() ? valores.categoria : null,
        prazo: valores.prazo || null,
      });
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="absolute inset-0" onClick={onFechar} />
      <div className="relative flex max-h-[90vh] w-full max-w-md flex-col overflow-y-auto rounded-xl bg-zinc-800 shadow-2xl">
        <div className="flex items-center justify-between border-b border-zinc-700 px-5 py-4">
          <h2 className="text-base font-semibold text-zinc-100">
            {meta ? "Editar meta" : "Nova meta"}
          </h2>
          <button
            onClick={onFechar}
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
              placeholder="Ex: Seguidores no Instagram"
              className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-400">
                Valor atual
              </label>
              <input
                type="number"
                value={valores.valor_atual}
                onChange={(e) => campo("valor_atual", Number(e.target.value))}
                className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-400">
                Valor da meta
              </label>
              <input
                type="number"
                value={valores.valor_meta}
                onChange={(e) => campo("valor_meta", Number(e.target.value))}
                className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-400">
                Unidade
              </label>
              <input
                value={valores.unidade ?? ""}
                onChange={(e) => campo("unidade", e.target.value)}
                placeholder="Ex: seguidores, posts, leads"
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

          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-400">
              Categoria
            </label>
            <input
              value={valores.categoria ?? ""}
              onChange={(e) => campo("categoria", e.target.value)}
              placeholder="Para agrupar metas relacionadas"
              className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100"
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 border-t border-zinc-700 px-5 py-4">
          {meta ? (
            <button
              onClick={() => onExcluir(meta.id)}
              className="rounded-md px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-500/10"
            >
              Excluir
            </button>
          ) : (
            <span />
          )}
          <div className="flex gap-2">
            <button
              onClick={onFechar}
              className="rounded-md px-3 py-2 text-sm font-medium text-zinc-400 hover:bg-zinc-900"
            >
              Cancelar
            </button>
            <button
              onClick={salvar}
              disabled={salvando || !valores.titulo.trim() || valores.valor_meta <= 0}
              className="rounded-md bg-oliva px-4 py-2 text-sm font-medium text-white hover:bg-oliva-forte disabled:opacity-50"
            >
              {salvando ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
