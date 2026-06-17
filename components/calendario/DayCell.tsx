"use client";

import { useDroppable } from "@dnd-kit/core";
import { Post } from "@/lib/types";
import PostCard from "./PostCard";

export default function DayCell({
  dataStr,
  numeroDia,
  noMesAtual,
  ehHoje,
  posts,
  onClickPost,
  onNovoPost,
}: {
  dataStr: string;
  numeroDia: number;
  noMesAtual: boolean;
  ehHoje: boolean;
  posts: Post[];
  onClickPost: (post: Post) => void;
  onNovoPost: (data: string) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: dataStr });

  return (
    <div
      ref={setNodeRef}
      className={`group flex min-h-[110px] flex-col gap-1 border border-zinc-700 p-1.5 sm:min-h-[130px] ${
        noMesAtual ? "bg-zinc-800" : "bg-zinc-900"
      } ${isOver ? "bg-oliva-claro/40 ring-2 ring-oliva" : ""}`}
    >
      <div className="flex items-center justify-between">
        <span
          className={`flex h-5 w-5 items-center justify-center rounded-full text-xs ${
            ehHoje
              ? "bg-oliva font-semibold text-white"
              : noMesAtual
                ? "text-zinc-300"
                : "text-zinc-600"
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

      <div className="flex flex-1 flex-col gap-1">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} onClick={() => onClickPost(post)} />
        ))}
      </div>
    </div>
  );
}
