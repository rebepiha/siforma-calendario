"use client";

import { Etiqueta, Post } from "@/lib/types";

function Icone({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
      <path d={d} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const ICONES = {
  calendario: "M4 5h16v15H4V5zm0 5h16M8 3v4M16 3v4",
  reels: "M8 6l11 6-11 6V6z",
  carrossel: "M4 8h12v12H4V8zM8 4h12v12",
  lancamento: "M12 3l3 7h-6l3-7zM12 10v8M8 18h8",
  evento: "M5 21V4M5 4h13l-2.5 4L18 12H5",
};

export default function EstatisticasCards({
  posts,
  etiquetas,
}: {
  posts: Post[];
  etiquetas: Etiqueta[];
}) {
  const idReels = etiquetas.find((e) => e.nome.toLowerCase() === "reels")?.id;
  const idCarrossel = etiquetas.find((e) => e.nome.toLowerCase() === "carrossel")?.id;
  const totalReels = idReels ? posts.filter((p) => p.etiqueta_ids.includes(idReels)).length : 0;
  const totalCarrossel = idCarrossel
    ? posts.filter((p) => p.etiqueta_ids.includes(idCarrossel)).length
    : 0;
  const totalLancamentos = posts.filter((p) => p.tipo === "lancamento").length;
  const totalEventos = posts.filter((p) => p.tipo === "evento").length;

  const cards = [
    { label: "posts programados", valor: posts.length, cor: "#a78bfa", icone: ICONES.calendario },
    { label: "reels", valor: totalReels, cor: "#f472b6", icone: ICONES.reels },
    { label: "carrosséis", valor: totalCarrossel, cor: "#60a5fa", icone: ICONES.carrossel },
    { label: "lançamentos", valor: totalLancamentos, cor: "#4ade80", icone: ICONES.lancamento },
    { label: "eventos", valor: totalEventos, cor: "#fb923c", icone: ICONES.evento },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
      {cards.map((c) => (
        <div
          key={c.label}
          className="flex items-center gap-3 rounded-xl border border-zinc-700 bg-white/5 px-3 py-2.5"
        >
          <span
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
            style={{ backgroundColor: `${c.cor}26`, color: c.cor }}
          >
            <Icone d={c.icone} />
          </span>
          <div>
            <p className="text-lg font-bold leading-none text-zinc-100">{c.valor}</p>
            <p className="text-[11px] text-zinc-500">{c.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
