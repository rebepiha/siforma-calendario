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
import { Etiqueta, Post } from "@/lib/types";
import DayCell from "./DayCell";

const DIAS_SEMANA = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

export default function CalendarGrid({
  mesAtual,
  posts,
  etiquetas,
  onClickPost,
  onNovoPost,
  onToggleStatus,
}: {
  mesAtual: Date;
  posts: Post[];
  etiquetas: Etiqueta[];
  onClickPost: (post: Post) => void;
  onNovoPost: (data: string) => void;
  onToggleStatus: (post: Post) => void;
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
          const dataStr = format(dia, "yyyy-MM-dd");
          const postsDoDia = posts
            .filter((p) => p.data === dataStr)
            .sort((a, b) => a.ordem - b.ordem);
          return (
            <DayCell
              key={dataStr}
              dataStr={dataStr}
              numeroDia={dia.getDate()}
              foraDoMes={!isSameMonth(dia, mesAtual)}
              ehHoje={isSameDay(dia, hoje)}
              posts={postsDoDia}
              etiquetas={etiquetas}
              onClickPost={onClickPost}
              onNovoPost={onNovoPost}
              onToggleStatus={onToggleStatus}
            />
          );
        })}
      </div>
    </div>
  );
}
