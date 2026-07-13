"use client";

import { useEffect, useMemo, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  closestCenter,
  useDroppable,
  useDraggable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { supabase } from "@/lib/supabase";
import {
  COLUNAS_SITE,
  NovaTarefaSite,
  StatusTarefaSite,
  TarefaSite,
} from "@/lib/types";
import SiteTaskModal from "@/components/site/SiteTaskModal";
import ContextMenu from "@/components/ContextMenu";

const COR_STATUS: Record<StatusTarefaSite, string> = {
  a_fazer: "#ef4444",
  em_andamento: "#eab308",
  concluido: "#22c55e",
};

const TITULO_STATUS: Record<StatusTarefaSite, string> = {
  a_fazer: "text-zinc-300",
  em_andamento: "text-yellow-400",
  concluido: "text-green-400",
};

function CardConteudo({ tarefa }: { tarefa: TarefaSite }) {
  return (
    <>
      <p className="text-sm font-medium leading-snug text-zinc-100 line-clamp-2">
        {tarefa.titulo}
      </p>
      {tarefa.descricao && (
        <p className="mt-1 text-xs leading-relaxed text-zinc-500 line-clamp-2">
          {tarefa.descricao}
        </p>
      )}
    </>
  );
}

function CardTarefa({
  tarefa,
  onEdit,
  onContextMenu,
}: {
  tarefa: TarefaSite;
  onEdit: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: tarefa.id,
  });

  return (
    <div
      ref={setNodeRef}
      style={{ borderLeftColor: COR_STATUS[tarefa.status], borderLeftWidth: "3px" }}
      className={`touch-none cursor-grab select-none rounded-lg border border-zinc-700 bg-zinc-800/80 px-3 py-2.5 transition-opacity hover:bg-zinc-800 active:cursor-grabbing ${
        isDragging ? "opacity-20" : ""
      } ${tarefa.status === "concluido" && !isDragging ? "opacity-50" : ""}`}
      onClick={onEdit}
      onContextMenu={onContextMenu}
      {...attributes}
      {...listeners}
    >
      <CardConteudo tarefa={tarefa} />
    </div>
  );
}

function ColunaKanban({
  col,
  tarefas,
  onNova,
  onEdit,
  onContextMenu,
}: {
  col: (typeof COLUNAS_SITE)[number];
  tarefas: TarefaSite[];
  onNova: () => void;
  onEdit: (t: TarefaSite) => void;
  onContextMenu: (e: React.MouseEvent, t: TarefaSite) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: col.id });

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between pb-1">
        <span className={`text-sm font-semibold ${TITULO_STATUS[col.id]}`}>
          {col.titulo}
          <span className="ml-2 text-xs font-normal text-zinc-600">{tarefas.length}</span>
        </span>
        <button
          onClick={onNova}
          className="rounded p-1 text-base leading-none text-zinc-500 hover:bg-zinc-700 hover:text-zinc-200"
        >
          +
        </button>
      </div>

      <div
        ref={setNodeRef}
        className={`flex min-h-[80px] flex-col gap-2 rounded-lg p-1.5 transition-colors ${
          isOver ? "bg-zinc-700/40 ring-1 ring-zinc-500" : ""
        }`}
      >
        {tarefas.map((tarefa) => (
          <CardTarefa
            key={tarefa.id}
            tarefa={tarefa}
            onEdit={() => onEdit(tarefa)}
            onContextMenu={(e) => onContextMenu(e, tarefa)}
          />
        ))}
        {tarefas.length === 0 && (
          <button
            onClick={onNova}
            className="rounded-lg border border-dashed border-zinc-700 px-3 py-5 text-center text-xs text-zinc-600 transition-colors hover:border-zinc-500 hover:text-zinc-400"
          >
            + Adicionar tarefa
          </button>
        )}
      </div>
    </div>
  );
}

