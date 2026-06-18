"use client";

import { addDays, format, isSameDay, startOfWeek } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Etiqueta, Post, StatusPost } from "@/lib/types";
import DayCell from "./DayCell";

export default function PostWeekGrid({
  semanaAtual,
  posts,
  etiquetas,
  onClickPost,
  onNovoPost,
  onChangeStatus,
}: {
  semanaAtual: Date;
  posts: Post[];
  etiquetas: Etiqueta[];
  onClickPost: (post: Post) => void;
  onNovoPost: (data: string) => void;
  onChangeStatus: (id: string, status: StatusPost) => void;
}) {
  const inicio = startOfWeek(semanaAtual, { weekStartsOn: 1 });
  const dias = Array.from({ length: 7 }, (_, i) => addDays(inicio, i));
  const hoje = new Date();

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-700 bg-zinc-800 shadow-sm">
      <div className="grid grid-cols-7 border-b border-zinc-700 bg-zinc-900 text-center text-xs font-semibold text-zinc-500">
        {dias.map((dia) => (
          <div key={dia.toISOString()} className="py-2 capitalize">
            {format(dia, "EEE d", { locale: ptBR })}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {dias.map((dia) => {
          const dataStr = format(dia, "yyyy-MM-dd");
          const postsDoDia = posts.filter((p) => p.data === dataStr);
          return (
            <DayCell
              key={dataStr}
              dataStr={dataStr}
              numeroDia={dia.getDate()}
              ehHoje={isSameDay(dia, hoje)}
              posts={postsDoDia}
              etiquetas={etiquetas}
              onClickPost={onClickPost}
              onNovoPost={onNovoPost}
              onChangeStatus={onChangeStatus}
            />
          );
        })}
      </div>
    </div>
  );
}
