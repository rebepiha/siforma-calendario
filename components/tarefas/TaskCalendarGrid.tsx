"use client";

import type { MouseEvent } from "react";
import { addDays, format, isSameDay, startOfWeek } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Tarefa } from "@/lib/types";
import TaskCalendarDayCell from "./TaskCalendarDayCell";
import TaskChip from "./TaskChip";

export default function TaskCalendarGrid({
  semanaAtual,
  tarefas,
  mostrarResponsavel,
  onClickTarefa,
  onNovaTarefa,
  onToggleConcluida,
  onContextMenuTarefa,
}: {
  semanaAtual: Date;
  tarefas: Tarefa[];
  mostrarResponsavel: boolean;
  onClickTarefa: (tarefa: Tarefa) => void;
  onNovaTarefa: (data: string) => void;
  onToggleConcluida: (tarefa: Tarefa) => void;
  onContextMenuTarefa: (e: MouseEvent, tarefa: Tarefa) => void;
}) {
  const inicio = startOfWeek(semanaAtual, { weekStartsOn: 1 });
  const dias = Array.from({ length: 7 }, (_, i) => addDays(inicio, i));
  const hoje = new Date();

  const diasComTarefas = dias.map((dia) => {
    const dataStr = format(dia, "yyyy-MM-dd");
    const tarefasDoDia = tarefas
      .filter((t) => t.prazo === dataStr)
      .sort((a, b) => a.ordem - b.ordem || a.criado_em.localeCompare(b.criado_em));
    return { dia, dataStr, tarefasDoDia };
  });

  return (
    <>
      {/* Telas largas: grade da semana, 7 colunas. */}
      <div className="hidden overflow-x-auto rounded-xl shadow-sm sm:block">
        <div className="grid min-w-[700px] grid-cols-[1.4fr_1.4fr_1.4fr_1.4fr_1.4fr_0.5fr_0.5fr]">
          {diasComTarefas.map(({ dia, dataStr, tarefasDoDia }) => {
            const diaDaSemana = dia.getDay();
            return (
              <TaskCalendarDayCell
                key={dataStr}
                dataStr={dataStr}
                nomeDiaSemana={format(dia, "EEE", { locale: ptBR })}
                numeroDia={dia.getDate()}
                ehHoje={isSameDay(dia, hoje)}
                ehFimDeSemana={diaDaSemana === 0 || diaDaSemana === 6}
                tarefas={tarefasDoDia}
                mostrarResponsavel={mostrarResponsavel}
                onClickTarefa={onClickTarefa}
                onNovaTarefa={onNovaTarefa}
                onToggleConcluida={onToggleConcluida}
                onContextMenuTarefa={onContextMenuTarefa}
              />
            );
          })}
        </div>
      </div>

      {/* Telas estreitas: lista vertical, um dia por vez, cards em largura cheia. */}
      <div className="flex flex-col gap-4 sm:hidden">
        {diasComTarefas.map(({ dia, dataStr, tarefasDoDia }) => (
          <div key={dataStr} className="flex flex-col gap-2">
            <button
              onClick={() => onNovaTarefa(dataStr)}
              className={`flex items-center gap-2 self-start rounded-md px-2 py-1 text-sm font-semibold ${
                isSameDay(dia, hoje) ? "bg-oliva text-white" : "text-zinc-300 hover:bg-zinc-900"
              }`}
            >
              {(() => {
                const texto = format(dia, "EEEE, d 'de' MMMM", { locale: ptBR });
                return texto.charAt(0).toUpperCase() + texto.slice(1);
              })()}
              <span className="text-zinc-500">+</span>
            </button>
            {tarefasDoDia.length === 0 ? (
              <p className="px-2 text-xs text-zinc-600">Nenhuma tarefa.</p>
            ) : (
              <div className="flex flex-col gap-1">
                {tarefasDoDia.map((tarefa) => (
                  <TaskChip
                    key={tarefa.id}
                    tarefa={tarefa}
                    mostrarResponsavel={mostrarResponsavel}
                    onClick={() => onClickTarefa(tarefa)}
                    onToggleConcluida={() => onToggleConcluida(tarefa)}
                    onContextMenu={(e) => onContextMenuTarefa(e, tarefa)}
                    arrastavel={false}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
