"use client";

import { useState } from "react";
import { Canal, Etiqueta, StatusPost } from "@/lib/types";
import { CORES_CANAL, CORES_STATUS, LABEL_CANAL, LABEL_STATUS } from "@/lib/postStyles";
import { corTextoContraste } from "@/lib/etiquetaCores";
import EtiquetaPicker from "./EtiquetaPicker";

export type Visao = "mensal" | "semanal" | "lista";

const VISOES: { id: Visao; label: string }[] = [
  { id: "mensal", label: "Mensal" },
  { id: "semanal", label: "Semanal" },
  { id: "lista", label: "Lista" },
];

const TODOS_CANAIS: Canal[] = ["instagram", "linkedin", "youtube"];
const TODOS_STATUS: StatusPost[] = ["pendente", "em_producao", "agendado", "publicado"];

function alternar<T>(lista: T[], valor: T): T[] {
  return lista.includes(valor) ? lista.filter((v) => v !== valor) : [...lista, valor];
}

export default function SidebarFiltros({
  visao,
  onVisaoChange,
  canais,
  onCanaisChange,
  status,
  onStatusChange,
  etiquetas,
  etiquetaIds,
  onEtiquetaIdsChange,
  onCriarEtiqueta,
  onEditarEtiqueta,
  onExcluirEtiqueta,
}: {
  visao: Visao;
  onVisaoChange: (v: Visao) => void;
  canais: Canal[];
  onCanaisChange: (c: Canal[]) => void;
  status: StatusPost[];
  onStatusChange: (s: StatusPost[]) => void;
  etiquetas: Etiqueta[];
  etiquetaIds: string[];
  onEtiquetaIdsChange: (ids: string[]) => void;
  onCriarEtiqueta: (nome: string, cor: string) => Promise<Etiqueta>;
  onEditarEtiqueta: (id: string, nome: string, cor: string) => Promise<void>;
  onExcluirEtiqueta: (id: string) => Promise<void>;
}) {
  const [gerenciarAberto, setGerenciarAberto] = useState(false);

  return (
    <aside className="flex w-56 shrink-0 flex-col gap-6 text-sm">
      <div>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Visão
        </h3>
        <div className="flex flex-col gap-1">
          {VISOES.map((v) => (
            <button
              key={v.id}
              onClick={() => onVisaoChange(v.id)}
              className={`rounded-md px-2.5 py-1.5 text-left font-medium transition-colors ${
                visao === v.id
                  ? "bg-oliva text-white"
                  : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Canais
        </h3>
        <div className="flex flex-col gap-1.5">
          {TODOS_CANAIS.map((c) => (
            <label key={c} className="flex items-center gap-2 px-1 py-0.5 text-zinc-300">
              <input
                type="checkbox"
                checked={canais.includes(c)}
                onChange={() => onCanaisChange(alternar(canais, c))}
                className="h-4 w-4 rounded border-zinc-600"
              />
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: CORES_CANAL[c].dot }}
              />
              {LABEL_CANAL[c]}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Status
        </h3>
        <div className="flex flex-col gap-1.5">
          {TODOS_STATUS.map((s) => (
            <label key={s} className="flex items-center gap-2 px-1 py-0.5 text-zinc-300">
              <input
                type="checkbox"
                checked={status.includes(s)}
                onChange={() => onStatusChange(alternar(status, s))}
                className="h-4 w-4 rounded border-zinc-600"
              />
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: CORES_STATUS[s] }}
              />
              {LABEL_STATUS[s]}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Etiquetas
        </h3>
        <div className="flex flex-col gap-1.5">
          {etiquetas.map((et) => (
            <label key={et.id} className="flex items-center gap-2 px-1 py-0.5">
              <input
                type="checkbox"
                checked={etiquetaIds.includes(et.id)}
                onChange={() => onEtiquetaIdsChange(alternar(etiquetaIds, et.id))}
                className="h-4 w-4 shrink-0 rounded border-zinc-600"
              />
              <span
                className="truncate rounded px-2 py-0.5 text-xs font-medium"
                style={{ backgroundColor: et.cor, color: corTextoContraste(et.cor) }}
              >
                {et.nome}
              </span>
            </label>
          ))}
        </div>
        <button
          onClick={() => setGerenciarAberto(true)}
          className="mt-2 w-full rounded-md border border-zinc-700 px-2.5 py-1.5 text-left text-xs font-medium text-zinc-400 hover:bg-white/5"
        >
          + Nova etiqueta
        </button>
      </div>

      {gerenciarAberto && (
        <EtiquetaPicker
          etiquetas={etiquetas}
          selecionadas={etiquetaIds}
          onToggle={(id) => onEtiquetaIdsChange(alternar(etiquetaIds, id))}
          onCriar={async (nome, cor) => {
            await onCriarEtiqueta(nome, cor);
          }}
          onEditar={onEditarEtiqueta}
          onExcluir={onExcluirEtiqueta}
          onFechar={() => setGerenciarAberto(false)}
        />
      )}
    </aside>
  );
}
