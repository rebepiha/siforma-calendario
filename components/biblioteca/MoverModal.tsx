"use client";

import { useEffect, useMemo, useState } from "react";
import { format, parseISO } from "date-fns";
import { Post } from "@/lib/types";

export interface GrupoBiblioteca {
  chave: string;
  nome: string;
  posts: Post[];
}

// Destino de um "mover": ou um grupo que já existe na Biblioteca, ou um nome
// novo digitado pela pessoa (vira um produto novo ao confirmar).
export type DestinoMover = { tipo: "grupo"; grupo: GrupoBiblioteca } | { tipo: "novo"; nome: string };

export default function MoverModal({
  origem,
  grupos,
  onFechar,
  onMover,
}: {
  origem: GrupoBiblioteca;
  grupos: GrupoBiblioteca[];
  onFechar: () => void;
  onMover: (posts: Post[], destino: DestinoMover) => Promise<void>;
}) {
  const [selecionados, setSelecionados] = useState<Set<string>>(
    () => new Set(origem.posts.map((p) => p.id))
  );
  const [busca, setBusca] = useState("");
  const [movendo, setMovendo] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const opcoes = useMemo(() => {
    const b = busca.trim().toLowerCase();
    return grupos
      .filter((g) => g.chave !== origem.chave)
      .filter((g) => !b || g.nome.toLowerCase().includes(b))
      .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
  }, [grupos, origem.chave, busca]);

  const nomeNovo = busca.trim();
  const podeCriarNovo =
    nomeNovo !== "" && !grupos.some((g) => g.nome.toLowerCase() === nomeNovo.toLowerCase());

  function alternar(id: string) {
    setSelecionados((atual) => {
      const novo = new Set(atual);
      if (novo.has(id)) novo.delete(id);
      else novo.add(id);
      return novo;
    });
  }

  async function mover(destino: DestinoMover) {
    const posts = origem.posts.filter((p) => selecionados.has(p.id));
    if (posts.length === 0 || movendo) return;
    setMovendo(true);
    try {
      await onMover(posts, destino);
    } finally {
      setMovendo(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="absolute inset-0" onClick={onFechar} />
      <div className="relative flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-xl bg-zinc-800 shadow-2xl">
        <div className="flex items-center justify-between border-b border-zinc-700 px-5 py-4">
          <h2 className="text-base font-semibold text-zinc-100">Mover “{origem.nome}”</h2>
          <button
            onClick={onFechar}
            className="rounded p-1 text-zinc-600 hover:bg-zinc-900 hover:text-zinc-300"
          >
            ✕
          </button>
        </div>

        <div className="flex min-h-0 flex-col gap-4 px-5 py-4">
          {origem.posts.length > 1 && (
            <div>
              <p className="mb-1 text-xs font-medium text-zinc-400">Posts a mover</p>
              <div className="flex flex-col gap-1">
                {origem.posts.map((post) => (
                  <label key={post.id} className="flex items-center gap-2 text-sm text-zinc-300">
                    <input
                      type="checkbox"
                      checked={selecionados.has(post.id)}
                      onChange={() => alternar(post.id)}
                      className="h-4 w-4 rounded border-zinc-700"
                    />
                    {format(parseISO(post.data), "dd/MM/yyyy")}
                    <span className="truncate text-zinc-500">· {post.titulo}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="flex min-h-0 flex-col">
            <label className="mb-1 block text-xs font-medium text-zinc-400">Mover para</label>
            <input
              autoFocus
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar produto ou digitar um nome novo"
              className="mb-2 w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100"
            />
            <div className="flex max-h-72 flex-col overflow-y-auto rounded-md border border-zinc-700">
              {podeCriarNovo && (
                <button
                  disabled={movendo || selecionados.size === 0}
                  onClick={() => mover({ tipo: "novo", nome: nomeNovo })}
                  className="px-3 py-2 text-left text-sm text-oliva-claro hover:bg-zinc-900 disabled:opacity-50"
                >
                  + Criar produto “{nomeNovo}”
                </button>
              )}
              {opcoes.map((g) => (
                <button
                  key={g.chave}
                  disabled={movendo || selecionados.size === 0}
                  onClick={() => mover({ tipo: "grupo", grupo: g })}
                  className="flex items-center justify-between gap-3 px-3 py-2 text-left text-sm text-zinc-200 hover:bg-zinc-900 disabled:opacity-50"
                >
                  <span>{g.nome}</span>
                  <span className="shrink-0 text-xs text-zinc-500">{g.posts.length}</span>
                </button>
              ))}
              {opcoes.length === 0 && !podeCriarNovo && (
                <p className="px-3 py-2 text-sm text-zinc-500">Nenhum produto encontrado.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
