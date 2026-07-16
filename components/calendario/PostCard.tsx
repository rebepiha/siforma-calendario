"use client";

import type { MouseEvent } from "react";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Etiqueta, Post } from "@/lib/types";
import { LABEL_CANAL } from "@/lib/postStyles";

function IconeCheck() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      className="h-3 w-3 shrink-0 text-green-500"
      aria-label="Publicado"
    >
      <circle cx="10" cy="10" r="9" fill="currentColor" fillOpacity="0.15" />
      <path
        d="M6.5 10.2l2.2 2.2 4.8-4.8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function PostCard({
  post,
  etiquetas,
  onClick,
  onToggleStatus,
  onContextMenu,
  arrastavel = true,
}: {
  post: Post;
  etiquetas: Etiqueta[];
  onClick: () => void;
  onToggleStatus: () => void;
  onContextMenu: (e: MouseEvent) => void;
  arrastavel?: boolean;
}) {
  const publicado = post.status === "publicado";
  const etiquetasDoPost = post.etiqueta_ids
    .map((id) => etiquetas.find((e) => e.id === id))
    .filter((e): e is Etiqueta => !!e);
  const etiquetaFormato = etiquetasDoPost.find(
    (e) => e.nome === "Stories" || e.nome === "Feed"
  );
  const tituloJaTemFormato = /^(stories|feed)\b/i.test(post.titulo);
  const prefixoFormato =
    etiquetaFormato && !tituloJaTemFormato
      ? etiquetaFormato.nome === "Stories"
        ? "Stories- "
        : "Feed: "
      : "";
  // Card pode estar montado duas vezes ao mesmo tempo (grade desktop + lista mobile,
  // ver CalendarGrid.tsx) — usar o mesmo id do post nas duas instâncias faria a
  // segunda sobrescrever a referência de nó da primeira no registro do dnd-kit,
  // quebrando a medição de retângulo do card visível. A instância não arrastável
  // usa um id próprio pra não colidir.
  const idDnd = arrastavel ? post.id : `${post.id}__estatico`;
  const { attributes, listeners, setNodeRef: setDragRef, transform, isDragging } =
    useDraggable({ id: idDnd, disabled: !arrastavel });
  const { setNodeRef: setDropRef, isOver } = useDroppable({ id: idDnd, disabled: !arrastavel });
  const setRefs = (node: HTMLElement | null) => {
    setDragRef(node);
    setDropRef(node);
  };

  const style = transform
    ? { transform: CSS.Translate.toString(transform), zIndex: 50 }
    : undefined;

  return (
    <div
      ref={setRefs}
      style={style}
      {...listeners}
      {...attributes}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onContextMenu(e);
      }}
      className={`relative cursor-pointer rounded-lg border border-white/10 bg-white/10 px-1.5 py-1 text-left shadow-sm backdrop-blur-sm transition hover:-translate-y-0.5 hover:bg-white/15 hover:shadow-md ${
        publicado ? "opacity-60" : ""
      } ${isDragging ? "opacity-50" : ""} ${isOver ? "ring-2 ring-oliva" : ""}`}
    >
      {post.novo_produto && (
        <span className="absolute -top-1.5 -right-1.5 rounded-full border border-zinc-600 bg-zinc-900 px-1 py-0.5 text-[8px] font-medium text-zinc-400">
          NOVO
        </span>
      )}

      <div className="mb-0.5 flex flex-wrap items-center gap-1">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleStatus();
          }}
          className="-m-1 shrink-0 rounded-full p-1"
          aria-label={publicado ? "Marcar como não publicado" : "Marcar como publicado"}
        >
          {publicado ? (
            <IconeCheck />
          ) : (
            <span className="block h-2.5 w-2.5 rounded-full border-2 border-zinc-500" />
          )}
        </button>
        {post.canal === "linkedin" && (
          <span title="LinkedIn" className="h-1 w-5 rounded-full bg-blue-500" />
        )}
        {post.canal === "youtube" && (
          <span title="YouTube" className="h-1 w-5 rounded-full bg-red-500" />
        )}
        {post.canal === "email" && (
          <span title="Email" className="h-1 w-5 rounded-full bg-purple-300" />
        )}
        {etiquetasDoPost.map((et) => (
          <span
            key={et.id}
            title={et.nome}
            className="h-1 w-5 rounded-full"
            style={{ backgroundColor: et.cor }}
          />
        ))}
        <span className="text-[10px] font-medium text-zinc-400">
          {LABEL_CANAL[post.canal]}
        </span>
      </div>

      <p className="text-xs font-semibold leading-snug text-zinc-100">
        {prefixoFormato}
        {post.titulo}
      </p>

      {post.categoria && (
        <p className="truncate text-[10px] text-zinc-500">{post.categoria}</p>
      )}

      {post.video_pronto && (
        <span className="mt-0.5 inline-block rounded bg-badge-video px-1 py-0.5 text-[9px] font-semibold text-white">
          ✓ vídeo já feito
        </span>
      )}
    </div>
  );
}
