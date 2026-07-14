"use client";

import type { MouseEvent } from "react";
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
  onToggleStatus,
  onContextMenuPost,
}: {
  dataStr: string;
  numeroDia: number;
  foraDoMes: boolean;
  ehHoje: boolean;
  posts: Post[];
  etiquetas: Etiqueta[];
  onClickPost: (post: Post) => void;
  onNovoPost: (data: string) => void;
  onToggleStatus: (post: Post) => void;
  onContextMenuPost: (e: MouseEvent, post: Post) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: dataStr });

  return (
    <div
      ref={setNodeRef}
      onClick={() => onNovoPost(dataStr)}
      className={`flex h-[135px] cursor-pointer flex-col gap-1 border border-zinc-700 p-1.5 transition-colors sm:h-[155px] ${
        foraDoMes ? "bg-zinc-900/60" : "bg-zinc-800 hover:bg-zinc-800/70"
      } ${isOver ? "bg-oliva-claro/40 ring-2 ring-oliva" : foraDoMes ? "opacity-60" : ""}`}
      title="Clique para adicionar um post neste dia"
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
      </div>

      <div className="flex flex-1 flex-col gap-0.5 overflow-y-auto">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            etiquetas={etiquetas}
            onClick={() => onClickPost(post)}
            onToggleStatus={() => onToggleStatus(post)}
            onContextMenu={(e) => onContextMenuPost(e, post)}
          />
        ))}
      </div>
    </div>
  );
}
