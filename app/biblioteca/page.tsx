"use client";

import { useEffect, useMemo, useState } from "react";
import { format, parseISO } from "date-fns";
import { supabase } from "@/lib/supabase";
import { Post } from "@/lib/types";

function nomeBase(titulo: string): string {
  return titulo.replace(/^(stories|feed)\s*[-:]?\s*/i, "").trim();
}

interface Grupo {
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

  const { produtos, outros } = useMemo(() => {
    const ord = (a: Post, b: Post) =>
      maisRecentesPrimeiro
        ? b.data.localeCompare(a.data)
        : a.data.localeCompare(b.data);

    const mapa = new Map<string, Grupo>();
    const outrosList: Post[] = [];

    for (const post of postsFiltrados) {
      if (post.tipo === "produto" || post.tipo === "lancamento") {
        const nome = nomeBase(post.titulo);
        const chave = nome.toLowerCase();
        const g = mapa.get(chave);
        if (g) g.posts.push(post);
        else mapa.set(chave, { nome, posts: [post] });
      } else {
        outrosList.push(post);
      }
    }

    const produtos = Array.from(mapa.values());
    produtos.forEach((g) => g.posts.sort(ord));
    produtos.sort((a, b) => ord(a.posts[0], b.posts[0]));

    return { produtos, outros: [...outrosList].sort(ord) };
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
      ) : produtos.length === 0 && outros.length === 0 ? (
        <p className="py-12 text-center text-sm text-zinc-600">Nenhum conteúdo encontrado.</p>
      ) : (
        <div className="flex flex-col gap-8">
          {produtos.length > 0 && (
            <section>
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Produtos · {produtos.length}
              </h2>
              <div className="flex flex-col divide-y divide-zinc-800/80">
                {produtos.map((grupo) => (
                  <div key={grupo.nome} className="flex items-start justify-between gap-6 py-3">
                    <p className="text-sm font-medium text-zinc-100">{grupo.nome}</p>
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

          {outros.length > 0 && (
            <section>
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Outros · {outros.length}
              </h2>
              <div className="flex flex-col divide-y divide-zinc-800/80">
                {outros.map((post) => (
                  <div key={post.id} className="flex items-center justify-between gap-6 py-3">
                    <p className="text-sm text-zinc-100">{post.titulo}</p>
                    <span className="shrink-0 text-xs text-zinc-500">
                      {format(parseISO(post.data), "dd/MM/yyyy")}
                      {post.categoria ? ` · ${post.categoria}` : ""}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
