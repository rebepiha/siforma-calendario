"use client";

import { useDroppable } from "@dnd-kit/core";
import { ColunaTarefa, Tarefa } from "@/lib/types";
import TaskCard from "./TaskCard";

export default function KanbanColumn({
  coluna,
  titulo,
  tarefas,
  onClickTarefa,
  onNovaTarefa,
}: {
  coluna: ColunaTarefa;
  titulo: string;
  tarefas: Tarefa[];
  onClickTarefa: (tarefa: Tarefa) => void;
  onNovaTarefa: (coluna: ColunaTarefa) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: coluna });

  return (
    <div
      ref={setNodeRef}
      className={`flex w-full min-w-[260px] flex-col gap-3 rounded-xl border border-zinc-700 bg-zinc-900 p-3 sm:w-72 ${
        isOver ? "ring-2 ring-oliva" : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-zinc-300">
          {titulo}{" "}
          <span className="ml-1 text-xs font-normal text-zinc-600">
            {tarefas.length}
          </span>
        </h2>
        <button
          onClick={() => onNovaTarefa(coluna)}
          className="rounded px-1.5 py-0.5 text-xs font-medium text-zinc-600 hover:bg-zinc-700 hover:text-zinc-300"
          title="Nova tarefa"
        >
          + Nova tarefa
        </button>
      </div>

      <div className="flex min-h-[60px] flex-col gap-2">
        {tarefas.map((tarefa) => (
          <TaskCard
            key={tarefa.id}
            tarefa={tarefa}
            onClick={() => onClickTarefa(tarefa)}
          />
        ))}
      </div>
    </div>
  );
}
