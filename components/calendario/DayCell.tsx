"use client";

import { useDroppable } from "@dnd-kit/core";
import { Etiqueta, Post } from "@/lib/types";
import PostCard from "./PostCard";

export default function DayCell({
  dataStr,
  numeroDia,
  foraDoMes,
  ehHoje,
  posts,
  etiquetas,
  onClickPost,
  onNovoPost,
}: {
  dataStr: string;
  numeroDia: number;
  foraDoMes: boolean;
  ehHoje: boolean;
  posts: Post[];
  etiquetas: Etiqueta[];
  onClickPost: (post: Post) => void;
  onNovoPost: (data: string) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: dataStr });

  return (
    <div
      ref={setNodeRef}
      className={`group flex h-[130px] flex-col gap-1 border border-zinc-700 p-1.5 sm:h-[150px] ${
        foraDoMes ? "bg-zinc-900/60" : "bg-zinc-800"
      } ${isOver ? "bg-oliva-claro/40 ring-2 ring-oliva" : foraDoMes ? "opacity-60" : ""}`}
    >
      <div className="flex items-center justify-between">
        <span
          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs ${
            ehHoje
              ? "bg-oliva font-semibold text-white"
              : foraDoMes
                ? "text-zinc-600"
                : "text-zinc-300"
          }`}
        >
          {numeroDia}
        </span>
        <button
          onClick={() => onNovoPost(dataStr)}
          className="invisible rounded px-1 text-xs font-medium text-zinc-600 hover:bg-zinc-900 hover:text-zinc-300 group-hover:visible"
          title="Novo post"
        >
          + Novo post
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-1 overflow-y-auto">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            etiquetas={etiquetas}
            onClick={() => onClickPost(post)}
          />
        ))}
      </div>
    </div>
  );
}
