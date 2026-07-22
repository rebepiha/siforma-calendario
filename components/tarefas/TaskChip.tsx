"use client";

import type { MouseEvent } from "react";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { isBefore, parseISO, startOfToday } from "date-fns";
import { Tarefa } from "@/lib/types";
import { corAvatar, inicialAvatar } from "@/lib/avatar";

function IconeCheck() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      className="h-3 w-3 shrink-0 text-green-500"
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
  onContextMenu,
  arrastavel = true,
}: {
  tarefa: Tarefa;
  mostrarResponsavel: boolean;
  onClick: () => void;
  onToggleConcluida: () => void;
  onContextMenu: (e: MouseEvent) => void;
  arrastavel?: boolean;
}) {
  const concluida = tarefa.coluna === "concluido";
  const atrasada =
    !!tarefa.prazo && !concluida && isBefore(parseISO(tarefa.prazo), startOfToday());

  // Card pode estar montado duas vezes ao mesmo tempo (grade desktop + lista mobile,
  // ver TaskCalendarGrid.tsx) — usar o mesmo id da tarefa nas duas instâncias faria a
  // segunda sobrescrever a referência de nó da primeira no registro do dnd-kit,
  // quebrando a medição de retângulo do card visível. A instância não arrastável usa
  // um id próprio pra não colidir.
  const idDnd = arrastavel ? tarefa.id : `${tarefa.id}__estatico`;
  const { attributes, listeners, setNodeRef: setDragRef, transform, isDragging } = useDraggable({
    id: idDnd,
    disabled: !arrastavel,
  });
  const { setNodeRef: setDropRef, isOver } = useDroppable({ id: idDnd, disabled: !arrastavel });
  const setRefs = (node: HTMLElement | null) => {
    setDragRef(node);
    setDropRef(node);
  };
  const style = transform
    ? { transform: CSS.Translate.toString(transform), zIndex: 50 }
    : undefined;

  return (
    <div
      ref={setRefs}
      style={style}
      {...listeners}
      {...attributes}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onContextMenu(e);
      }}
      className={`flex w-full cursor-pointer flex-col gap-0.5 rounded-md border bg-zinc-800 px-1.5 py-[3px] text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
        atrasada ? "border-red-500/40" : "border-zinc-700"
      } ${concluida ? "opacity-60" : ""} ${isDragging ? "opacity-50" : ""} ${
        isOver ? "ring-2 ring-oliva" : ""
      }`}
    >
      <div className="flex items-start gap-1">
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
            <span className="block h-2.5 w-2.5 rounded-full border-2 border-zinc-500 bg-zinc-800 hover:bg-zinc-700" />
          )}
        </button>
        <p
          className={`line-clamp-2 min-h-[1.75rem] text-xs font-semibold leading-[14px] text-zinc-100 ${
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
    </div>
  );
}
