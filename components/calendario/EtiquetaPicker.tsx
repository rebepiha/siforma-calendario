"use client";

import { useState } from "react";
import { Etiqueta } from "@/lib/types";
import { PALETA_ETIQUETAS, corTextoContraste } from "@/lib/etiquetaCores";

function IconeLapis() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
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

function SeletorDeCor({ corAtual, onEscolher }: { corAtual: string; onEscolher: (cor: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {PALETA_ETIQUETAS.map((cor) => (
        <button
          key={cor}
          type="button"
          onClick={() => onEscolher(cor)}
          className={`h-7 w-7 rounded-md ring-offset-2 ring-offset-zinc-900 transition ${
            corAtual === cor ? "ring-2 ring-zinc-100" : ""
          }`}
          style={{ backgroundColor: cor }}
          aria-label={cor}
        />
      ))}
    </div>
  );
}

function FormularioEtiqueta({
  nomeInicial,
  corInicial,
  onSalvar,
  onCancelar,
  onExcluir,
}: {
  nomeInicial: string;
  corInicial: string;
  onSalvar: (nome: string, cor: string) => void;
  onCancelar: () => void;
  onExcluir?: () => void;
}) {
  const [nome, setNome] = useState(nomeInicial);
  const [cor, setCor] = useState(corInicial);

  return (
    <div className="flex flex-col gap-2 rounded-md border border-zinc-700 bg-zinc-800 p-2.5">
      <input
        autoFocus
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        placeholder="Nome da etiqueta"
        className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-2.5 py-1.5 text-sm text-zinc-100"
      />
      <SeletorDeCor corAtual={cor} onEscolher={setCor} />
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
            onClick={() => nome.trim() && onSalvar(nome.trim(), cor)}
            disabled={!nome.trim()}
            className="rounded-md bg-oliva px-3 py-1.5 text-xs font-medium text-white hover:bg-oliva-forte disabled:opacity-50"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}

export default function EtiquetaPicker({
  etiquetas,
  selecionadas,
  onToggle,
  onCriar,
  onEditar,
  onExcluir,
  onFechar,
}: {
  etiquetas: Etiqueta[];
  selecionadas: string[];
  onToggle: (id: string) => void;
  onCriar: (nome: string, cor: string) => Promise<void>;
  onEditar: (id: string, nome: string, cor: string) => Promise<void>;
  onExcluir: (id: string) => Promise<void>;
  onFechar: () => void;
}) {
  const [busca, setBusca] = useState("");
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [criandoNova, setCriandoNova] = useState(false);

  const etiquetasFiltradas = etiquetas.filter((et) =>
    et.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4">
      <div className="absolute inset-0" onClick={onFechar} />
      <div className="relative flex max-h-[85vh] w-full max-w-sm flex-col overflow-y-auto rounded-xl border border-zinc-700 bg-zinc-900 p-4 shadow-2xl">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-zinc-100">Etiquetas</h3>
          <button
            onClick={onFechar}
            className="rounded p-1 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"
          >
            ✕
          </button>
        </div>

        <input
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar etiquetas..."
          className="mb-3 w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100"
        />

        <div className="flex flex-col gap-1.5">
          {etiquetasFiltradas.map((et) =>
            editandoId === et.id ? (
              <FormularioEtiqueta
                key={et.id}
                nomeInicial={et.nome}
                corInicial={et.cor}
                onCancelar={() => setEditandoId(null)}
                onSalvar={async (nome, cor) => {
                  await onEditar(et.id, nome, cor);
                  setEditandoId(null);
                }}
                onExcluir={async () => {
                  await onExcluir(et.id);
                  setEditandoId(null);
                }}
              />
            ) : (
              <div key={et.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selecionadas.includes(et.id)}
                  onChange={() => onToggle(et.id)}
                  className="h-4 w-4 shrink-0 rounded border-zinc-600"
                />
                <button
                  onClick={() => onToggle(et.id)}
                  className="flex-1 truncate rounded-md px-2.5 py-1.5 text-left text-sm font-medium"
                  style={{ backgroundColor: et.cor, color: corTextoContraste(et.cor) }}
                >
                  {et.nome}
                </button>
                <button
                  onClick={() => setEditandoId(et.id)}
                  className="shrink-0 rounded p-1.5 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"
                  title="Editar etiqueta"
                >
                  <IconeLapis />
                </button>
              </div>
            )
          )}
          {etiquetasFiltradas.length === 0 && (
            <p className="py-2 text-center text-xs text-zinc-500">Nenhuma etiqueta encontrada.</p>
          )}
        </div>

        <div className="mt-3">
          {criandoNova ? (
            <FormularioEtiqueta
              nomeInicial=""
              corInicial={PALETA_ETIQUETAS[0]}
              onCancelar={() => setCriandoNova(false)}
              onSalvar={async (nome, cor) => {
                await onCriar(nome, cor);
                setCriandoNova(false);
              }}
            />
          ) : (
            <button
              onClick={() => setCriandoNova(true)}
              className="w-full rounded-md border border-zinc-700 px-3 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-800"
            >
              + Criar uma nova etiqueta
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
