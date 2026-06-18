"use client";

import { Etiqueta, Post, StatusPost } from "@/lib/types";
import { CORES_STATUS, LABEL_CANAL, LABEL_STATUS, LABEL_TIPO } from "@/lib/postStyles";
import { corTextoContraste } from "@/lib/etiquetaCores";

function IconeLapis() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
      <path
        d="M13.5 3.5l3 3L6 17l-4 1 1-4L13.5 3.5z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconeLixeira() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
      <path
        d="M4 6h12M8 6V4h4v2M6 6l1 11h6l1-11"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const STATUS_OPCOES: StatusPost[] = ["pendente", "em_producao", "agendado", "publicado"];

export default function PostDetailPanel({
  post,
  etiquetas,
  onEditar,
  onExcluir,
  onToggleChecklistItem,
  onChangeResponsavel,
  onChangeStatus,
}: {
  post: Post | null;
  etiquetas: Etiqueta[];
  onEditar: (post: Post) => void;
  onExcluir: (id: string) => void;
  onToggleChecklistItem: (postId: string, indice: number) => void;
  onChangeResponsavel: (postId: string, valor: string) => void;
  onChangeStatus: (postId: string, status: StatusPost) => void;
}) {
  if (!post) {
    return (
      <aside className="flex w-80 shrink-0 flex-col items-center justify-center rounded-xl border border-zinc-700 bg-white/5 p-6 text-center text-sm text-zinc-500">
        Selecione um post no calendário para ver os detalhes.
      </aside>
    );
  }

  const etiquetasDoPost = post.etiqueta_ids
    .map((id) => etiquetas.find((e) => e.id === id))
    .filter((e): e is Etiqueta => !!e);

  const concluido = post.checklist.length > 0 && post.checklist.every((i) => i.feito);

  return (
    <aside className="flex w-80 shrink-0 flex-col gap-4 overflow-y-auto rounded-xl border border-zinc-700 bg-white/5 p-4 text-sm">
      <div className="flex items-center justify-between">
        <span
          className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
            concluido ? "text-green-400" : "text-zinc-400"
          }`}
        >
          {concluido && "✓"} {concluido ? "Post concluído" : "Em andamento"}
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEditar(post)}
            className="rounded p-1.5 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"
            title="Editar post"
          >
            <IconeLapis />
          </button>
          <button
            onClick={() => onExcluir(post.id)}
            className="rounded p-1.5 text-zinc-500 hover:bg-red-500/10 hover:text-red-400"
            title="Excluir post"
          >
            <IconeLixeira />
          </button>
        </div>
      </div>

      <div>
        <h2 className="text-base font-semibold leading-snug text-zinc-100">{post.titulo}</h2>
        <p className="mt-0.5 text-xs text-zinc-500">
          {LABEL_TIPO[post.tipo]} · {LABEL_CANAL[post.canal]}
        </p>
      </div>

      {etiquetasDoPost.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {etiquetasDoPost.map((et) => (
            <span
              key={et.id}
              className="rounded px-2 py-0.5 text-xs font-medium"
              style={{ backgroundColor: et.cor, color: corTextoContraste(et.cor) }}
            >
              {et.nome}
            </span>
          ))}
        </div>
      )}

      <div>
        <label className="mb-1 block text-xs font-medium text-zinc-500">Status</label>
        <select
          value={post.status}
          onChange={(e) => onChangeStatus(post.id, e.target.value as StatusPost)}
          className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100"
          style={{ borderColor: CORES_STATUS[post.status] }}
        >
          {STATUS_OPCOES.map((s) => (
            <option key={s} value={s}>
              {LABEL_STATUS[s]}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-zinc-500">Responsável</label>
        <input
          key={post.id}
          defaultValue={post.responsavel ?? ""}
          onBlur={(e) => onChangeResponsavel(post.id, e.target.value)}
          placeholder="Quem está cuidando deste post?"
          className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium text-zinc-500">
          Checklist de produção
        </label>
        <div className="flex flex-col gap-1.5">
          {post.checklist.map((item, indice) => (
            <label
              key={item.item}
              className="flex items-center gap-2 text-zinc-300"
            >
              <input
                type="checkbox"
                checked={item.feito}
                onChange={() => onToggleChecklistItem(post.id, indice)}
                className="h-4 w-4 rounded border-zinc-600"
              />
              <span className={item.feito ? "text-zinc-500 line-through" : ""}>
                {item.item}
              </span>
            </label>
          ))}
        </div>
      </div>

      {post.categoria && (
        <div>
          <label className="mb-1 block text-xs font-medium text-zinc-500">Categoria</label>
          <p className="text-zinc-300">{post.categoria}</p>
        </div>
      )}

      {post.observacoes && (
        <div>
          <label className="mb-1 block text-xs font-medium text-zinc-500">Observações</label>
          <p className="whitespace-pre-wrap text-zinc-300">{post.observacoes}</p>
        </div>
      )}
    </aside>
  );
}
