"use client";

import { Meta } from "@/lib/types";

function corProgresso(percentual: number): string {
  if (percentual < 30) return "bg-red-500";
  if (percentual < 70) return "bg-amber-500";
  return "bg-green-500";
}

export default function GoalCard({
  meta,
  onClick,
}: {
  meta: Meta;
  onClick: () => void;
}) {
  const percentual =
    meta.valor_meta > 0 ? (meta.valor_atual / meta.valor_meta) * 100 : 0;
  const percentualExibido = Math.round(percentual);

  return (
    <div
      onClick={onClick}
      className="cursor-pointer rounded-xl border border-zinc-700 bg-zinc-800 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="mb-1 flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold text-zinc-100">{meta.titulo}</h3>
        {meta.categoria && (
          <span className="shrink-0 rounded-full bg-zinc-900 px-2 py-0.5 text-[11px] font-medium text-zinc-400">
            {meta.categoria}
          </span>
        )}
      </div>

      <p className="mb-3 text-xs text-zinc-500">
        {meta.valor_atual.toLocaleString("pt-BR")} de{" "}
        {meta.valor_meta.toLocaleString("pt-BR")}
        {meta.unidade ? ` ${meta.unidade}` : ""}
        {meta.prazo && (
          <> · prazo {new Date(meta.prazo + "T00:00:00").toLocaleDateString("pt-BR")}</>
        )}
      </p>

      <div className="h-2.5 w-full overflow-hidden rounded-full bg-zinc-900">
        <div
          className={`h-full rounded-full transition-all ${corProgresso(percentual)}`}
          style={{ width: `${Math.min(100, Math.max(0, percentual))}%` }}
        />
      </div>
      <p className="mt-1 text-right text-xs font-medium text-zinc-500">
        {percentualExibido}%
      </p>
    </div>
  );
}
