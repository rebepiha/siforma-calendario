"use client";

import { useEffect, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { supabase } from "@/lib/supabase";
import { ColunaTarefa, COLUNAS_TAREFA, NovaTarefa, Tarefa } from "@/lib/types";
import KanbanColumn from "@/components/tarefas/KanbanColumn";
import TaskModal from "@/components/tarefas/TaskModal";

export default function PaginaTarefas() {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [tarefaSelecionada, setTarefaSelecionada] = useState<Tarefa | null>(null);
  const [colunaParaNovaTarefa, setColunaParaNovaTarefa] =
    useState<ColunaTarefa>("a_fazer");

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

  function abrirNovaTarefa(coluna: ColunaTarefa) {
    setTarefaSelecionada(null);
    setColunaParaNovaTarefa(coluna);
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
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-zinc-900">Tarefas de Marketing</h1>
      </div>

      {erro && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          Erro ao carregar tarefas: {erro}
        </p>
      )}

      {carregando ? (
        <p className="py-12 text-center text-sm text-zinc-400">Carregando...</p>
      ) : (
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
      )}

      {modalAberto && (
        <TaskModal
          tarefa={tarefaSelecionada}
          colunaPadrao={colunaParaNovaTarefa}
          onFechar={() => setModalAberto(false)}
          onSalvar={salvarTarefa}
          onExcluir={excluirTarefa}
        />
      )}
    </div>
  );
}
