"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Etiqueta, Post } from "@/lib/types";
import { CORES_CANAL, LABEL_CANAL } from "@/lib/postStyles";

function IconeCheck() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      className="h-3.5 w-3.5 shrink-0 text-green-500"
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
}: {
  post: Post;
  etiquetas: Etiqueta[];
  onClick: () => void;
  onToggleStatus: () => void;
}) {
  const publicado = post.status === "publicado";
  const corCanal = CORES_CANAL[post.canal];
  const etiquetasDoPost = post.etiqueta_ids
    .map((id) => etiquetas.find((e) => e.id === id))
    .filter((e): e is Etiqueta => !!e);
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: post.id });

  const style = transform
    ? { transform: CSS.Translate.toString(transform), zIndex: 50 }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={onClick}
      className={`relative cursor-pointer rounded-lg border border-white/10 bg-white/10 px-2 py-1.5 text-left shadow-sm backdrop-blur-sm transition hover:-translate-y-0.5 hover:bg-white/15 hover:shadow-md ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      {post.novo_produto && (
        <span className="absolute -top-2 -right-2 rounded-full bg-badge-novo px-1.5 py-0.5 text-[10px] font-bold text-white shadow">
          NOVO
        </span>
      )}

      {etiquetasDoPost.length > 0 && (
        <div className="mb-1.5 flex flex-wrap gap-1">
          {etiquetasDoPost.map((et) => (
            <span
              key={et.id}
              title={et.nome}
              className="h-1.5 w-6 rounded-full"
              style={{ backgroundColor: et.cor }}
            />
          ))}
        </div>
      )}

      <div className="flex items-center gap-1.5">
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
            <span className="block h-3 w-3 rounded-full border-2 border-zinc-500" />
          )}
        </button>
        <span className={`text-[11px] font-medium ${corCanal.text}`}>
          {LABEL_CANAL[post.canal]}
        </span>
      </div>

      <p className="text-sm font-semibold leading-snug text-zinc-100">{post.titulo}</p>

      {post.categoria && (
        <p className="truncate text-[11px] text-zinc-500">{post.categoria}</p>
      )}

      {post.video_pronto && (
        <span className="mt-1 inline-block rounded bg-badge-video px-1.5 py-0.5 text-[10px] font-semibold text-white">
          ✓ vídeo já feito
        </span>
      )}
    </div>
  );
}
