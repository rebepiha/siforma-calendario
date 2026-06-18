"use client";

import { useEffect, useMemo, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { addWeeks, endOfWeek, format, startOfWeek, subWeeks } from "date-fns";
import { ptBR } from "date-fns/locale";
import { supabase } from "@/lib/supabase";
import { ColunaTarefa, NovaTarefa, Tarefa } from "@/lib/types";
import TaskCalendarGrid from "@/components/tarefas/TaskCalendarGrid";
import TaskChip from "@/components/tarefas/TaskChip";
import TaskModal from "@/components/tarefas/TaskModal";

export default function PaginaTarefas() {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [tarefaSelecionada, setTarefaSelecionada] = useState<Tarefa | null>(null);
  const [colunaParaNovaTarefa, setColunaParaNovaTarefa] =
    useState<ColunaTarefa>("a_fazer");
  const [prazoParaNovaTarefa, setPrazoParaNovaTarefa] = useState<string | undefined>(
    undefined
  );

  const [semanaAtual, setSemanaAtual] = useState(() => new Date());
  const [filtroResponsavel, setFiltroResponsavel] = useState("Victoria");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } })
  );

  async function carregarTarefas() {
    setCarregando(true);
    const { data, error } = await supabase
      .from("tarefas")
      .select("*")
      .order("criado_em", { ascending: true });
    if (error) {
      setErro(error.message);
    } else {
      setTarefas(data as Tarefa[]);
      setErro(null);
    }
    setCarregando(false);
  }

  useEffect(() => {
    carregarTarefas();
  }, []);

  const responsaveisConhecidos = useMemo(() => {
    const conjunto = new Set<string>(["Victoria"]);
    tarefas.forEach((t) => {
      if (t.responsavel) conjunto.add(t.responsavel);
    });
    return Array.from(conjunto).sort((a, b) => a.localeCompare(b));
  }, [tarefas]);

  const tarefasDoResponsavel = useMemo(() => {
    if (filtroResponsavel === "todos") return tarefas;
    return tarefas.filter((t) => t.responsavel === filtroResponsavel);
  }, [tarefas, filtroResponsavel]);

  const tarefasComPrazo = useMemo(
    () => tarefasDoResponsavel.filter((t) => !!t.prazo),
    [tarefasDoResponsavel]
  );
  const tarefasSemPrazo = useMemo(
    () => tarefasDoResponsavel.filter((t) => !t.prazo),
    [tarefasDoResponsavel]
  );

  function abrirNovaTarefaNoDia(data: string) {
    setTarefaSelecionada(null);
    setColunaParaNovaTarefa("a_fazer");
    setPrazoParaNovaTarefa(data);
    setModalAberto(true);
  }

  function abrirEdicaoTarefa(tarefa: Tarefa) {
    setTarefaSelecionada(tarefa);
    setModalAberto(true);
  }

  async function salvarTarefa(id: string | null, valores: NovaTarefa) {
    if (id) {
      const { data, error } = await supabase
        .from("tarefas")
        .update(valores)
        .eq("id", id)
        .select()
        .single();
      if (!error && data) {
        setTarefas((atual) => atual.map((t) => (t.id === id ? (data as Tarefa) : t)));
      }
    } else {
      const { data, error } = await supabase
        .from("tarefas")
        .insert(valores)
        .select()
        .single();
      if (!error && data) {
        setTarefas((atual) => [...atual, data as Tarefa]);
      }
    }
    setModalAberto(false);
  }

  async function excluirTarefa(id: string) {
    const { error } = await supabase.from("tarefas").delete().eq("id", id);
    if (!error) {
      setTarefas((atual) => atual.filter((t) => t.id !== id));
    }
    setModalAberto(false);
  }

  async function moverTarefa(tarefaId: string, novaColuna: ColunaTarefa) {
    setTarefas((atual) =>
      atual.map((t) => (t.id === tarefaId ? { ...t, coluna: novaColuna } : t))
    );
    const { error } = await supabase
      .from("tarefas")
      .update({ coluna: novaColuna })
      .eq("id", tarefaId);
    if (error) {
      carregarTarefas();
    }
  }

  function alternarConcluida(tarefa: Tarefa) {
    moverTarefa(tarefa.id, tarefa.coluna === "concluido" ? "a_fazer" : "concluido");
  }

  async function moverPrazoTarefa(tarefaId: string, novoPrazo: string | null) {
    setTarefas((atual) =>
      atual.map((t) => (t.id === tarefaId ? { ...t, prazo: novoPrazo } : t))
    );
    const { error } = await supabase
      .from("tarefas")
      .update({ prazo: novoPrazo })
      .eq("id", tarefaId);
    if (error) {
      carregarTarefas();
    }
  }

  const inicioSemana = startOfWeek(semanaAtual, { weekStartsOn: 1 });
  const fimSemana = endOfWeek(semanaAtual, { weekStartsOn: 1 });
  const rotuloSemana = `${format(inicioSemana, "d MMM", { locale: ptBR })} – ${format(
    fimSemana,
    "d MMM yyyy",
    { locale: ptBR }
  )}`;

  const { setNodeRef: setSemPrazoRef, isOver: semPrazoIsOver } = useDroppable({
    id: "sem-prazo",
  });

  function aoFinalizarArrasteCalendario(evento: DragEndEvent) {
    const { active, over } = evento;
    if (!over) return;
    const tarefaId = String(active.id);
    const novoPrazo = String(over.id) === "sem-prazo" ? null : String(over.id);
    const tarefa = tarefas.find((t) => t.id === tarefaId);
    if (tarefa && tarefa.prazo !== novoPrazo) {
      moverPrazoTarefa(tarefaId, novoPrazo);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-lg font-semibold text-zinc-100">Tarefas de Marketing</h1>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSemanaAtual((s) => subWeeks(s, 1))}
              className="rounded-md border border-zinc-700 px-2.5 py-1.5 text-sm text-zinc-400 hover:bg-zinc-900"
              aria-label="Semana anterior"
            >
              ←
            </button>
            <span className="min-w-[170px] text-center text-sm font-semibold text-zinc-100">
              {rotuloSemana}
            </span>
            <button
              onClick={() => setSemanaAtual((s) => addWeeks(s, 1))}
              className="rounded-md border border-zinc-700 px-2.5 py-1.5 text-sm text-zinc-400 hover:bg-zinc-900"
              aria-label="Próxima semana"
            >
              →
            </button>
          </div>
          <select
            value={filtroResponsavel}
            onChange={(e) => setFiltroResponsavel(e.target.value)}
            className="rounded-md border border-zinc-700 bg-zinc-800 px-2 py-1.5 text-sm text-zinc-300"
          >
            <option value="todos">Todos os responsáveis</option>
            {responsaveisConhecidos.map((nome) => (
              <option key={nome} value={nome}>
                {nome}
              </option>
            ))}
          </select>
        </div>
      </div>

      {erro && (
        <p className="rounded-md bg-red-500/10 px-3 py-2 text-sm text-red-400">
          Erro ao carregar tarefas: {erro}
        </p>
      )}

      {carregando ? (
        <p className="py-12 text-center text-sm text-zinc-600">Carregando...</p>
      ) : (
        <DndContext sensors={sensors} onDragEnd={aoFinalizarArrasteCalendario}>
          <div className="flex flex-col gap-3">
            <div
              ref={setSemPrazoRef}
              className={`flex flex-col gap-2 rounded-xl border p-3 ${
                semPrazoIsOver ? "border-oliva bg-oliva-claro/10" : "border-zinc-700 bg-zinc-900"
              }`}
            >
              <h2 className="text-xs font-semibold text-zinc-500">Sem prazo definido</h2>
              {tarefasSemPrazo.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {tarefasSemPrazo.map((tarefa) => (
                    <div key={tarefa.id} className="w-56">
                      <TaskChip
                        tarefa={tarefa}
                        mostrarResponsavel={filtroResponsavel === "todos"}
                        onClick={() => abrirEdicaoTarefa(tarefa)}
                        onToggleConcluida={() => alternarConcluida(tarefa)}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-zinc-600">Arraste uma tarefa aqui para remover o prazo.</p>
              )}
            </div>
            <TaskCalendarGrid
              semanaAtual={semanaAtual}
              tarefas={tarefasComPrazo}
              mostrarResponsavel={filtroResponsavel === "todos"}
              onClickTarefa={abrirEdicaoTarefa}
              onNovaTarefa={abrirNovaTarefaNoDia}
              onToggleConcluida={alternarConcluida}
            />
          </div>
        </DndContext>
      )}

      {modalAberto && (
        <TaskModal
          tarefa={tarefaSelecionada}
          colunaPadrao={colunaParaNovaTarefa}
          prazoPadrao={prazoParaNovaTarefa}
          responsavelPadrao={filtroResponsavel !== "todos" ? filtroResponsavel : undefined}
          onFechar={() => setModalAberto(false)}
          onSalvar={salvarTarefa}
          onExcluir={excluirTarefa}
        />
      )}
    </div>
  );
}
