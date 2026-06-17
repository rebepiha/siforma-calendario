"use client";

import { useEffect, useMemo, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { addMonths, format, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import { supabase } from "@/lib/supabase";
import { ColunaTarefa, COLUNAS_TAREFA, NovaTarefa, Tarefa } from "@/lib/types";
import KanbanColumn from "@/components/tarefas/KanbanColumn";
import TaskCalendarGrid from "@/components/tarefas/TaskCalendarGrid";
import TaskChip from "@/components/tarefas/TaskChip";
import TaskModal from "@/components/tarefas/TaskModal";

type Visualizacao = "kanban" | "calendario";

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

  const [visualizacao, setVisualizacao] = useState<Visualizacao>("kanban");
  const [mesAtual, setMesAtual] = useState(() => new Date());
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

  function abrirNovaTarefa(coluna: ColunaTarefa) {
    setTarefaSelecionada(null);
    setColunaParaNovaTarefa(coluna);
    setPrazoParaNovaTarefa(undefined);
    setModalAberto(true);
  }

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

  function aoFinalizarArraste(evento: DragEndEvent) {
    const { active, over } = evento;
    if (!over) return;
    const tarefaId = String(active.id);
    const novaColuna = String(over.id) as ColunaTarefa;
    const tarefa = tarefas.find((t) => t.id === tarefaId);
    if (tarefa && tarefa.coluna !== novaColuna) {
      moverTarefa(tarefaId, novaColuna);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-lg font-semibold text-zinc-900">Tarefas de Marketing</h1>
          <div className="flex items-center gap-1 rounded-md border border-zinc-200 bg-zinc-50 p-1">
            <button
              onClick={() => setVisualizacao("kanban")}
              className={`rounded px-3 py-1.5 text-sm font-medium transition-colors ${
                visualizacao === "kanban"
                  ? "bg-oliva text-white"
                  : "text-zinc-600 hover:bg-white hover:text-zinc-900"
              }`}
            >
              Kanban
            </button>
            <button
              onClick={() => setVisualizacao("calendario")}
              className={`rounded px-3 py-1.5 text-sm font-medium transition-colors ${
                visualizacao === "calendario"
                  ? "bg-oliva text-white"
                  : "text-zinc-600 hover:bg-white hover:text-zinc-900"
              }`}
            >
              Calendário
            </button>
          </div>
        </div>

        {visualizacao === "calendario" && (
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMesAtual((m) => subMonths(m, 1))}
                className="rounded-md border border-zinc-300 px-2.5 py-1.5 text-sm text-zinc-600 hover:bg-zinc-100"
                aria-label="Mês anterior"
              >
                ←
              </button>
              <span className="min-w-[140px] text-center text-sm font-semibold capitalize text-zinc-900">
                {format(mesAtual, "MMMM yyyy", { locale: ptBR })}
              </span>
              <button
                onClick={() => setMesAtual((m) => addMonths(m, 1))}
                className="rounded-md border border-zinc-300 px-2.5 py-1.5 text-sm text-zinc-600 hover:bg-zinc-100"
                aria-label="Próximo mês"
              >
                →
              </button>
            </div>
            <select
              value={filtroResponsavel}
              onChange={(e) => setFiltroResponsavel(e.target.value)}
              className="rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-sm text-zinc-700"
            >
              <option value="todos">Todos os responsáveis</option>
              {responsaveisConhecidos.map((nome) => (
                <option key={nome} value={nome}>
                  {nome}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {erro && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          Erro ao carregar tarefas: {erro}
        </p>
      )}

      {carregando ? (
        <p className="py-12 text-center text-sm text-zinc-400">Carregando...</p>
      ) : visualizacao === "kanban" ? (
        <DndContext sensors={sensors} onDragEnd={aoFinalizarArraste}>
          <div className="flex flex-col gap-3 overflow-x-auto pb-2 sm:flex-row">
            {COLUNAS_TAREFA.map((coluna) => (
              <KanbanColumn
                key={coluna.id}
                coluna={coluna.id}
                titulo={coluna.titulo}
                tarefas={tarefas.filter((t) => t.coluna === coluna.id)}
                onClickTarefa={abrirEdicaoTarefa}
                onNovaTarefa={abrirNovaTarefa}
              />
            ))}
          </div>
        </DndContext>
      ) : (
        <div className="flex flex-col gap-3">
          {tarefasSemPrazo.length > 0 && (
            <div className="flex flex-col gap-2 rounded-xl border border-zinc-200 bg-zinc-50 p-3">
              <h2 className="text-xs font-semibold text-zinc-500">Sem prazo definido</h2>
              <div className="flex flex-wrap gap-2">
                {tarefasSemPrazo.map((tarefa) => (
                  <div key={tarefa.id} className="w-56">
                    <TaskChip tarefa={tarefa} onClick={() => abrirEdicaoTarefa(tarefa)} />
                  </div>
                ))}
              </div>
            </div>
          )}
          <TaskCalendarGrid
            mesAtual={mesAtual}
            tarefas={tarefasComPrazo}
            onClickTarefa={abrirEdicaoTarefa}
            onNovaTarefa={abrirNovaTarefaNoDia}
          />
        </div>
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
