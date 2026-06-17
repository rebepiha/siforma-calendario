"use client";

import { isBefore, parseISO, startOfToday } from "date-fns";
import { Tarefa } from "@/lib/types";
import { corAvatar, inicialAvatar } from "@/lib/avatar";

const COR_PRIORIDADE: Record<Tarefa["prioridade"], string> = {
  baixa: "bg-green-500",
  media: "bg-amber-500",
  alta: "bg-red-500",
};

export default function TaskChip({
  tarefa,
  onClick,
}: {
  tarefa: Tarefa;
  onClick: () => void;
}) {
  const atrasada =
    !!tarefa.prazo &&
    tarefa.coluna !== "concluido" &&
    isBefore(parseISO(tarefa.prazo), startOfToday());

  return (
    <button
      onClick={onClick}
      className={`flex w-full flex-col gap-0.5 rounded-md border bg-white px-2 py-1 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
        atrasada ? "border-red-300" : "border-zinc-200"
      } ${tarefa.coluna === "concluido" ? "opacity-60" : ""}`}
    >
      <div className="flex items-center gap-1.5">
        <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${COR_PRIORIDADE[tarefa.prioridade]}`} />
        <p
          className={`truncate text-xs font-medium text-zinc-800 ${
            tarefa.coluna === "concluido" ? "line-through" : ""
          }`}
        >
          {tarefa.titulo}
        </p>
      </div>
      {tarefa.responsavel && (
        <span className="flex items-center gap-1 text-[10px] text-zinc-500">
          <span
            className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full text-[8px] font-semibold text-white"
            style={{ backgroundColor: corAvatar(tarefa.responsavel) }}
          >
            {inicialAvatar(tarefa.responsavel)}
          </span>
          <span className="truncate">{tarefa.responsavel}</span>
        </span>
      )}
    </button>
  );
}
