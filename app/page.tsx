"use client";

import { useEffect, useMemo, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { addMonths, format, isSameMonth, parseISO, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import { supabase } from "@/lib/supabase";
import { Etiqueta, NovoPost, Post } from "@/lib/types";
import { useUndoStack } from "@/lib/useUndoStack";
import { mesmosValores } from "@/lib/mesmosValores";
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
    busca: "",
  });
  const [modalAberto, setModalAberto] = useState(false);
  const [postSelecionado, setPostSelecionado] = useState<Post | null>(null);
  const [dataParaNovoPost, setDataParaNovoPost] = useState(() =>
    format(new Date(), "yyyy-MM-dd")
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } })
  );

  const { registrarAcao } = useUndoStack(!modalAberto);

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
      if (
        filtros.busca.trim() &&
        !post.titulo.toLowerCase().includes(filtros.busca.trim().toLowerCase())
      )
        return false;
      return true;
    });
  }, [posts, filtros]);

  const resumoMes = useMemo(() => {
    const doMes = posts.filter((p) => isSameMonth(parseISO(p.data), mesAtual));
    const publicados = doMes.filter((p) => p.status === "publicado").length;
    return { total: doMes.length, publicados };
  }, [posts, mesAtual]);

  function abrirNovoPost(data: string) {
    setPostSelecionado(null);
    setDataParaNovoPost(data);
    setModalAberto(true);
  }

  function abrirEdicaoPost(post: Post) {
    setPostSelecionado(post);
    setModalAberto(true);
  }

  function paraNovoPost(post: Post): NovoPost {
    return {
      titulo: post.titulo,
      data: post.data,
      canal: post.canal,
      tipo: post.tipo,
      categoria: post.categoria,
      video_pronto: post.video_pronto,
      novo_produto: post.novo_produto,
      status: post.status,
      copy: post.copy,
      observacoes: post.observacoes,
    };
  }

  async function sincronizarEtiquetasPost(postId: string, etiquetaIds: string[]) {
    await supabase.from("post_etiquetas").delete().eq("post_id", postId);
    if (etiquetaIds.length > 0) {
      await supabase
        .from("post_etiquetas")
        .insert(etiquetaIds.map((etiqueta_id) => ({ post_id: postId, etiqueta_id })));
    }
  }

  async function aplicarCamposPost(id: string, campos: Partial<NovoPost>) {
    setPosts((atual) => atual.map((p) => (p.id === id ? { ...p, ...campos } : p)));
    const { error } = await supabase.from("posts").update(campos).eq("id", id);
    if (error) carregarPosts();
  }

  async function aplicarEtiquetasPost(id: string, etiquetaIds: string[]) {
    await sincronizarEtiquetasPost(id, etiquetaIds);
    setPosts((atual) => atual.map((p) => (p.id === id ? { ...p, etiqueta_ids: etiquetaIds } : p)));
  }

  async function aplicarExclusaoPost(id: string) {
    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (!error) setPosts((atual) => atual.filter((p) => p.id !== id));
  }

  async function aplicarRestauracaoPost(post: Post) {
    const { error } = await supabase
      .from("posts")
      .insert({ id: post.id, ordem: post.ordem, ...paraNovoPost(post) });
    if (error) return;
    await sincronizarEtiquetasPost(post.id, post.etiqueta_ids);
    setPosts((atual) => [...atual, post]);
  }

  async function aplicarPosicoesPost(posicoes: { id: string; data: string; ordem: number }[]) {
    setPosts((atual) => {
      const porId = new Map(posicoes.map((p) => [p.id, p]));
      return atual.map((p) => {
        const pos = porId.get(p.id);
        return pos ? { ...p, data: pos.data, ordem: pos.ordem } : p;
      });
    });
    await Promise.all(
      posicoes.map((p) =>
        supabase.from("posts").update({ data: p.data, ordem: p.ordem }).eq("id", p.id)
      )
    );
  }

  async function salvarPost(id: string | null, valores: NovoPost, etiquetaIds: string[]) {
    const postAnterior = id ? posts.find((p) => p.id === id) ?? null : null;

    if (postAnterior) {
      const etiquetasIguais =
        [...postAnterior.etiqueta_ids].sort().join() === [...etiquetaIds].sort().join();
      const camposIguais = mesmosValores(paraNovoPost(postAnterior), valores);
      if (camposIguais && etiquetasIguais) {
        setModalAberto(false);
        return;
      }
    }

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

    await sincronizarEtiquetasPost(postSalvo.id, etiquetaIds);
    setPosts((atual) =>
      id ? atual.map((p) => (p.id === id ? postSalvo! : p)) : [...atual, postSalvo!]
    );
    setModalAberto(false);

    if (postAnterior) {
      registrarAcao(async () => {
        await aplicarCamposPost(postAnterior.id, paraNovoPost(postAnterior));
        await aplicarEtiquetasPost(postAnterior.id, postAnterior.etiqueta_ids);
      });
    } else {
      const idCriado = postSalvo.id;
      registrarAcao(() => aplicarExclusaoPost(idCriado));
    }
  }

  async function excluirPost(id: string) {
    const postAnterior = posts.find((p) => p.id === id) ?? null;
    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (!error) {
      setPosts((atual) => atual.filter((p) => p.id !== id));
      if (postAnterior) {
        registrarAcao(() => aplicarRestauracaoPost(postAnterior));
      }
    }
    setModalAberto(false);
  }

  async function duplicarPost(post: Post) {
    const { data, error } = await supabase
      .from("posts")
      .insert(paraNovoPost(post))
      .select()
      .single();
    if (error || !data) return;
    const postDuplicado = {
      ...(data as Omit<Post, "etiqueta_ids">),
      etiqueta_ids: post.etiqueta_ids,
    };
    await sincronizarEtiquetasPost(postDuplicado.id, post.etiqueta_ids);
    setPosts((atual) => [...atual, postDuplicado]);
    registrarAcao(() => aplicarExclusaoPost(postDuplicado.id));
    setPostSelecionado(postDuplicado);
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

  async function alternarStatusPublicado(post: Post) {
    const statusAnterior = post.status;
    const novoStatus: Post["status"] = post.status === "publicado" ? "pendente" : "publicado";
    await aplicarCamposPost(post.id, { status: novoStatus });
    registrarAcao(() => aplicarCamposPost(post.id, { status: statusAnterior }));
  }

  function ordenarGrupoPosts(lista: Post[]) {
    return [...lista].sort((a, b) => a.ordem - b.ordem);
  }

  function aoFinalizarArraste(evento: DragEndEvent) {
    const { active, over } = evento;
    if (!over) return;
    const postId = String(active.id);
    const overId = String(over.id);
    if (postId === overId) return;

    const post = posts.find((p) => p.id === postId);
    if (!post) return;

    // soltar em cima de outro post: vai pro dia desse post, na posição dele.
    // soltar no quadrado vazio de um dia: vai pro fim daquele dia.
    const postAlvo = posts.find((p) => p.id === overId);
    const novaData = postAlvo ? postAlvo.data : overId;

    const outrosDoDestino = ordenarGrupoPosts(
      posts.filter((p) => p.id !== postId && p.data === novaData)
    );
    const indice = postAlvo
      ? Math.max(0, outrosDoDestino.findIndex((p) => p.id === postAlvo.id))
      : outrosDoDestino.length;
    const novaOrdemDoDestino = [
      ...outrosDoDestino.slice(0, indice),
      post,
      ...outrosDoDestino.slice(indice),
    ];

    const grupoAtual = ordenarGrupoPosts(posts.filter((p) => p.data === post.data));
    const semMudanca =
      post.data === novaData &&
      grupoAtual.map((p) => p.id).join() === novaOrdemDoDestino.map((p) => p.id).join();
    if (semMudanca) return;

    const antes = novaOrdemDoDestino.map((p) => ({ id: p.id, data: p.data, ordem: p.ordem }));
    const depois = novaOrdemDoDestino.map((p, i) => ({ id: p.id, data: novaData, ordem: i }));

    aplicarPosicoesPost(depois);
    registrarAcao(() => aplicarPosicoesPost(antes));
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
          {!isSameMonth(mesAtual, new Date()) && (
            <button
              onClick={() => setMesAtual(new Date())}
              className="rounded-md border border-zinc-700 px-2.5 py-1.5 text-sm text-zinc-400 hover:bg-zinc-900"
            >
              Hoje
            </button>
          )}
          <span className="text-sm text-zinc-500">
            {resumoMes.publicados} de {resumoMes.total} publicados
          </span>
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
            onToggleStatus={alternarStatusPublicado}
          />
        </DndContext>
      )}

      {modalAberto && (
        <PostModal
          key={postSelecionado?.id ?? "novo"}
          post={postSelecionado}
          dataPadrao={dataParaNovoPost}
          etiquetas={etiquetas}
          onFechar={() => setModalAberto(false)}
          onSalvar={salvarPost}
          onExcluir={excluirPost}
          onDuplicar={duplicarPost}
          onCriarEtiqueta={criarEtiqueta}
          onEditarEtiqueta={editarEtiqueta}
          onExcluirEtiqueta={excluirEtiqueta}
        />
      )}
    </div>
  );
}
