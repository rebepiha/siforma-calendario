"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  addMonths,
  addWeeks,
  endOfMonth,
  endOfWeek,
  format,
  startOfMonth,
  startOfWeek,
  subMonths,
  subWeeks,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { supabase } from "@/lib/supabase";
import { Campanha, Canal, Etiqueta, NovaCampanha, NovoPost, Post, StatusPost } from "@/lib/types";
import CalendarGrid from "@/components/calendario/CalendarGrid";
import PostWeekGrid from "@/components/calendario/PostWeekGrid";
import PostListView from "@/components/calendario/PostListView";
import PostModal from "@/components/calendario/PostModal";
import SidebarFiltros, { Visao } from "@/components/calendario/SidebarFiltros";
import EstatisticasCards from "@/components/calendario/EstatisticasCards";
import CampanhaBanner from "@/components/calendario/CampanhaBanner";
import PostDetailPanel from "@/components/calendario/PostDetailPanel";

const TODOS_CANAIS: Canal[] = ["instagram", "linkedin", "youtube"];
const TODOS_STATUS: StatusPost[] = ["pendente", "em_producao", "agendado", "publicado"];

export default function PaginaCalendario() {
  const [visao, setVisao] = useState<Visao>("mensal");
  const [mesAtual, setMesAtual] = useState(() => new Date());
  const [semanaAtual, setSemanaAtual] = useState(() => new Date());
  const [posts, setPosts] = useState<Post[]>([]);
  const [etiquetas, setEtiquetas] = useState<Etiqueta[]>([]);
  const [campanhas, setCampanhas] = useState<Campanha[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const [canaisFiltro, setCanaisFiltro] = useState<Canal[]>(TODOS_CANAIS);
  const [statusFiltro, setStatusFiltro] = useState<StatusPost[]>(TODOS_STATUS);
  const [etiquetaIdsFiltro, setEtiquetaIdsFiltro] = useState<string[] | null>(null);
  const etiquetasConhecidasRef = useRef<Set<string>>(new Set());

  const [modalAberto, setModalAberto] = useState(false);
  const [postParaEditar, setPostParaEditar] = useState<Post | null>(null);
  const [postSelecionadoId, setPostSelecionadoId] = useState<string | null>(null);
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

  async function carregarCampanhas() {
    const { data, error } = await supabase
      .from("campanhas")
      .select("*")
      .order("data_inicio", { ascending: true });
    if (!error && data) {
      setCampanhas(data as Campanha[]);
    }
  }

  useEffect(() => {
    carregarPosts();
    carregarEtiquetas();
    carregarCampanhas();
  }, []);

  useEffect(() => {
    const idsAtuais = etiquetas.map((e) => e.id);
    const conhecidas = etiquetasConhecidasRef.current;
    const novas = idsAtuais.filter((id) => !conhecidas.has(id));
    idsAtuais.forEach((id) => conhecidas.add(id));

    if (etiquetaIdsFiltro === null) {
      setEtiquetaIdsFiltro(idsAtuais);
      return;
    }
    const existentes = new Set(idsAtuais);
    const semExcluidas = etiquetaIdsFiltro.filter((id) => existentes.has(id));
    if (novas.length > 0 || semExcluidas.length !== etiquetaIdsFiltro.length) {
      setEtiquetaIdsFiltro([...semExcluidas, ...novas]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [etiquetas]);

  const periodoInicio =
    visao === "semanal" ? startOfWeek(semanaAtual, { weekStartsOn: 1 }) : startOfMonth(mesAtual);
  const periodoFim =
    visao === "semanal" ? endOfWeek(semanaAtual, { weekStartsOn: 1 }) : endOfMonth(mesAtual);

  const postsDoPeriodo = useMemo(() => {
    const inicioStr = format(periodoInicio, "yyyy-MM-dd");
    const fimStr = format(periodoFim, "yyyy-MM-dd");
    return posts.filter((p) => p.data >= inicioStr && p.data <= fimStr);
  }, [posts, periodoInicio, periodoFim]);

  const postsFiltrados = useMemo(() => {
    const idsFiltro = etiquetaIdsFiltro ?? [];
    return postsDoPeriodo.filter((post) => {
      if (!canaisFiltro.includes(post.canal)) return false;
      if (!statusFiltro.includes(post.status)) return false;
      if (post.etiqueta_ids.length > 0 && !post.etiqueta_ids.some((id) => idsFiltro.includes(id)))
        return false;
      return true;
    });
  }, [postsDoPeriodo, canaisFiltro, statusFiltro, etiquetaIdsFiltro]);

  const postSelecionado = postSelecionadoId
    ? posts.find((p) => p.id === postSelecionadoId) ?? null
    : null;

  function abrirNovoPost(data: string) {
    setPostParaEditar(null);
    setDataParaNovoPost(data);
    setModalAberto(true);
  }

  function abrirEdicaoPost(post: Post) {
    setPostSelecionadoId(post.id);
  }

  function abrirModalEdicao(post: Post) {
    setPostParaEditar(post);
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
      setPostSelecionadoId((atual) => (atual === id ? null : atual));
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

  async function criarCampanha(valores: NovaCampanha) {
    const { data, error } = await supabase
      .from("campanhas")
      .insert(valores)
      .select()
      .single();
    if (!error && data) {
      setCampanhas((atual) => [...atual, data as Campanha]);
    }
  }

  async function editarCampanha(id: string, valores: NovaCampanha) {
    const { data, error } = await supabase
      .from("campanhas")
      .update(valores)
      .eq("id", id)
      .select()
      .single();
    if (!error && data) {
      setCampanhas((atual) => atual.map((c) => (c.id === id ? (data as Campanha) : c)));
    }
  }

  async function excluirCampanha(id: string) {
    const { error } = await supabase.from("campanhas").delete().eq("id", id);
    if (!error) {
      setCampanhas((atual) => atual.filter((c) => c.id !== id));
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

  async function alternarChecklistItem(postId: string, indice: number) {
    const post = posts.find((p) => p.id === postId);
    if (!post) return;
    const novoChecklist = post.checklist.map((item, i) =>
      i === indice ? { ...item, feito: !item.feito } : item
    );
    setPosts((atual) => atual.map((p) => (p.id === postId ? { ...p, checklist: novoChecklist } : p)));
    await supabase.from("posts").update({ checklist: novoChecklist }).eq("id", postId);
  }

  async function atualizarResponsavel(postId: string, valor: string) {
    const responsavel = valor.trim() ? valor.trim() : null;
    setPosts((atual) => atual.map((p) => (p.id === postId ? { ...p, responsavel } : p)));
    await supabase.from("posts").update({ responsavel }).eq("id", postId);
  }

  async function atualizarStatus(postId: string, status: StatusPost) {
    setPosts((atual) => atual.map((p) => (p.id === postId ? { ...p, status } : p)));
    await supabase.from("posts").update({ status }).eq("id", postId);
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
    <div className="flex gap-4">
      <SidebarFiltros
        visao={visao}
        onVisaoChange={setVisao}
        canais={canaisFiltro}
        onCanaisChange={setCanaisFiltro}
        status={statusFiltro}
        onStatusChange={setStatusFiltro}
        etiquetas={etiquetas}
        etiquetaIds={etiquetaIdsFiltro ?? []}
        onEtiquetaIdsChange={setEtiquetaIdsFiltro}
        onCriarEtiqueta={criarEtiqueta}
        onEditarEtiqueta={editarEtiqueta}
        onExcluirEtiqueta={excluirEtiqueta}
      />

      <div className="flex flex-1 flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {visao === "semanal" ? (
              <>
                <button
                  onClick={() => setSemanaAtual((s) => subWeeks(s, 1))}
                  className="rounded-md border border-zinc-700 px-2.5 py-1.5 text-sm text-zinc-400 hover:bg-zinc-900"
                  aria-label="Semana anterior"
                >
                  ←
                </button>
                <h1 className="min-w-[200px] text-lg font-semibold text-zinc-100">
                  {format(periodoInicio, "d MMM", { locale: ptBR })} –{" "}
                  {format(periodoFim, "d MMM yyyy", { locale: ptBR })}
                </h1>
                <button
                  onClick={() => setSemanaAtual((s) => addWeeks(s, 1))}
                  className="rounded-md border border-zinc-700 px-2.5 py-1.5 text-sm text-zinc-400 hover:bg-zinc-900"
                  aria-label="Próxima semana"
                >
                  →
                </button>
                <button
                  onClick={() => setSemanaAtual(new Date())}
                  className="rounded-md border border-zinc-700 px-3 py-1.5 text-sm text-zinc-400 hover:bg-zinc-900"
                >
                  Hoje
                </button>
              </>
            ) : (
              <>
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
                <button
                  onClick={() => setMesAtual(new Date())}
                  className="rounded-md border border-zinc-700 px-3 py-1.5 text-sm text-zinc-400 hover:bg-zinc-900"
                >
                  Hoje
                </button>
              </>
            )}
          </div>

          <button
            onClick={() => abrirNovoPost(format(new Date(), "yyyy-MM-dd"))}
            className="rounded-md bg-oliva px-3 py-2 text-sm font-medium text-white hover:bg-oliva-forte"
          >
            + Adicionar post
          </button>
        </div>

        <EstatisticasCards posts={postsFiltrados} etiquetas={etiquetas} />
        <CampanhaBanner
          campanhas={campanhas}
          periodoInicio={periodoInicio}
          periodoFim={periodoFim}
          onCriar={criarCampanha}
          onEditar={editarCampanha}
          onExcluir={excluirCampanha}
        />

        {erro && (
          <p className="rounded-md bg-red-500/10 px-3 py-2 text-sm text-red-400">
            Erro ao carregar posts: {erro}
          </p>
        )}

        {carregando ? (
          <p className="py-12 text-center text-sm text-zinc-600">Carregando...</p>
        ) : visao === "semanal" ? (
          <DndContext sensors={sensors} onDragEnd={aoFinalizarArraste}>
            <PostWeekGrid
              semanaAtual={semanaAtual}
              posts={postsFiltrados}
              etiquetas={etiquetas}
              onClickPost={abrirEdicaoPost}
              onNovoPost={abrirNovoPost}
              onChangeStatus={atualizarStatus}
            />
          </DndContext>
        ) : visao === "lista" ? (
          <PostListView posts={postsFiltrados} etiquetas={etiquetas} onClickPost={abrirEdicaoPost} />
        ) : (
          <DndContext sensors={sensors} onDragEnd={aoFinalizarArraste}>
            <CalendarGrid
              mesAtual={mesAtual}
              posts={postsFiltrados}
              etiquetas={etiquetas}
              onClickPost={abrirEdicaoPost}
              onNovoPost={abrirNovoPost}
              onChangeStatus={atualizarStatus}
            />
          </DndContext>
        )}
      </div>

      <PostDetailPanel
        post={postSelecionado}
        etiquetas={etiquetas}
        onEditar={abrirModalEdicao}
        onExcluir={excluirPost}
        onToggleChecklistItem={alternarChecklistItem}
        onChangeResponsavel={atualizarResponsavel}
        onChangeStatus={atualizarStatus}
      />

      {modalAberto && (
        <PostModal
          post={postParaEditar}
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
