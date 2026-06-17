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
import { NovoPost, Post } from "@/lib/types";
import CalendarGrid from "@/components/calendario/CalendarGrid";
import PostModal from "@/components/calendario/PostModal";
import Filtros, { FiltrosState } from "@/components/calendario/Filtros";

export default function PaginaCalendario() {
  const [mesAtual, setMesAtual] = useState(() => new Date());
  const [posts, setPosts] = useState<Post[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [filtros, setFiltros] = useState<FiltrosState>({
    canal: "todos",
    tipo: "todos",
    formato: "todos",
  });
  const [modalAberto, setModalAberto] = useState(false);
  const [postSelecionado, setPostSelecionado] = useState<Post | null>(null);
  const [dataParaNovoPost, setDataParaNovoPost] = useState(() =>
    format(new Date(), "yyyy-MM-dd")
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } })
  );

  async function carregarPosts() {
    setCarregando(true);
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("data", { ascending: true });
    if (error) {
      setErro(error.message);
    } else {
      setPosts(data as Post[]);
      setErro(null);
    }
    setCarregando(false);
  }

  useEffect(() => {
    carregarPosts();
  }, []);

  const postsFiltrados = useMemo(() => {
    return posts.filter((post) => {
      if (filtros.canal !== "todos" && post.canal !== filtros.canal) return false;
      if (filtros.tipo !== "todos" && post.tipo !== filtros.tipo) return false;
      if (filtros.formato !== "todos" && post.formato !== filtros.formato) return false;
      return true;
    });
  }, [posts, filtros]);

  function abrirNovoPost(data: string) {
    setPostSelecionado(null);
    setDataParaNovoPost(data);
    setModalAberto(true);
  }

  function abrirEdicaoPost(post: Post) {
    setPostSelecionado(post);
    setModalAberto(true);
  }

  async function salvarPost(id: string | null, valores: NovoPost) {
    if (id) {
      const { data, error } = await supabase
        .from("posts")
        .update(valores)
        .eq("id", id)
        .select()
        .single();
      if (!error && data) {
        setPosts((atual) => atual.map((p) => (p.id === id ? (data as Post) : p)));
      }
    } else {
      const { data, error } = await supabase
        .from("posts")
        .insert(valores)
        .select()
        .single();
      if (!error && data) {
        setPosts((atual) => [...atual, data as Post]);
      }
    }
    setModalAberto(false);
  }

  async function excluirPost(id: string) {
    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (!error) {
      setPosts((atual) => atual.filter((p) => p.id !== id));
    }
    setModalAberto(false);
  }

  async function moverPost(postId: string, novaData: string) {
    setPosts((atual) =>
      atual.map((p) => (p.id === postId ? { ...p, data: novaData } : p))
    );
    const { error } = await supabase
      .from("posts")
      .update({ data: novaData })
      .eq("id", postId);
    if (error) {
      carregarPosts();
    }
  }

  function aoFinalizarArraste(evento: DragEndEvent) {
    const { active, over } = evento;
    if (!over) return;
    const postId = String(active.id);
    const novaData = String(over.id);
    const post = posts.find((p) => p.id === postId);
    if (post && post.data !== novaData) {
      moverPost(postId, novaData);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMesAtual((m) => subMonths(m, 1))}
            className="rounded-md border border-zinc-300 px-2.5 py-1.5 text-sm text-zinc-600 hover:bg-zinc-100"
            aria-label="Mês anterior"
          >
            ←
          </button>
          <h1 className="min-w-[160px] text-lg font-semibold capitalize text-zinc-900">
            {format(mesAtual, "MMMM yyyy", { locale: ptBR })}
          </h1>
          <button
            onClick={() => setMesAtual((m) => addMonths(m, 1))}
            className="rounded-md border border-zinc-300 px-2.5 py-1.5 text-sm text-zinc-600 hover:bg-zinc-100"
            aria-label="Próximo mês"
          >
            →
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Filtros filtros={filtros} onChange={setFiltros} />
          <button
            onClick={() => abrirNovoPost(format(new Date(), "yyyy-MM-dd"))}
            className="rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800"
          >
            + Adicionar post
          </button>
        </div>
      </div>

      {erro && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          Erro ao carregar posts: {erro}
        </p>
      )}

      {carregando ? (
        <p className="py-12 text-center text-sm text-zinc-400">Carregando...</p>
      ) : (
        <DndContext sensors={sensors} onDragEnd={aoFinalizarArraste}>
          <CalendarGrid
            mesAtual={mesAtual}
            posts={postsFiltrados}
            onClickPost={abrirEdicaoPost}
            onNovoPost={abrirNovoPost}
          />
        </DndContext>
      )}

      {modalAberto && (
        <PostModal
          post={postSelecionado}
          dataPadrao={dataParaNovoPost}
          onFechar={() => setModalAberto(false)}
          onSalvar={salvarPost}
          onExcluir={excluirPost}
        />
      )}
    </div>
  );
}
