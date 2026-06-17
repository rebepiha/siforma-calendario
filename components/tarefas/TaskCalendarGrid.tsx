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
import { Tarefa } from "@/lib/types";
import TaskCalendarDayCell from "./TaskCalendarDayCell";

const DIAS_SEMANA = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

export default function TaskCalendarGrid({
  mesAtual,
  tarefas,
  onClickTarefa,
  onNovaTarefa,
}: {
  mesAtual: Date;
  tarefas: Tarefa[];
  onClickTarefa: (tarefa: Tarefa) => void;
  onNovaTarefa: (data: string) => void;
}) {
  const inicio = startOfWeek(startOfMonth(mesAtual), { weekStartsOn: 1 });
  const fim = endOfWeek(endOfMonth(mesAtual), { weekStartsOn: 1 });

  const dias: Date[] = [];
  for (let dia = inicio; dia <= fim; dia = addDays(dia, 1)) {
    dias.push(dia);
  }

  const hoje = new Date();

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
      <div className="grid grid-cols-7 border-b border-zinc-200 bg-zinc-50 text-center text-xs font-semibold text-zinc-500">
        {DIAS_SEMANA.map((dia) => (
          <div key={dia} className="py-2">
            {dia}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {dias.map((dia) => {
          const dataStr = format(dia, "yyyy-MM-dd");
          const tarefasDoDia = tarefas.filter((t) => t.prazo === dataStr);
          return (
            <TaskCalendarDayCell
              key={dataStr}
              dataStr={dataStr}
              numeroDia={dia.getDate()}
              noMesAtual={isSameMonth(dia, mesAtual)}
              ehHoje={isSameDay(dia, hoje)}
              tarefas={tarefasDoDia}
              onClickTarefa={onClickTarefa}
              onNovaTarefa={onNovaTarefa}
            />
          );
        })}
      </div>
    </div>
  );
}
