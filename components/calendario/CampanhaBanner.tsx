"use client";

import { useState } from "react";
import { differenceInCalendarDays, format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Campanha, NovaCampanha } from "@/lib/types";

function IconeLapis() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-3.5 w-3.5">
      <path
        d="M13.5 3.5l3 3L6 17l-4 1 1-4L13.5 3.5z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FormularioCampanha({
  inicial,
  onSalvar,
  onCancelar,
  onExcluir,
}: {
  inicial: NovaCampanha;
  onSalvar: (valores: NovaCampanha) => void;
  onCancelar: () => void;
  onExcluir?: () => void;
}) {
  const [nome, setNome] = useState(inicial.nome);
  const [dataInicio, setDataInicio] = useState(inicial.data_inicio);
  const [dataFim, setDataFim] = useState(inicial.data_fim);

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-zinc-700 bg-white/5 p-3">
      <input
        autoFocus
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        placeholder="Nome da campanha (ex: Formobile)"
        className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-2.5 py-1.5 text-sm text-zinc-100"
      />
      <div className="grid grid-cols-2 gap-2">
        <input
          type="date"
          value={dataInicio}
          onChange={(e) => setDataInicio(e.target.value)}
          className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-2.5 py-1.5 text-sm text-zinc-100"
        />
        <input
          type="date"
          value={dataFim}
          onChange={(e) => setDataFim(e.target.value)}
          className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-2.5 py-1.5 text-sm text-zinc-100"
        />
      </div>
      <div className="flex items-center justify-between gap-2 pt-1">
        {onExcluir ? (
          <button
            onClick={onExcluir}
            className="rounded-md px-2 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/10"
          >
            Excluir
          </button>
        ) : (
          <span />
        )}
        <div className="flex gap-2">
          <button
            onClick={onCancelar}
            className="rounded-md px-2.5 py-1.5 text-xs font-medium text-zinc-400 hover:bg-zinc-900"
          >
            Cancelar
          </button>
          <button
            onClick={() =>
              nome.trim() &&
              dataInicio &&
              dataFim &&
              onSalvar({ nome: nome.trim(), data_inicio: dataInicio, data_fim: dataFim })
            }
            disabled={!nome.trim() || !dataInicio || !dataFim}
            className="rounded-md bg-oliva px-3 py-1.5 text-xs font-medium text-white hover:bg-oliva-forte disabled:opacity-50"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CampanhaBanner({
  campanhas,
  periodoInicio,
  periodoFim,
  onCriar,
  onEditar,
  onExcluir,
}: {
  campanhas: Campanha[];
  periodoInicio: Date;
  periodoFim: Date;
  onCriar: (valores: NovaCampanha) => Promise<void>;
  onEditar: (id: string, valores: NovaCampanha) => Promise<void>;
  onExcluir: (id: string) => Promise<void>;
}) {
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [criandoNova, setCriandoNova] = useState(false);

  const visiveis = campanhas.filter(
    (c) => parseISO(c.data_fim) >= periodoInicio && parseISO(c.data_inicio) <= periodoFim
  );

  const hoje = new Date();

  return (
    <div className="flex flex-col gap-2">
      {visiveis.map((c) => {
        if (editandoId === c.id) {
          return (
            <FormularioCampanha
              key={c.id}
              inicial={{ nome: c.nome, data_inicio: c.data_inicio, data_fim: c.data_fim }}
              onCancelar={() => setEditandoId(null)}
              onSalvar={async (valores) => {
                await onEditar(c.id, valores);
                setEditandoId(null);
              }}
              onExcluir={async () => {
                await onExcluir(c.id);
                setEditandoId(null);
              }}
            />
          );
        }

        const inicio = parseISO(c.data_inicio);
        const fim = parseISO(c.data_fim);
        const diasParaComecar = differenceInCalendarDays(inicio, hoje);
        const duracaoTotal = Math.max(differenceInCalendarDays(fim, inicio), 1);
        const progresso = Math.min(
          100,
          Math.max(0, (differenceInCalendarDays(hoje, inicio) / duracaoTotal) * 100)
        );
        const rotulo =
          diasParaComecar > 0
            ? `Faltam ${diasParaComecar} dias`
            : hoje > fim
              ? "Concluído"
              : "Em andamento";

        return (
          <div key={c.id} className="rounded-xl border border-zinc-700 bg-white/5 px-4 py-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-violet-300">
                {c.nome.toUpperCase()} ·{" "}
                {format(inicio, "d MMM", { locale: ptBR }).toUpperCase()} –{" "}
                {format(fim, "d MMM", { locale: ptBR }).toUpperCase()}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-400">{rotulo}</span>
                <button
                  onClick={() => setEditandoId(c.id)}
                  className="rounded p-1 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"
                  title="Editar campanha"
                >
                  <IconeLapis />
                </button>
              </div>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
              <div
                className="h-full rounded-full bg-violet-400 transition-all"
                style={{ width: `${progresso}%` }}
              />
            </div>
          </div>
        );
      })}

      {criandoNova ? (
        <FormularioCampanha
          inicial={{
            nome: "",
            data_inicio: format(periodoInicio, "yyyy-MM-dd"),
            data_fim: format(periodoFim, "yyyy-MM-dd"),
          }}
          onCancelar={() => setCriandoNova(false)}
          onSalvar={async (valores) => {
            await onCriar(valores);
            setCriandoNova(false);
          }}
        />
      ) : (
        <button
          onClick={() => setCriandoNova(true)}
          className="self-start rounded-md border border-zinc-700 px-2.5 py-1 text-xs font-medium text-zinc-500 hover:bg-white/5"
        >
          + Nova campanha
        </button>
      )}
    </div>
  );
}
