"use client";

import { Tarefa } from "@/lib/types";
import TaskChip from "./TaskChip";

export default function TaskCalendarDayCell({
  dataStr,
  nomeDiaSemana,
  numeroDia,
  ehHoje,
  ehFimDeSemana,
  tarefas,
  mostrarResponsavel,
  onClickTarefa,
  onNovaTarefa,
}: {
  dataStr: string;
  nomeDiaSemana: string;
  numeroDia: number;
  ehHoje: boolean;
  ehFimDeSemana: boolean;
  tarefas: Tarefa[];
  mostrarResponsavel: boolean;
  onClickTarefa: (tarefa: Tarefa) => void;
  onNovaTarefa: (data: string) => void;
}) {
  return (
    <div
      className={`group flex min-h-[480px] flex-col gap-1.5 border-x border-b p-2 ${
        ehHoje ? "border-t-2 border-t-oliva" : "border-t border-t-zinc-700"
      } border-x-zinc-700 border-b-zinc-700 ${
        ehFimDeSemana ? "bg-zinc-900/60" : "bg-zinc-800"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span
            className={`text-xs font-semibold uppercase ${
              ehHoje ? "text-oliva" : "text-zinc-600"
            }`}
          >
            {nomeDiaSemana}
          </span>
          <span
            className={`flex h-5 w-5 items-center justify-center rounded-full text-xs ${
              ehHoje ? "bg-oliva font-semibold text-white" : "text-zinc-300"
            }`}
          >
            {numeroDia}
          </span>
        </div>
        <button
          onClick={() => onNovaTarefa(dataStr)}
          className="invisible rounded px-1 text-xs font-medium text-zinc-600 hover:bg-zinc-900 hover:text-zinc-300 group-hover:visible"
          title="Nova tarefa"
        >
          + Nova
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-1.5">
        {tarefas.map((tarefa) => (
          <TaskChip
            key={tarefa.id}
            tarefa={tarefa}
            mostrarResponsavel={mostrarResponsavel}
            onClick={() => onClickTarefa(tarefa)}
          />
        ))}
      </div>
    </div>
  );
}
