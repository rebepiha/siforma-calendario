"use client";

import { Ideia } from "@/lib/types";
import { corTipoIdeia } from "@/lib/ideiaStyles";

function IconeCheck() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      className="h-3 w-3 shrink-0 text-green-500"
      aria-label="Usado"
    >
      <circle cx="10" cy="10" r="9" fill="currentColor" fillOpacity="0.15" />
      <path
        d="M6.5 10.2l2.2 2.2 4.8-4.8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function IdeiaCard({
  ideia,
  onToggleUsado,
}: {
  ideia: Ideia;
  onToggleUsado: () => void;
}) {
  return (
    <div
      style={{ borderLeftColor: corTipoIdeia(ideia.tipo) }}
      className={`flex flex-col gap-1.5 rounded-md border-l-4 border-y border-r border-zinc-700 bg-zinc-800 p-3 ${
        ideia.usado ? "opacity-50" : ""
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span
          className="inline-block rounded px-1.5 py-0.5 text-[10px] font-medium"
          style={{
            backgroundColor: `${corTipoIdeia(ideia.tipo)}26`,
            color: corTipoIdeia(ideia.tipo),
          }}
        >
          {ideia.tipo}
        </span>
        <button
          type="button"
          onClick={onToggleUsado}
          className="flex items-center gap-1 rounded-full px-1 py-0.5 text-[10px] font-medium text-zinc-400 hover:bg-zinc-900"
          aria-label={ideia.usado ? "Marcar como não usada" : "Marcar como usada"}
        >
          {ideia.usado ? (
            <IconeCheck />
          ) : (
            <span className="block h-2.5 w-2.5 rounded-full border-2 border-zinc-500" />
          )}
          Usado
        </button>
      </div>

      <p className="text-sm font-semibold text-zinc-100">{ideia.titulo}</p>

      {ideia.descricao && <p className="text-xs text-zinc-400">{ideia.descricao}</p>}
    </div>
  );
}
