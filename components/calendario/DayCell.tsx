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
  interativo = true,
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
  // No calendário contínuo (vários meses empilhados, ver app/page.tsx), o mesmo
  // dia de padding (início/fim de semana fora do mês) aparece nesta grade E como
  // dia "de verdade" na seção do mês vizinho. Registrar o mesmo id de droppable
  // duas vezes faria a segunda instância sobrescrever a referência de nó da
  // primeira no registro do dnd-kit (mesmo bug de Map-por-id da Sessão 36, mas
  // pro droppable em vez do draggable) — por isso o dia de padding usa um id
  // próprio e fica desativado como alvo de drop.
  interativo?: boolean;
}) {
  const idDrop = interativo ? dataStr : `${dataStr}__pad`;
  const { setNodeRef, isOver } = useDroppable({ id: idDrop, disabled: !interativo });

  return (
    <div
      ref={setNodeRef}
      onClick={() => onNovoPost(dataStr)}
      className={`flex h-[140px] cursor-pointer flex-col gap-1 border border-zinc-700 p-1.5 transition-colors sm:h-[160px] ${
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
            arrastavel={interativo}
          />
        ))}
      </div>
    </div>
  );
}
