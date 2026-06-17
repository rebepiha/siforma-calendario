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
import { Post } from "@/lib/types";
import DayCell from "./DayCell";

const DIAS_SEMANA = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

export default function CalendarGrid({
  mesAtual,
  posts,
  onClickPost,
  onNovoPost,
}: {
  mesAtual: Date;
  posts: Post[];
  onClickPost: (post: Post) => void;
  onNovoPost: (data: string) => void;
}) {
  const inicio = startOfWeek(startOfMonth(mesAtual), { weekStartsOn: 1 });
  const fim = endOfWeek(endOfMonth(mesAtual), { weekStartsOn: 1 });

  const dias: Date[] = [];
  for (let dia = inicio; dia <= fim; dia = addDays(dia, 1)) {
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
          const dataStr = format(dia, "yyyy-MM-dd");
          const postsDoDia = posts.filter((p) => p.data === dataStr);
          return (
            <DayCell
              key={dataStr}
              dataStr={dataStr}
              numeroDia={dia.getDate()}
              noMesAtual={isSameMonth(dia, mesAtual)}
              ehHoje={isSameDay(dia, hoje)}
              posts={postsDoDia}
              onClickPost={onClickPost}
              onNovoPost={onNovoPost}
            />
          );
        })}
      </div>
    </div>
  );
}
