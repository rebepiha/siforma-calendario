"use client";

import { useDroppable } from "@dnd-kit/core";
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
  onToggleConcluida,
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
  onToggleConcluida: (tarefa: Tarefa) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: dataStr });

  return (
    <div
      ref={setNodeRef}
      onClick={() => onNovaTarefa(dataStr)}
      className={`flex min-h-[480px] cursor-pointer flex-col gap-1.5 border-x border-b p-2 transition-colors ${
        ehHoje ? "border-t-2 border-t-oliva" : "border-t border-t-zinc-700"
      } border-x-zinc-700 border-b-zinc-700 ${
        isOver
          ? "bg-oliva-claro/10 ring-2 ring-oliva"
          : ehFimDeSemana
            ? "bg-zinc-900/60"
            : "bg-zinc-800 hover:bg-zinc-800/70"
      }`}
      title="Clique para adicionar uma tarefa neste dia"
    >
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

      <div className="flex flex-1 flex-col gap-1.5">
        {tarefas.map((tarefa) => (
          <TaskChip
            key={tarefa.id}
            tarefa={tarefa}
            mostrarResponsavel={mostrarResponsavel}
            onClick={() => onClickTarefa(tarefa)}
            onToggleConcluida={() => onToggleConcluida(tarefa)}
          />
        ))}
      </div>
    </div>
  );
}