export default function PaginaTarefasSite() {
  const [tarefas, setTarefas] = useState<TarefaSite[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [tarefaSelecionada, setTarefaSelecionada] = useState<TarefaSite | null>(null);
  const [statusParaNova, setStatusParaNova] = useState<StatusTarefaSite>("a_fazer");
  const [menuContexto, setMenuContexto] = useState<{
    x: number;
    y: number;
    tarefa: TarefaSite;
  } | null>(null);
  const [busca, setBusca] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  async function carregar() {
    setCarregando(true);
    const { data } = await supabase
      .from("tarefas_site")
      .select("*")
      .order("criado_em", { ascending: true });
    if (data) setTarefas(data as TarefaSite[]);
    setCarregando(false);
  }

  useEffect(() => {
    carregar();
  }, []);

  const activeTarefa = useMemo(
    () => tarefas.find((t) => t.id === activeId) ?? null,
    [tarefas, activeId]
  );

  const tarefasFiltradas = useMemo(() => {
    const b = busca.trim().toLowerCase();
    if (!b) return tarefas;
    return tarefas.filter(
      (t) =>
        t.titulo.toLowerCase().includes(b) ||
        t.descricao?.toLowerCase().includes(b)
    );
  }, [tarefas, busca]);

  const porColuna = useMemo(() => {
    const m: Record<StatusTarefaSite, TarefaSite[]> = {
      a_fazer: [],
      em_andamento: [],
      concluido: [],
    };
    tarefasFiltradas.forEach((t) => m[t.status].push(t));
    return m;
  }, [tarefasFiltradas]);

  function abrirNova(status: StatusTarefaSite) {
    setStatusParaNova(status);
    setTarefaSelecionada(null);
    setModalAberto(true);
  }

  function abrirEdicao(tarefa: TarefaSite) {
    setTarefaSelecionada(tarefa);
    setModalAberto(true);
  }

  async function salvar(id: string | null, valores: NovaTarefaSite) {
    if (id) {
      const { data } = await supabase
        .from("tarefas_site")
        .update(valores)
        .eq("id", id)
        .select()
        .single();
      if (data) {
        setTarefas((prev) => prev.map((t) => (t.id === id ? (data as TarefaSite) : t)));
      }
    } else {
      const { data } = await supabase
        .from("tarefas_site")
        .insert(valores)
        .select()
        .single();
      if (data) {
        setTarefas((prev) => [...prev, data as TarefaSite]);
      }
    }
    setModalAberto(false);
    setTarefaSelecionada(null);
  }

  async function excluir(id: string) {
    await supabase.from("tarefas_site").delete().eq("id", id);
    setTarefas((prev) => prev.filter((t) => t.id !== id));
    setModalAberto(false);
    setTarefaSelecionada(null);
    setMenuContexto(null);
  }

  async function moverStatus(tarefa: TarefaSite, novoStatus: StatusTarefaSite) {
    await supabase
      .from("tarefas_site")
      .update({ status: novoStatus })
      .eq("id", tarefa.id);
    setTarefas((prev) =>
      prev.map((t) => (t.id === tarefa.id ? { ...t, status: novoStatus } : t))
    );
    setMenuContexto(null);
  }

  function aoIniciarArraste(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  async function aoFinalizarArraste(event: DragEndEvent) {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;
    const novoStatus = over.id as StatusTarefaSite;
    const tarefa = tarefas.find((t) => t.id === active.id);
    if (!tarefa || tarefa.status === novoStatus) return;
    await moverStatus(tarefa, novoStatus);
  }

  const itensMenuContexto = useMemo(() => {
    if (!menuContexto) return [];
    const { tarefa } = menuContexto;
    return [
      {
        label: "Editar",
        onClick: () => {
          abrirEdicao(tarefa);
          setMenuContexto(null);
        },
      },
      ...(tarefa.status !== "a_fazer"
        ? [{ label: "Mover para A Fazer", onClick: () => moverStatus(tarefa, "a_fazer") }]
        : []),
      ...(tarefa.status !== "em_andamento"
        ? [{ label: "Mover para Em Andamento", onClick: () => moverStatus(tarefa, "em_andamento") }]
        : []),
      ...(tarefa.status !== "concluido"
        ? [{ label: "Marcar concluída", onClick: () => moverStatus(tarefa, "concluido") }]
        : []),
      {
        label: "Excluir",
        onClick: () => excluir(tarefa.id),
        destrutivo: true,
      },
    ];
  }, [menuContexto]);

  return (
    <div className="flex flex-col gap-6 px-4 py-6 sm:px-6">
      <div className="flex flex-wrap items-center gap-4">
        <h1 className="text-xl font-semibold text-zinc-100">Tarefas Site</h1>
        <div className="ml-auto flex items-center gap-2">
          <input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar..."
            className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-zinc-500 focus:outline-none"
          />
          <button
            onClick={() => abrirNova("a_fazer")}
            className="rounded-md bg-oliva px-3 py-1.5 text-sm font-medium text-white hover:bg-oliva-forte"
          >
            + Nova
          </button>
        </div>
      </div>

      {carregando ? (
        <p className="text-sm text-zinc-500">Carregando...</p>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={aoIniciarArraste}
          onDragEnd={aoFinalizarArraste}
          onDragCancel={() => setActiveId(null)}
        >
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {COLUNAS_SITE.map((col) => (
              <ColunaKanban
                key={col.id}
                col={col}
                tarefas={porColuna[col.id]}
                onNova={() => abrirNova(col.id)}
                onEdit={abrirEdicao}
                onContextMenu={(e, tarefa) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setMenuContexto({ x: e.clientX, y: e.clientY, tarefa });
                }}
              />
            ))}
          </div>

          <DragOverlay>
            {activeTarefa && (
              <div
                style={{
                  borderLeftColor: COR_STATUS[activeTarefa.status],
                  borderLeftWidth: "3px",
                }}
                className="cursor-grabbing rounded-lg border border-zinc-600 bg-zinc-800 px-3 py-2.5 shadow-2xl opacity-95"
              >
                <CardConteudo tarefa={activeTarefa} />
              </div>
            )}
          </DragOverlay>
        </DndContext>
      )}

      {modalAberto && (
        <SiteTaskModal
          key={tarefaSelecionada?.id ?? "nova"}
          tarefa={tarefaSelecionada}
          statusPadrao={statusParaNova}
          onFechar={() => {
            setModalAberto(false);
            setTarefaSelecionada(null);
          }}
          onSalvar={salvar}
          onExcluir={excluir}
        />
      )}

      {menuContexto && (
        <ContextMenu
          x={menuContexto.x}
          y={menuContexto.y}
          itens={itensMenuContexto}
          onFechar={() => setMenuContexto(null)}
        />
      )}
    </div>
  );
}
