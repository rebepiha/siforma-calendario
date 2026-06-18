"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
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
      className="h-4 w-4 shrink-0 text-green-500"
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
  onToggleConcluida,
}: {
  tarefa: Tarefa;
  mostrarResponsavel: boolean;
  onClick: () => void;
  onToggleConcluida: () => void;
}) {
  const concluida = tarefa.coluna === "concluido";
  const atrasada =
    !!tarefa.prazo && !concluida && isBefore(parseISO(tarefa.prazo), startOfToday());

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: tarefa.id,
  });
  const style = transform
    ? { transform: CSS.Translate.toString(transform), zIndex: 50 }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={onClick}
      className={`flex w-full cursor-pointer flex-col gap-1 rounded-md border bg-zinc-800 px-2.5 py-1.5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
        atrasada ? "border-red-500/40" : "border-zinc-700"
      } ${concluida ? "opacity-60" : ""} ${isDragging ? "opacity-50" : ""}`}
    >
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleConcluida();
          }}
          className="-m-1 shrink-0 rounded-full p-1"
          aria-label={concluida ? "Marcar como não concluída" : "Marcar como concluída"}
        >
          {concluida ? (
            <IconeCheck />
          ) : (
            <span className={`block h-2 w-2 rounded-full ${COR_PRIORIDADE[tarefa.prioridade]}`} />
          )}
        </button>
        <p
          className={`truncate text-sm font-medium text-zinc-200 ${
            concluida ? "line-through" : ""
          }`}
        >
          {tarefa.titulo}
        </p>
      </div>
      {mostrarResponsavel && tarefa.responsavel && (
        <span className="flex items-center gap-1.5 text-[11px] text-zinc-500">
          <span
            className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-semibold text-white"
            style={{ backgroundColor: corAvatar(tarefa.responsavel) }}
          >
            {inicialAvatar(tarefa.responsavel)}
          </span>
          <span className="truncate">{tarefa.responsavel}</span>
        </span>
      )}
    </div>
  );
}
