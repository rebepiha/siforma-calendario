"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Post } from "@/lib/types";
import { CORES_TIPO, LABEL_CANAL, LABEL_FORMATO } from "@/lib/postStyles";

function IconeStory() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-3.5 w-3.5 shrink-0"
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
  const cores = CORES_TIPO[post.tipo];
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
      className={`relative cursor-pointer rounded-lg border px-2 py-1.5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${cores.bg} ${cores.border} ${cores.text} ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      {post.novo_produto && (
        <span className="absolute -top-2 -right-2 rounded-full bg-badge-novo px-1.5 py-0.5 text-[10px] font-bold text-white shadow">
          NOVO
        </span>
      )}

      <div className="flex items-center gap-1 text-[11px] font-medium opacity-80">
        {post.formato === "stories" && <IconeStory />}
        <span>
          {LABEL_CANAL[post.canal]} · {LABEL_FORMATO[post.formato]}
        </span>
      </div>

      <p className="text-sm font-semibold leading-snug">{post.titulo}</p>

      {post.categoria && (
        <p className="truncate text-[11px] opacity-70">{post.categoria}</p>
      )}

      {post.video_pronto && (
        <span className="mt-1 inline-block rounded bg-badge-video px-1.5 py-0.5 text-[10px] font-semibold text-white">
          ✓ vídeo já feito
        </span>
      )}
    </div>
  );
}
