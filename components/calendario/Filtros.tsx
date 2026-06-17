"use client";

import { Canal, Formato, TipoPost } from "@/lib/types";
import { LABEL_CANAL, LABEL_FORMATO, LABEL_TIPO } from "@/lib/postStyles";

export interface FiltrosState {
  canal: Canal | "todos";
  tipo: TipoPost | "todos";
  formato: Formato | "todos";
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
        className="rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-sm text-zinc-700"
      >
        <option value="todos">Todos os tipos</option>
        {(Object.keys(LABEL_TIPO) as TipoPost[]).map((tipo) => (
          <option key={tipo} value={tipo}>
            {LABEL_TIPO[tipo]}
          </option>
        ))}
      </select>

      <select
        value={filtros.formato}
        onChange={(e) =>
          onChange({ ...filtros, formato: e.target.value as FiltrosState["formato"] })
        }
        className="rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-sm text-zinc-700"
      >
        <option value="todos">Todos os formatos</option>
        {(Object.keys(LABEL_FORMATO) as Formato[]).map((formato) => (
          <option key={formato} value={formato}>
            {LABEL_FORMATO[formato]}
          </option>
        ))}
      </select>
    </div>
  );
}
