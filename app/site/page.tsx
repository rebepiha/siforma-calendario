"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  COLUNAS_SITE,
  NovaTarefaSite,
  StatusTarefaSite,
  TarefaSite,
} from "@/lib/types";
import SiteTaskModal from "@/components/site/SiteTaskModal";
import ContextMenu from "@/components/ContextMenu";

const ESTILO_COLUNA: Record<StatusTarefaSite, { titulo: string }> = {
  a_fazer: { titulo: "text-zinc-300" },
  em_andamento: { titulo: "text-yellow-400" },
  concluido: { titulo: "text-green-400" },
};

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
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {COLUNAS_SITE.map((col) => {
            const estilo = ESTILO_COLUNA[col.id];
            const lista = porColuna[col.id];
            return (
              <div key={col.id} className="flex flex-col gap-2">
                <div className="flex items-center justify-between pb-1">
                  <span className={`text-sm font-semibold ${estilo.titulo}`}>
                    {col.titulo}
                    <span className="ml-2 text-xs font-normal text-zinc-600">
                      {lista.length}
                    </span>
                  </span>
                  <button
                    onClick={() => abrirNova(col.id)}
                    className="rounded p-1 text-base leading-none text-zinc-500 hover:bg-zinc-700 hover:text-zinc-200"
                    title={`Nova tarefa em ${col.titulo}`}
                  >
                    +
                  </button>
                </div>

                <div className="flex flex-col gap-2">
                  {lista.map((tarefa) => (
                    <div
                      key={tarefa.id}
                      onClick={() => abrirEdicao(tarefa)}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setMenuContexto({ x: e.clientX, y: e.clientY, tarefa });
                      }}
                      className={`cursor-pointer rounded-lg border border-zinc-700 bg-zinc-800/80 px-3 py-2.5 transition-colors hover:bg-zinc-800 ${
                        tarefa.status === "concluido" ? "opacity-50" : ""
                      }`}
                      style={
                        tarefa.cor
                          ? { borderLeftColor: tarefa.cor, borderLeftWidth: "3px" }
                          : undefined
                      }
                    >
                      <div className="flex items-start">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium leading-snug text-zinc-100 line-clamp-2">
                            {tarefa.titulo}
                          </p>
                          {tarefa.descricao && (
                            <p className="mt-1 text-xs leading-relaxed text-zinc-500 line-clamp-2">
                              {tarefa.descricao}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {lista.length === 0 && (
                    <button
                      onClick={() => abrirNova(col.id)}
                      className="rounded-lg border border-dashed border-zinc-700 px-3 py-5 text-center text-xs text-zinc-600 transition-colors hover:border-zinc-500 hover:text-zinc-400"
                    >
                      + Adicionar tarefa
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
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
