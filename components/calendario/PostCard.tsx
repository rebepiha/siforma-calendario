"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Post } from "@/lib/types";
import { CORES_CANAL, CORES_FORMATO, LABEL_CANAL, LABEL_FORMATO } from "@/lib/postStyles";

function IconeStory() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-3 w-3 shrink-0"
      aria-label="Story"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="3 3"
      />
      <circle cx="12" cy="12" r="3" fill="currentColor" />
    </svg>
  );
}

export default function PostCard({
  post,
  onClick,
}: {
  post: Post;
  onClick: () => void;
}) {
  const corCanal = CORES_CANAL[post.canal];
  const corFormato = CORES_FORMATO[post.formato];
  const ehStory = post.formato === "stories";
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

      <span className={`mb-1.5 block h-1 w-7 rounded-full ${corFormato.barra}`} />

      <div className="flex items-center justify-between gap-1.5 text-[11px] font-medium">
        <span className={corCanal.text}>{LABEL_CANAL[post.canal]}</span>
        <span className={`inline-flex items-center gap-1 text-[10px] font-semibold ${corFormato.texto}`}>
          {ehStory && <IconeStory />}
          {LABEL_FORMATO[post.formato]}
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
