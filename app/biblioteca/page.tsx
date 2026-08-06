"use client";

import { useEffect, useMemo, useState } from "react";
import { format, parseISO } from "date-fns";
import { supabase } from "@/lib/supabase";
import { Post } from "@/lib/types";
import { LABEL_TIPO } from "@/lib/postStyles";

function nomeBase(titulo: string): string {
  return titulo.replace(/^(stories|feed)\s*[-:]?\s*/i, "").trim();
}

interface Grupo { nome: string; posts: Post[] }

export default function PaginaBiblioteca() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState("");
  const [maisRecentesPrimeiro, setMaisRecentesPrimeiro] = useState(true);

  useEffect(() => {
    async function carregar() {
      setCarregando(true);

      const { data: etiquetaFeed } = await supabase
        .from("etiquetas")
        .select("id")
        .eq("nome", "Feed")
        .single();

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
        (data as Post[] ?? []).filter((p) => nomeBase(p.titulo) !== "")
      );
      setCarregando(false);
    }
    carregar();
  }, []);

  const postsFiltrados = useMemo(() => {
    const b = busca.trim().toLowerCase();
    if (!b) return posts;
    return posts.filter((p) => p.titulo.toLowerCase().includes(b));
  }, [posts, busca]);

  const { produtos } = useMemo(() => {
    const ord = (a: Post, b: Post) =>
      maisRecentesPrimeiro
        ? b.data.localeCompare(a.data)
        : a.data.localeCompare(b.data);

    const mapa = new Map<string, Grupo>();

    for (const post of postsFiltrados) {
      if (post.tipo !== "produto" && post.tipo !== "lancamento") continue;
      const nome = nomeBase(post.titulo);
      // "Lançamentos de <mês> (...)" é um resumo mensal recorrente (ex: "Feed:
      // Lançamentos de julho"), não um produto único — não deve virar uma
      // entrada na Biblioteca mesmo sendo tipo "lancamento".
      if (/^lançamentos? de\b/i.test(nome)) continue;
      const chave = nome.toLowerCase();
      const g = mapa.get(chave);
      if (g) g.posts.push(post);
      else mapa.set(chave, { nome, posts: [post] });
    }

    const produtos = Array.from(mapa.values());
    produtos.forEach((g) => g.posts.sort(ord));
    produtos.sort((a, b) => ord(a.posts[0], b.posts[0]));

    return { produtos };
  }, [postsFiltrados, maisRecentesPrimeiro]);

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

      {carregando ? (
        <p className="py-12 text-center text-sm text-zinc-600">Carregando...</p>
      ) : produtos.length === 0 ? (
        <p className="py-12 text-center text-sm text-zinc-600">Nenhum conteúdo encontrado.</p>
      ) : (
        <section>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Produtos · {produtos.length}
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {produtos.map((grupo) => {
              const temNovo = grupo.posts.some((p) => p.novo_produto);
              const temVideo = grupo.posts.some((p) => p.video_pronto);
              const tipo = grupo.posts[0].tipo;
              const categoria = grupo.posts.find((p) => p.categoria)?.categoria;
              return (
                <div
                  key={grupo.nome}
                  className="relative flex flex-col gap-3 rounded-lg border border-zinc-700 bg-zinc-800/60 p-4 transition hover:border-zinc-600"
                >
                  {temNovo && (
                    <span className="absolute -right-2 -top-2 rounded-full border border-zinc-600 bg-zinc-900 px-1.5 py-0.5 text-[9px] font-medium text-zinc-400">
                      NOVO
                    </span>
                  )}

                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold leading-snug text-zinc-100">
                      {grupo.nome}
                    </p>
                    <span
                      className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium ${
                        tipo === "lancamento"
                          ? "border-amber-500/30 bg-amber-500/10 text-amber-400"
                          : "border-oliva/30 bg-oliva/10 text-oliva"
                      }`}
                    >
                      {LABEL_TIPO[tipo]}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                    <span>
                      {grupo.posts.length} {grupo.posts.length === 1 ? "post" : "posts"}
                    </span>
                    {categoria && <span>· {categoria}</span>}
                    {temVideo && (
                      <span className="rounded bg-badge-video px-1.5 py-0.5 text-[9px] font-semibold text-white">
                        ✓ vídeo pronto
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {grupo.posts.map((post) => (
                      <span
                        key={post.id}
                        className="rounded-md bg-zinc-900 px-2 py-1 text-[11px] text-zinc-400"
                      >
                        {format(parseISO(post.data), "dd/MM/yyyy")}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
