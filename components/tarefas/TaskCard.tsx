"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { format, isBefore, parseISO, startOfToday } from "date-fns";
import { Tarefa } from "@/lib/types";
import { corAvatar, inicialAvatar } from "@/lib/avatar";

const COR_PRIORIDADE: Record<Tarefa["prioridade"], string> = {
  baixa: "border-green-500",
  media: "border-amber-500",
  alta: "border-red-500",
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

export default function TaskCard({
  tarefa,
  onClick,
  onToggleConcluida,
}: {
  tarefa: Tarefa;
  onClick: () => void;
  onToggleConcluida: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: tarefa.id });

  const style = transform
    ? { transform: CSS.Translate.toString(transform), zIndex: 50 }
    : undefined;

  const concluida = tarefa.coluna === "concluido";
  const atrasada =
    !!tarefa.prazo && !concluida && isBefore(parseISO(tarefa.prazo), startOfToday());

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={onClick}
      className={`cursor-pointer rounded-lg border border-zinc-700 bg-zinc-800 p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
        concluida ? "opacity-60" : ""
      } ${isDragging ? "opacity-50" : ""}`}
    >
      <div className="mb-2 flex items-center justify-between">
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
            <span
              className={`block h-3 w-3 rounded-full border-2 bg-zinc-800 hover:bg-zinc-700 ${COR_PRIORIDADE[tarefa.prioridade]}`}
            />
          )}
        </button>
        {tarefa.responsavel && (
          <span
            className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold text-white"
            style={{ backgroundColor: corAvatar(tarefa.responsavel) }}
            title={tarefa.responsavel}
          >
            {inicialAvatar(tarefa.responsavel)}
          </span>
        )}
      </div>

      <p className={`text-sm font-medium leading-snug text-zinc-100 ${concluida ? "line-through" : ""}`}>
        {tarefa.titulo}
      </p>

      {tarefa.prazo && (
        <p
          className={`mt-2 text-xs font-medium ${
            atrasada ? "text-red-400" : "text-zinc-600"
          }`}
        >
          {atrasada ? "Atrasada · " : "Prazo: "}
          {format(parseISO(tarefa.prazo), "dd/MM/yyyy")}
        </p>
      )}
    </div>
  );
}
