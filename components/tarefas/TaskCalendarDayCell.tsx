"use client";

import { Tarefa } from "@/lib/types";
import TaskChip from "./TaskChip";

export default function TaskCalendarDayCell({
  dataStr,
  numeroDia,
  noMesAtual,
  ehHoje,
  tarefas,
  onClickTarefa,
  onNovaTarefa,
}: {
  dataStr: string;
  numeroDia: number;
  noMesAtual: boolean;
  ehHoje: boolean;
  tarefas: Tarefa[];
  onClickTarefa: (tarefa: Tarefa) => void;
  onNovaTarefa: (data: string) => void;
}) {
  return (
    <div
      className={`group flex min-h-[110px] flex-col gap-1 border border-zinc-100 p-1.5 sm:min-h-[130px] ${
        noMesAtual ? "bg-white" : "bg-zinc-50"
      }`}
    >
      <div className="flex items-center justify-between">
        <span
          className={`flex h-5 w-5 items-center justify-center rounded-full text-xs ${
            ehHoje
              ? "bg-oliva font-semibold text-white"
              : noMesAtual
                ? "text-zinc-700"
                : "text-zinc-400"
          }`}
        >
          {numeroDia}
        </span>
        <button
          onClick={() => onNovaTarefa(dataStr)}
          className="invisible rounded px-1 text-xs font-medium text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 group-hover:visible"
          title="Nova tarefa"
        >
          + Nova tarefa
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-1">
        {tarefas.map((tarefa) => (
          <TaskChip key={tarefa.id} tarefa={tarefa} onClick={() => onClickTarefa(tarefa)} />
        ))}
      </div>
    </div>
  );
}
