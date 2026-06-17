"use client";

import { useEffect, useState } from "react";
import { Canal, Formato, NovoPost, Post, StatusPost, TipoPost } from "@/lib/types";
import { LABEL_CANAL, LABEL_FORMATO, LABEL_STATUS, LABEL_TIPO } from "@/lib/postStyles";

function valoresIniciais(dataPadrao: string): NovoPost {
  return {
    titulo: "",
    data: dataPadrao,
    canal: "instagram",
    tipo: "produto",
    categoria: "",
    formato: "feed",
    video_pronto: false,
    novo_produto: false,
    status: "pendente",
    copy: "",
    observacoes: "",
  };
}

export default function PostModal({
  post,
  dataPadrao,
  onFechar,
  onSalvar,
  onExcluir,
}: {
  post: Post | null;
  dataPadrao: string;
  onFechar: () => void;
  onSalvar: (id: string | null, valores: NovoPost) => Promise<void>;
  onExcluir: (id: string) => Promise<void>;
}) {
  const [valores, setValores] = useState<NovoPost>(
    post
      ? {
          titulo: post.titulo,
          data: post.data,
          canal: post.canal,
          tipo: post.tipo,
          categoria: post.categoria ?? "",
          formato: post.formato,
          video_pronto: post.video_pronto,
          novo_produto: post.novo_produto,
          status: post.status,
          copy: post.copy ?? "",
          observacoes: post.observacoes ?? "",
        }
      : valoresIniciais(dataPadrao)
  );
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  function campo<K extends keyof NovoPost>(chave: K, valor: NovoPost[K]) {
    setValores((v) => ({ ...v, [chave]: valor }));
  }

  async function salvar() {
    if (!valores.titulo.trim()) return;
    setSalvando(true);
    try {
      await onSalvar(post?.id ?? null, {
        ...valores,
        categoria: valores.categoria?.trim() ? valores.categoria : null,
        copy: valores.copy?.trim() ? valores.copy : null,
        observacoes: valores.observacoes?.trim() ? valores.observacoes : null,
      });
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60">
      <div className="absolute inset-0" onClick={onFechar} />
      <div className="relative flex h-full w-full max-w-md flex-col overflow-y-auto bg-zinc-800 shadow-2xl">
        <div className="flex items-center justify-between border-b border-zinc-700 px-5 py-4">
          <h2 className="text-base font-semibold text-zinc-100">
            {post ? "Editar post" : "Novo post"}
          </h2>
          <button
            onClick={onFechar}
            className="rounded p-1 text-zinc-600 hover:bg-zinc-900 hover:text-zinc-300"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-4 px-5 py-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-400">
              Título
            </label>
            <input
              value={valores.titulo}
              onChange={(e) => campo("titulo", e.target.value)}
              placeholder="Nome do produto ou tema do post"
              className="w-full rounded-md border border-zinc-700 px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-400">
              Data
            </label>
            <input
              type="date"
              value={valores.data}
              onChange={(e) => campo("data", e.target.value)}
              className="w-full rounded-md border border-zinc-700 px-3 py-2 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-400">
                Canal
              </label>
              <select
                value={valores.canal}
                onChange={(e) => campo("canal", e.target.value as Canal)}
                className="w-full rounded-md border border-zinc-700 px-3 py-2 text-sm"
              >
                {(Object.keys(LABEL_CANAL) as Canal[]).map((canal) => (
                  <option key={canal} value={canal}>
                    {LABEL_CANAL[canal]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-400">
                Tipo
              </label>
              <select
                value={valores.tipo}
                onChange={(e) => campo("tipo", e.target.value as TipoPost)}
                className="w-full rounded-md border border-zinc-700 px-3 py-2 text-sm"
              >
                {(Object.keys(LABEL_TIPO) as TipoPost[]).map((tipo) => (
                  <option key={tipo} value={tipo}>
                    {LABEL_TIPO[tipo]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-400">
                Formato
              </label>
              <select
                value={valores.formato}
                onChange={(e) => campo("formato", e.target.value as Formato)}
                className="w-full rounded-md border border-zinc-700 px-3 py-2 text-sm"
              >
                {(Object.keys(LABEL_FORMATO) as Formato[]).map((formato) => (
                  <option key={formato} value={formato}>
                    {LABEL_FORMATO[formato]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-400">
                Status
              </label>
              <select
                value={valores.status}
                onChange={(e) => campo("status", e.target.value as StatusPost)}
                className="w-full rounded-md border border-zinc-700 px-3 py-2 text-sm"
              >
                {(Object.keys(LABEL_STATUS) as StatusPost[]).map((status) => (
                  <option key={status} value={status}>
                    {LABEL_STATUS[status]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-400">
              Categoria
            </label>
            <input
              value={valores.categoria ?? ""}
              onChange={(e) => campo("categoria", e.target.value)}
              placeholder="Ex: Tendências, Marcenarias, Formobile..."
              className="w-full rounded-md border border-zinc-700 px-3 py-2 text-sm"
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-zinc-300">
              <input
                type="checkbox"
                checked={valores.novo_produto}
                onChange={(e) => campo("novo_produto", e.target.checked)}
                className="h-4 w-4 rounded border-zinc-700"
              />
              Produto novo (NOVO)
            </label>
            <label className="flex items-center gap-2 text-sm text-zinc-300">
              <input
                type="checkbox"
                checked={valores.video_pronto}
                onChange={(e) => campo("video_pronto", e.target.checked)}
                className="h-4 w-4 rounded border-zinc-700"
              />
              Vídeo já feito
            </label>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-400">
              Copy / roteiro
            </label>
            <textarea
              value={valores.copy ?? ""}
              onChange={(e) => campo("copy", e.target.value)}
              rows={4}
              className="w-full rounded-md border border-zinc-700 px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-400">
              Observações
            </label>
            <textarea
              value={valores.observacoes ?? ""}
              onChange={(e) => campo("observacoes", e.target.value)}
              rows={3}
              className="w-full rounded-md border border-zinc-700 px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 border-t border-zinc-700 px-5 py-4">
          {post ? (
            <button
              onClick={() => onExcluir(post.id)}
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
              disabled={salvando || !valores.titulo.trim()}
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
