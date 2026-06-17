"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { format, isBefore, parseISO, startOfToday } from "date-fns";
import { Tarefa } from "@/lib/types";
import { corAvatar, inicialAvatar } from "@/lib/avatar";

const COR_PRIORIDADE: Record<Tarefa["prioridade"], string> = {
  baixa: "bg-green-500",
  media: "bg-amber-500",
  alta: "bg-red-500",
};

export default function TaskCard({
  tarefa,
  onClick,
}: {
  tarefa: Tarefa;
  onClick: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: tarefa.id });

  const style = transform
    ? { transform: CSS.Translate.toString(transform), zIndex: 50 }
    : undefined;

  const atrasada =
    !!tarefa.prazo &&
    tarefa.coluna !== "concluido" &&
    isBefore(parseISO(tarefa.prazo), startOfToday());

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={onClick}
      className={`cursor-pointer rounded-lg border border-zinc-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <div className="mb-2 flex items-center justify-between">
        <span className={`h-2 w-2 rounded-full ${COR_PRIORIDADE[tarefa.prioridade]}`} />
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

      <p className="text-sm font-medium leading-snug text-zinc-900">
        {tarefa.titulo}
      </p>

      {tarefa.prazo && (
        <p
          className={`mt-2 text-xs font-medium ${
            atrasada ? "text-red-600" : "text-zinc-400"
          }`}
        >
          {atrasada ? "Atrasada · " : "Prazo: "}
          {format(parseISO(tarefa.prazo), "dd/MM/yyyy")}
        </p>
      )}
    </div>
  );
}
