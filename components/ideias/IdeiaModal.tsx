"use client";

import { useEffect, useState } from "react";
import { Ideia, SecaoIdeia } from "@/lib/types";
import { LABEL_SECAO_IDEIA, TIPOS_IDEIA } from "@/lib/ideiasSeed";

export default function IdeiaModal({
  ideia,
  onFechar,
  onSalvar,
  onExcluir,
  onEnviarParaCalendario,
}: {
  ideia: Ideia;
  onFechar: () => void;
  onSalvar: (
    id: string,
    valores: { secao: SecaoIdeia; tipo: string; titulo: string; descricao: string; usado: boolean }
  ) => void;
  onExcluir: (id: string) => void;
  onEnviarParaCalendario: (ideia: Ideia) => void;
}) {
  const [secao, setSecao] = useState<SecaoIdeia>(ideia.secao);
  const [tipo, setTipo] = useState(ideia.tipo);
  const [titulo, setTitulo] = useState(ideia.titulo);
  const [descricao, setDescricao] = useState(ideia.descricao);
  const [usado, setUsado] = useState(ideia.usado);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  function trocarSecao(novaSecao: SecaoIdeia) {
    setSecao(novaSecao);
    if (!TIPOS_IDEIA[novaSecao].includes(tipo)) {
      setTipo(TIPOS_IDEIA[novaSecao][0]);
    }
  }

  function fecharSalvando() {
    if (!titulo.trim()) {
      onFechar();
      return;
    }
    onSalvar(ideia.id, { secao, tipo, titulo: titulo.trim(), descricao: descricao.trim(), usado });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="absolute inset-0" onClick={fecharSalvando} />
      <div className="relative flex max-h-[90vh] w-full max-w-md flex-col overflow-y-auto rounded-xl bg-zinc-800 shadow-2xl">
        <div className="flex items-center justify-between border-b border-zinc-700 px-5 py-4">
          <h2 className="text-base font-semibold text-zinc-100">Editar ideia</h2>
          <button
            onClick={fecharSalvando}
            className="rounded p-1 text-zinc-600 hover:bg-zinc-900 hover:text-zinc-300"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col gap-4 px-5 py-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-400">Título</label>
            <input
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-400">Seção</label>
              <select
                value={secao}
                onChange={(e) => trocarSecao(e.target.value as SecaoIdeia)}
                className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100"
              >
                <option value="stories">{LABEL_SECAO_IDEIA.stories}</option>
                <option value="posts">{LABEL_SECAO_IDEIA.posts}</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-400">Tipo</label>
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100"
              >
                {TIPOS_IDEIA[secao].map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-400">
              Descrição / gancho
            </label>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              rows={4}
              className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100"
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-zinc-300">
            <input
              type="checkbox"
              checked={usado}
              onChange={(e) => setUsado(e.target.checked)}
              className="h-4 w-4 rounded border-zinc-700"
            />
            Já usei essa ideia
          </label>
        </div>

        <div className="flex items-center justify-between gap-2 border-t border-zinc-700 px-5 py-4">
          <button
            onClick={() => onExcluir(ideia.id)}
            className="rounded-md px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-500/10"
          >
            Excluir
          </button>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onEnviarParaCalendario(ideia)}
              className="rounded-md border border-zinc-700 px-3 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-900"
            >
              Enviar pro calendário
            </button>
            <button
              onClick={fecharSalvando}
              className="rounded-md bg-oliva px-4 py-2 text-sm font-medium text-white hover:bg-oliva-forte"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
