"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Meta, NovaMeta } from "@/lib/types";
import GoalCard from "@/components/metas/GoalCard";
import GoalModal from "@/components/metas/GoalModal";

export default function PaginaMetas() {
  const [metas, setMetas] = useState<Meta[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [metaSelecionada, setMetaSelecionada] = useState<Meta | null>(null);

  async function carregarMetas() {
    setCarregando(true);
    const { data, error } = await supabase.from("metas").select("*");
    if (error) {
      setErro(error.message);
    } else {
      setMetas(data as Meta[]);
      setErro(null);
    }
    setCarregando(false);
  }

  useEffect(() => {
    carregarMetas();
  }, []);

  function abrirNovaMeta() {
    setMetaSelecionada(null);
    setModalAberto(true);
  }

  function abrirEdicaoMeta(meta: Meta) {
    setMetaSelecionada(meta);
    setModalAberto(true);
  }

  async function salvarMeta(id: string | null, valores: NovaMeta) {
    if (id) {
      const { data, error } = await supabase
        .from("metas")
        .update(valores)
        .eq("id", id)
        .select()
        .single();
      if (!error && data) {
        setMetas((atual) => atual.map((m) => (m.id === id ? (data as Meta) : m)));
      }
    } else {
      const { data, error } = await supabase
        .from("metas")
        .insert(valores)
        .select()
        .single();
      if (!error && data) {
        setMetas((atual) => [...atual, data as Meta]);
      }
    }
    setModalAberto(false);
  }

  async function excluirMeta(id: string) {
    const { error } = await supabase.from("metas").delete().eq("id", id);
    if (!error) {
      setMetas((atual) => atual.filter((m) => m.id !== id));
    }
    setModalAberto(false);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-zinc-900">Metas e Progresso</h1>
        <button
          onClick={abrirNovaMeta}
          className="rounded-md bg-oliva px-3 py-2 text-sm font-medium text-white hover:bg-oliva-forte"
        >
          + Nova meta
        </button>
      </div>

      {erro && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          Erro ao carregar metas: {erro}
        </p>
      )}

      {carregando ? (
        <p className="py-12 text-center text-sm text-zinc-400">Carregando...</p>
      ) : metas.length === 0 ? (
        <p className="py-12 text-center text-sm text-zinc-400">
          Nenhuma meta cadastrada ainda. Clique em &ldquo;+ Nova meta&rdquo; para começar.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {metas.map((meta) => (
            <GoalCard key={meta.id} meta={meta} onClick={() => abrirEdicaoMeta(meta)} />
          ))}
        </div>
      )}

      {modalAberto && (
        <GoalModal
          meta={metaSelecionada}
          onFechar={() => setModalAberto(false)}
          onSalvar={salvarMeta}
          onExcluir={excluirMeta}
        />
      )}
    </div>
  );
}
