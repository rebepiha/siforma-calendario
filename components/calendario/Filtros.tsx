"use client";

import { Canal, TipoPost } from "@/lib/types";
import { LABEL_TIPO } from "@/lib/postStyles";

export interface FiltrosState {
  canal: Canal | "todos";
  tipo: TipoPost | "todos";
}

export default function Filtros({
  filtros,
  onChange,
}: {
  filtros: FiltrosState;
  onChange: (filtros: FiltrosState) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        value={filtros.canal}
        onChange={(e) =>
          onChange({ ...filtros, canal: e.target.value as FiltrosState["canal"] })
        }
        className="rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-sm text-zinc-700"
      >
        <option value="todos">Todos os canais</option>
        <option value="feed">Feed</option>
        <option value="story">Story</option>
      </select>

      <select
        value={filtros.tipo}
        onChange={(e) =>
          onChange({ ...filtros, tipo: e.target.value as FiltrosState["tipo"] })
        }
        className="rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-sm text-zinc-700"
      >
        <option value="todos">Todos os tipos</option>
        {(Object.keys(LABEL_TIPO) as TipoPost[]).map((tipo) => (
          <option key={tipo} value={tipo}>
            {LABEL_TIPO[tipo]}
          </option>
        ))}
      </select>
    </div>
  );
}
