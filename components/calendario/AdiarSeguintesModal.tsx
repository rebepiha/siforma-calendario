"use client";

import { useEffect } from "react";
import { format, parseISO } from "date-fns";
import { MovimentoFeed } from "@/lib/adiarFeed";
import { Post } from "@/lib/types";

function dataCurta(data: string) {
  return format(parseISO(data), "dd/MM/yyyy");
}

export default function AdiarSeguintesModal({
  post,
  dataAnterior,
  novaData,
  movimentos,
  podeCancelar,
  onFechar,
  onEscolher,
}: {
  post: Post;
  dataAnterior: string;
  novaData: string;
  movimentos: MovimentoFeed[];
  podeCancelar: boolean;
  onFechar: () => void;
  onEscolher: (comSeguintes: boolean) => void;
}) {
  useEffect(() => {
    function aoTeclar(e: KeyboardEvent) {
      if (e.key === "Escape") onFechar();
    }
    window.addEventListener("keydown", aoTeclar);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", aoTeclar);
      document.body.style.overflow = "";
    };
  }, [onFechar]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="absolute inset-0" onClick={onFechar} />
      <div
        role="dialog"
        aria-modal="true"
        className="relative flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-xl bg-zinc-800 shadow-2xl"
      >
        <div className="border-b border-zinc-700 px-5 py-4">
          <h2 className="text-base font-semibold text-zinc-100">Mover os posts seguintes?</h2>
          <p className="mt-1 text-sm text-zinc-400">
            “{post.titulo}” vai de {dataCurta(dataAnterior)} para {dataCurta(novaData)}. Os posts
            de feed abaixo podem ir para o próximo bloco.
          </p>
        </div>

        <ul className="min-h-0 flex-1 divide-y divide-zinc-700 overflow-y-auto px-5">
          {movimentos.map((m, i) => (
            <li key={m.post.id} className="flex items-baseline justify-between gap-3 py-2 text-sm">
              <span className="truncate text-zinc-200">{m.post.titulo}</span>
              <span className="shrink-0 text-xs text-zinc-400">
                {dataCurta(m.post.data)} → {dataCurta(m.data)}
                {i === movimentos.length - 1 && " (data nova)"}
              </span>
            </li>
          ))}
        </ul>

        <div className="border-t border-zinc-700 px-5 py-4">
          <p className="mb-3 text-xs text-zinc-500">
            Retrospectiva e Lançamentos ficam nas datas atuais.
          </p>
          <div className="flex flex-wrap justify-end gap-2">
            {podeCancelar && (
              <button
                onClick={onFechar}
                className="rounded-md px-3 py-2 text-sm text-zinc-400 hover:bg-zinc-900"
              >
                Cancelar
              </button>
            )}
            <button
              onClick={() => onEscolher(false)}
              className="rounded-md border border-zinc-700 px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-900"
            >
              Só este post
            </button>
            <button
              onClick={() => onEscolher(true)}
              className="rounded-md bg-oliva px-3 py-2 text-sm font-medium text-white hover:bg-oliva-forte"
            >
              Mover os {movimentos.length} seguintes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
