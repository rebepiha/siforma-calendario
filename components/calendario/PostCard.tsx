"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Etiqueta, Post } from "@/lib/types";
import { CORES_CANAL, LABEL_CANAL } from "@/lib/postStyles";

export default function PostCard({
  post,
  etiquetas,
  onClick,
}: {
  post: Post;
  etiquetas: Etiqueta[];
  onClick: () => void;
}) {
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
      className={`relative cursor-pointer rounded-lg border border-zinc-700 bg-zinc-800 px-2 py-1.5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
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

      <span className={`text-[11px] font-medium ${corCanal.text}`}>
        {LABEL_CANAL[post.canal]}
      </span>

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
