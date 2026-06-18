"use client";

import { useEffect, useMemo, useState } from "react";
import { format, parseISO } from "date-fns";
import { supabase } from "@/lib/supabase";
import { Post } from "@/lib/types";

function nomeBaseProduto(titulo: string): string {
  return titulo.replace(/^(stories|feed)\s*[-:]?\s*/i, "").trim();
}

interface GrupoProduto {
  nome: string;
  posts: Post[];
}

export default function PaginaBiblioteca() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState("");
  const [maisRecentesPrimeiro, setMaisRecentesPrimeiro] = useState(true);

  useEffect(() => {
    async function carregar() {
      setCarregando(true);
      const { data } = await supabase
        .from("posts")
        .select("*")
        .eq("status", "publicado")
        .eq("canal", "instagram")
        .order("data", { ascending: false });
      setPosts((data as Post[]) ?? []);
      setCarregando(false);
    }
    carregar();
  }, []);

  const postsFiltrados = useMemo(() => {
    const buscaNormalizada = busca.trim().toLowerCase();
    if (!buscaNormalizada) return posts;
    return posts.filter((p) => p.titulo.toLowerCase().includes(buscaNormalizada));
  }, [posts, busca]);

  const { produtos, outros } = useMemo(() => {
    const ordenarPorData = (a: Post, b: Post) =>
      maisRecentesPrimeiro ? b.data.localeCompare(a.data) : a.data.localeCompare(b.data);

    const postsDeProduto = postsFiltrados.filter(
      (p) => p.tipo === "produto" || p.tipo === "lancamento"
    );
    const outrosPosts = postsFiltrados.filter(
      (p) => p.tipo !== "produto" && p.tipo !== "lancamento"
    );

    const mapa = new Map<string, GrupoProduto>();
    for (const post of postsDeProduto) {
      const nome = nomeBaseProduto(post.titulo);
      const chave = nome.toLowerCase();
      const grupo = mapa.get(chave);
      if (grupo) {
        grupo.posts.push(post);
      } else {
        mapa.set(chave, { nome, posts: [post] });
      }
    }

    const produtos = Array.from(mapa.values());
    produtos.forEach((grupo) => grupo.posts.sort(ordenarPorData));
    produtos.sort((a, b) => ordenarPorData(a.posts[0], b.posts[0]));

    const outros = [...outrosPosts].sort(ordenarPorData);
    return { produtos, outros };
  }, [postsFiltrados, maisRecentesPrimeiro]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-lg font-semibold text-zinc-100">Biblioteca</h1>
        <input
          type="text"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar produto ou conteúdo..."
          className="rounded-md border border-zinc-700 bg-zinc-800 px-2 py-1.5 text-sm text-zinc-300 placeholder:text-zinc-500"
        />
      </div>

      {carregando ? (
        <p className="py-12 text-center text-sm text-zinc-600">Carregando...</p>
      ) : (
        <>
          <section className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-sm font-semibold text-zinc-400">
                Produtos já postados ({produtos.length})
              </h2>
              <select
                value={maisRecentesPrimeiro ? "recentes" : "antigos"}
                onChange={(e) => setMaisRecentesPrimeiro(e.target.value === "recentes")}
                className="rounded-md border border-zinc-700 bg-zinc-800 px-2 py-1.5 text-sm text-zinc-300"
              >
                <option value="recentes">Postado há menos tempo</option>
                <option value="antigos">Postado há mais tempo</option>
              </select>
            </div>
            {produtos.length === 0 ? (
              <p className="text-sm text-zinc-600">Nenhum produto encontrado.</p>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {produtos.map((grupo) => (
                  <div
                    key={grupo.nome}
                    className="flex flex-col gap-2 rounded-md border border-zinc-700 bg-zinc-800 p-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-zinc-100">{grupo.nome}</p>
                      <span className="shrink-0 rounded bg-zinc-700 px-1.5 py-0.5 text-[10px] font-medium text-zinc-300">
                        {grupo.posts.length} post{grupo.posts.length > 1 ? "s" : ""}
                      </span>
                    </div>
                    <ul className="flex flex-col gap-1">
                      {grupo.posts.map((post) => (
                        <li key={post.id} className="text-xs text-zinc-400">
                          {format(parseISO(post.data), "dd/MM/yyyy")}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-sm font-semibold text-zinc-400">
              Outros conteúdos publicados ({outros.length})
            </h2>
            {outros.length === 0 ? (
              <p className="text-sm text-zinc-600">Nenhum conteúdo encontrado.</p>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {outros.map((post) => (
                  <div
                    key={post.id}
                    className="flex flex-col gap-1 rounded-md border border-zinc-700 bg-zinc-800 p-3"
                  >
                    <p className="text-sm font-semibold text-zinc-100">{post.titulo}</p>
                    <p className="text-xs text-zinc-400">
                      {format(parseISO(post.data), "dd/MM/yyyy")}
                      {post.categoria ? ` · ${post.categoria}` : ""}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
