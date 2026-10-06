"use client";

import { useEffect, useMemo, useState } from "react";
import { format, parseISO } from "date-fns";
import { supabase } from "@/lib/supabase";
import { Post, Produto } from "@/lib/types";
import { grupoBiblioteca, nomeCanonicoProduto } from "@/lib/nomesProdutos";
import { useUndoStack } from "@/lib/useUndoStack";
import MoverModal, { DestinoMover, GrupoBiblioteca as Grupo } from "@/components/biblioteca/MoverModal";

export default function PaginaBiblioteca() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState("");
  const [maisRecentesPrimeiro, setMaisRecentesPrimeiro] = useState(true);
  const [grupoMovendo, setGrupoMovendo] = useState<Grupo | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const { registrarAcao } = useUndoStack(grupoMovendo === null);

  useEffect(() => {
    async function carregar() {
      setCarregando(true);

      const [{ data: etiquetaFeed }, { data: produtosData }] = await Promise.all([
        supabase.from("etiquetas").select("id").eq("nome", "Feed").single(),
        supabase.from("produtos").select("*"),
      ]);
      setProdutos((produtosData as Produto[]) ?? []);

      if (!etiquetaFeed) {
        setCarregando(false);
        return;
      }

      const { data: relacoes } = await supabase
        .from("post_etiquetas")
        .select("post_id")
        .eq("etiqueta_id", etiquetaFeed.id);

      const ids = (relacoes ?? []).map((r: { post_id: string }) => r.post_id);
      if (ids.length === 0) {
        setPosts([]);
        setCarregando(false);
        return;
      }

      const { data } = await supabase
        .from("posts")
        .select("*")
        .eq("status", "publicado")
        .in("id", ids)
        .order("data", { ascending: false });

      setPosts(
        (data as Post[] ?? []).filter((p) => nomeCanonicoProduto(p.titulo) !== "")
      );
      setCarregando(false);
    }
    carregar();
  }, []);

  const { grupos } = useMemo(() => {
    const ord = (a: Post, b: Post) =>
      maisRecentesPrimeiro
        ? b.data.localeCompare(a.data)
        : a.data.localeCompare(b.data);

    const mapa = new Map<string, Grupo>();

    for (const post of posts) {
      const grupo = grupoBiblioteca(post, produtos);
      if (!grupo) continue;
      const g = mapa.get(grupo.chave);
      if (g) g.posts.push(post);
      else mapa.set(grupo.chave, { ...grupo, posts: [post] });
    }

    const grupos = Array.from(mapa.values());
    grupos.forEach((g) => g.posts.sort(ord));
    // Ordena os produtos pela data do post mais recente de cada um (a última
    // vez que o produto foi postado), nos dois sentidos — em "Mais antigos",
    // um produto antigo que voltou a ser postado não fica no topo.
    const ultimaData = (g: Grupo) =>
      g.posts.reduce((max, p) => (p.data > max ? p.data : max), "");
    grupos.sort((a, b) =>
      maisRecentesPrimeiro
        ? ultimaData(b).localeCompare(ultimaData(a))
        : ultimaData(a).localeCompare(ultimaData(b))
    );

    return { grupos };
  }, [posts, maisRecentesPrimeiro, produtos]);

  // Busca filtra os grupos exibidos (pelo nome do grupo ou título de algum
  // post), mas o agrupamento em si é sempre sobre todos os posts — o modal de
  // mover precisa enxergar todos os grupos como destino possível.
  const gruposVisiveis = useMemo(() => {
    const b = busca.trim().toLowerCase();
    if (!b) return grupos;
    return grupos.filter(
      (g) =>
        g.nome.toLowerCase().includes(b) ||
        g.posts.some((p) => p.titulo.toLowerCase().includes(b))
    );
  }, [grupos, busca]);

  async function atualizarProdutoId(ids: string[], produtoId: string | null) {
    const { error } = await supabase.from("posts").update({ produto_id: produtoId }).in("id", ids);
    if (error) throw error;
    setPosts((atual) =>
      atual.map((p) => (ids.includes(p.id) ? { ...p, produto_id: produtoId } : p))
    );
  }

  // Mover = vincular os posts escolhidos ao produto de destino (produto_id).
  // Se o destino ainda é um grupo "só por texto" (posts sem produto_id), cria
  // (ou reaproveita, se já existir com o mesmo nome) o produto e vincula
  // também os posts do destino — senão os posts movidos formariam um grupo
  // separado com o mesmo nome do grupo de texto.
  async function mover(postsAMover: Post[], destino: DestinoMover) {
    setErro(null);
    try {
      let produtoId: string;
      // Vincula também os posts do destino que ainda não têm produto_id (só
      // agrupados pelo nome), pra o grupo não depender mais do texto.
      const postsDestinoSemProduto =
        destino.tipo === "grupo" ? destino.grupo.posts.filter((p) => !p.produto_id) : [];

      if (destino.tipo === "grupo" && destino.grupo.chave.startsWith("id:")) {
        produtoId = destino.grupo.chave.slice(3);
      } else {
        const nome = destino.tipo === "novo" ? destino.nome : destino.grupo.nome;
        const existente = produtos.find((p) => p.nome.toLowerCase() === nome.toLowerCase());
        if (existente) {
          produtoId = existente.id;
        } else {
          const { data, error } = await supabase
            .from("produtos")
            .insert({ nome })
            .select()
            .single();
          if (error || !data) throw error;
          setProdutos((atual) => [...atual, data as Produto]);
          produtoId = (data as Produto).id;
        }
      }

      const afetados = [...postsAMover, ...postsDestinoSemProduto];
      const anteriores = new Map<string | null, string[]>();
      for (const p of afetados) {
        anteriores.set(p.produto_id, [...(anteriores.get(p.produto_id) ?? []), p.id]);
      }

      await atualizarProdutoId(afetados.map((p) => p.id), produtoId);
      setGrupoMovendo(null);

      registrarAcao(async () => {
        for (const [anterior, ids] of anteriores) {
          await atualizarProdutoId(ids, anterior);
        }
      });
    } catch {
      setErro("Não foi possível mover. Tente de novo.");
    }
  }

  return (
    <div className="flex flex-col gap-6 px-4 py-6 sm:px-6">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-lg font-semibold text-zinc-100">Biblioteca</h1>
        <div className="ml-auto flex items-center gap-2">
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar..."
            className="rounded-md border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm text-zinc-300 placeholder:text-zinc-500 focus:border-zinc-500 focus:outline-none"
          />
          <select
            value={maisRecentesPrimeiro ? "recentes" : "antigos"}
            onChange={(e) => setMaisRecentesPrimeiro(e.target.value === "recentes")}
            className="rounded-md border border-zinc-700 bg-zinc-800 px-2 py-1.5 text-sm text-zinc-300"
          >
            <option value="recentes">Mais recentes</option>
            <option value="antigos">Mais antigos</option>
          </select>
        </div>
      </div>

      {erro && <p className="text-sm text-red-400">{erro}</p>}

      {carregando ? (
        <p className="py-12 text-center text-sm text-zinc-600">Carregando...</p>
      ) : gruposVisiveis.length === 0 ? (
        <p className="py-12 text-center text-sm text-zinc-600">Nenhum conteúdo encontrado.</p>
      ) : (
        <section>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Produtos · {gruposVisiveis.length}
          </h2>
          <div className="flex flex-col divide-y divide-zinc-800/80">
            {gruposVisiveis.map((grupo) => (
              <div
                key={grupo.chave}
                onContextMenu={(e) => {
                  e.preventDefault();
                  setGrupoMovendo(grupo);
                }}
                className="group flex items-start justify-between gap-6 py-3"
              >
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-zinc-100">{grupo.nome}</p>
                  <button
                    onClick={() => setGrupoMovendo(grupo)}
                    className="rounded px-1.5 py-0.5 text-xs text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200 sm:opacity-0 sm:group-hover:opacity-100 sm:focus:opacity-100"
                  >
                    Mover
                  </button>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  {grupo.posts.map((post) => (
                    <span key={post.id} className="text-xs text-zinc-500">
                      {format(parseISO(post.data), "dd/MM/yyyy")}
                      {post.categoria ? ` · ${post.categoria}` : ""}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {grupoMovendo && (
        <MoverModal
          origem={grupoMovendo}
          grupos={grupos}
          onFechar={() => setGrupoMovendo(null)}
          onMover={mover}
        />
      )}
    </div>
  );
}
