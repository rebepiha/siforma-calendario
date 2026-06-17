"use client";

import { isBefore, parseISO, startOfToday } from "date-fns";
import { Tarefa } from "@/lib/types";
import { corAvatar, inicialAvatar } from "@/lib/avatar";

const COR_PRIORIDADE: Record<Tarefa["prioridade"], string> = {
  baixa: "bg-green-500",
  media: "bg-amber-500",
  alta: "bg-red-500",
};

function IconeCheck() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      className="h-3.5 w-3.5 shrink-0 text-green-500"
      aria-label="Concluída"
    >
      <circle cx="10" cy="10" r="9" fill="currentColor" fillOpacity="0.15" />
      <path
        d="M6.5 10.2l2.2 2.2 4.8-4.8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function TaskChip({
  tarefa,
  mostrarResponsavel,
  onClick,
}: {
  tarefa: Tarefa;
  mostrarResponsavel: boolean;
  onClick: () => void;
}) {
  const concluida = tarefa.coluna === "concluido";
  const atrasada =
    !!tarefa.prazo && !concluida && isBefore(parseISO(tarefa.prazo), startOfToday());

  return (
    <button
      onClick={onClick}
      className={`flex w-full flex-col gap-0.5 rounded-md border bg-zinc-800 px-2 py-1 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
        atrasada ? "border-red-500/40" : "border-zinc-700"
      } ${concluida ? "opacity-60" : ""}`}
    >
      <div className="flex items-center gap-1.5">
        {concluida ? (
          <IconeCheck />
        ) : (
          <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${COR_PRIORIDADE[tarefa.prioridade]}`} />
        )}
        <p
          className={`truncate text-xs font-medium text-zinc-200 ${
            concluida ? "line-through" : ""
          }`}
        >
          {tarefa.titulo}
        </p>
      </div>
      {mostrarResponsavel && tarefa.responsavel && (
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
