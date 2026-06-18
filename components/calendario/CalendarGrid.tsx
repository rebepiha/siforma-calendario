"use client";

import {
  addDays,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { Etiqueta, Post, StatusPost } from "@/lib/types";
import DayCell from "./DayCell";

const DIAS_SEMANA = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

export default function CalendarGrid({
  mesAtual,
  posts,
  etiquetas,
  onClickPost,
  onNovoPost,
  onChangeStatus,
}: {
  mesAtual: Date;
  posts: Post[];
  etiquetas: Etiqueta[];
  onClickPost: (post: Post) => void;
  onNovoPost: (data: string) => void;
  onChangeStatus: (id: string, status: StatusPost) => void;
}) {
  const inicioGrade = startOfWeek(startOfMonth(mesAtual), { weekStartsOn: 1 });
  const fimGrade = endOfWeek(endOfMonth(mesAtual), { weekStartsOn: 1 });

  const dias: Date[] = [];
  for (let dia = inicioGrade; dia <= fimGrade; dia = addDays(dia, 1)) {
    dias.push(dia);
  }

  const hoje = new Date();

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-700 bg-zinc-800 shadow-sm">
      <div className="grid grid-cols-7 border-b border-zinc-700 bg-zinc-900 text-center text-xs font-semibold text-zinc-500">
        {DIAS_SEMANA.map((dia) => (
          <div key={dia} className="py-2">
            {dia}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {dias.map((dia) => {
          if (!isSameMonth(dia, mesAtual)) {
            return (
              <div
                key={format(dia, "yyyy-MM-dd")}
                className="min-h-[110px] border border-zinc-700 bg-zinc-900/40 sm:min-h-[130px]"
              />
            );
          }
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
