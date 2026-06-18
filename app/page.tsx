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
import { Etiqueta, NovoPost, Post } from "@/lib/types";
import CalendarGrid from "@/components/calendario/CalendarGrid";
import PostModal from "@/components/calendario/PostModal";
import Filtros, { FiltrosState } from "@/components/calendario/Filtros";

export default function PaginaCalendario() {
  const [mesAtual, setMesAtual] = useState(() => new Date());
  const [posts, setPosts] = useState<Post[]>([]);
  const [etiquetas, setEtiquetas] = useState<Etiqueta[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [filtros, setFiltros] = useState<FiltrosState>({
    canal: "todos",
    tipo: "todos",
    etiqueta: "todos",
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
    const [{ data: postsData, error: erroPosts }, { data: relsData, error: erroRels }] =
      await Promise.all([
        supabase.from("posts").select("*").order("data", { ascending: true }),
        supabase.from("post_etiquetas").select("post_id, etiqueta_id"),
      ]);
    if (erroPosts || erroRels) {
      setErro(erroPosts?.message ?? erroRels?.message ?? "Erro desconhecido");
    } else {
      const posts = (postsData ?? []).map((p) => ({
        ...(p as Omit<Post, "etiqueta_ids">),
        etiqueta_ids: (relsData ?? [])
          .filter((r) => r.post_id === p.id)
          .map((r) => r.etiqueta_id as string),
      }));
      setPosts(posts);
      setErro(null);
    }
    setCarregando(false);
  }

  async function carregarEtiquetas() {
    const { data, error } = await supabase
      .from("etiquetas")
      .select("*")
      .order("criado_em", { ascending: true });
    if (!error && data) {
      setEtiquetas(data as Etiqueta[]);
    }
  }

  useEffect(() => {
    carregarPosts();
    carregarEtiquetas();
  }, []);

  const postsFiltrados = useMemo(() => {
    return posts.filter((post) => {
      if (filtros.canal !== "todos" && post.canal !== filtros.canal) return false;
      if (filtros.tipo !== "todos" && post.tipo !== filtros.tipo) return false;
      if (filtros.etiqueta !== "todos" && !post.etiqueta_ids.includes(filtros.etiqueta))
        return false;
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

  async function salvarPost(id: string | null, valores: NovoPost, etiquetaIds: string[]) {
    let postSalvo: Post | null = null;
    if (id) {
      const { data, error } = await supabase
        .from("posts")
        .update(valores)
        .eq("id", id)
        .select()
        .single();
      if (error || !data) return;
      postSalvo = { ...(data as Omit<Post, "etiqueta_ids">), etiqueta_ids: etiquetaIds };
    } else {
      const { data, error } = await supabase
        .from("posts")
        .insert(valores)
        .select()
        .single();
      if (error || !data) return;
      postSalvo = { ...(data as Omit<Post, "etiqueta_ids">), etiqueta_ids: etiquetaIds };
    }

    await supabase.from("post_etiquetas").delete().eq("post_id", postSalvo.id);
    if (etiquetaIds.length > 0) {
      await supabase
        .from("post_etiquetas")
        .insert(etiquetaIds.map((etiqueta_id) => ({ post_id: postSalvo!.id, etiqueta_id })));
    }

    setPosts((atual) =>
      id ? atual.map((p) => (p.id === id ? postSalvo! : p)) : [...atual, postSalvo!]
    );
    setModalAberto(false);
  }

  async function excluirPost(id: string) {
    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (!error) {
      setPosts((atual) => atual.filter((p) => p.id !== id));
    }
    setModalAberto(false);
  }

  async function criarEtiqueta(nome: string, cor: string): Promise<Etiqueta> {
    const { data, error } = await supabase
      .from("etiquetas")
      .insert({ nome, cor })
      .select()
      .single();
    if (error || !data) throw error;
    setEtiquetas((atual) => [...atual, data as Etiqueta]);
    return data as Etiqueta;
  }

  async function editarEtiqueta(id: string, nome: string, cor: string) {
    const { data, error } = await supabase
      .from("etiquetas")
      .update({ nome, cor })
      .eq("id", id)
      .select()
      .single();
    if (!error && data) {
      setEtiquetas((atual) => atual.map((e) => (e.id === id ? (data as Etiqueta) : e)));
    }
  }

  async function excluirEtiqueta(id: string) {
    const { error } = await supabase.from("etiquetas").delete().eq("id", id);
    if (!error) {
      setEtiquetas((atual) => atual.filter((e) => e.id !== id));
      setPosts((atual) =>
        atual.map((p) => ({
          ...p,
          etiqueta_ids: p.etiqueta_ids.filter((eid) => eid !== id),
        }))
      );
    }
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
            className="rounded-md border border-zinc-700 px-2.5 py-1.5 text-sm text-zinc-400 hover:bg-zinc-900"
            aria-label="Mês anterior"
          >
            ←
          </button>
          <h1 className="min-w-[160px] text-lg font-semibold capitalize text-zinc-100">
            {format(mesAtual, "MMMM yyyy", { locale: ptBR })}
          </h1>
          <button
            onClick={() => setMesAtual((m) => addMonths(m, 1))}
            className="rounded-md border border-zinc-700 px-2.5 py-1.5 text-sm text-zinc-400 hover:bg-zinc-900"
            aria-label="Próximo mês"
          >
            →
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Filtros filtros={filtros} etiquetas={etiquetas} onChange={setFiltros} />
          <button
            onClick={() => abrirNovoPost(format(new Date(), "yyyy-MM-dd"))}
            className="rounded-md bg-oliva px-3 py-2 text-sm font-medium text-white hover:bg-oliva-forte"
          >
            + Adicionar post
          </button>
        </div>
      </div>

      {erro && (
        <p className="rounded-md bg-red-500/10 px-3 py-2 text-sm text-red-400">
          Erro ao carregar posts: {erro}
        </p>
      )}

      {carregando ? (
        <p className="py-12 text-center text-sm text-zinc-600">Carregando...</p>
      ) : (
        <DndContext sensors={sensors} onDragEnd={aoFinalizarArraste}>
          <CalendarGrid
            mesAtual={mesAtual}
            posts={postsFiltrados}
            etiquetas={etiquetas}
            onClickPost={abrirEdicaoPost}
            onNovoPost={abrirNovoPost}
          />
        </DndContext>
      )}

      {modalAberto && (
        <PostModal
          post={postSelecionado}
          dataPadrao={dataParaNovoPost}
          etiquetas={etiquetas}
          onFechar={() => setModalAberto(false)}
          onSalvar={salvarPost}
          onExcluir={excluirPost}
          onCriarEtiqueta={criarEtiqueta}
          onEditarEtiqueta={editarEtiqueta}
          onExcluirEtiqueta={excluirEtiqueta}
        />
      )}
    </div>
  );
}
