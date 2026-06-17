"use client";

import { addDays, format, isSameDay, startOfWeek } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Tarefa } from "@/lib/types";
import TaskCalendarDayCell from "./TaskCalendarDayCell";

export default function TaskCalendarGrid({
  semanaAtual,
  tarefas,
  mostrarResponsavel,
  onClickTarefa,
  onNovaTarefa,
}: {
  semanaAtual: Date;
  tarefas: Tarefa[];
  mostrarResponsavel: boolean;
  onClickTarefa: (tarefa: Tarefa) => void;
  onNovaTarefa: (data: string) => void;
}) {
  const inicio = startOfWeek(semanaAtual, { weekStartsOn: 1 });
  const dias = Array.from({ length: 7 }, (_, i) => addDays(inicio, i));
  const hoje = new Date();

  return (
    <div className="overflow-hidden rounded-xl shadow-sm">
      <div className="grid grid-cols-7">
        {dias.map((dia) => {
          const dataStr = format(dia, "yyyy-MM-dd");
          const tarefasDoDia = tarefas.filter((t) => t.prazo === dataStr);
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
            />
          );
        })}
      </div>
    </div>
  );
}
