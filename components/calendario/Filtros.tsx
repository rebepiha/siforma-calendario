"use client";

import { Canal, Etiqueta, TipoPost } from "@/lib/types";
import { LABEL_CANAL, LABEL_TIPO } from "@/lib/postStyles";

export interface FiltrosState {
  canal: Canal | "todos";
  tipo: TipoPost | "todos";
  etiqueta: string | "todos";
}

export default function Filtros({
  filtros,
  etiquetas,
  onChange,
}: {
  filtros: FiltrosState;
  etiquetas: Etiqueta[];
  onChange: (filtros: FiltrosState) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        value={filtros.canal}
        onChange={(e) =>
          onChange({ ...filtros, canal: e.target.value as FiltrosState["canal"] })
        }
        className="rounded-md border border-zinc-700 bg-zinc-800 px-2 py-1.5 text-sm text-zinc-300"
      >
        <option value="todos">Todos os canais</option>
        {(Object.keys(LABEL_CANAL) as Canal[]).map((canal) => (
          <option key={canal} value={canal}>
            {LABEL_CANAL[canal]}
          </option>
        ))}
      </select>

      <select
        value={filtros.tipo}
        onChange={(e) =>
          onChange({ ...filtros, tipo: e.target.value as FiltrosState["tipo"] })
        }
        className="rounded-md border border-zinc-700 bg-zinc-800 px-2 py-1.5 text-sm text-zinc-300"
      >
        <option value="todos">Todos os tipos</option>
        {(Object.keys(LABEL_TIPO) as TipoPost[]).map((tipo) => (
          <option key={tipo} value={tipo}>
            {LABEL_TIPO[tipo]}
          </option>
        ))}
      </select>

      <select
        value={filtros.etiqueta}
        onChange={(e) => onChange({ ...filtros, etiqueta: e.target.value })}
        className="rounded-md border border-zinc-700 bg-zinc-800 px-2 py-1.5 text-sm text-zinc-300"
      >
        <option value="todos">Todas as etiquetas</option>
        {etiquetas.map((et) => (
          <option key={et.id} value={et.id}>
            {et.nome}
          </option>
        ))}
      </select>
    </div>
  );
}
