"use client";

import { useMemo, useState } from "react";
import { useIdeias } from "@/lib/useIdeias";
import { TIPOS_IDEIA, LABEL_SECAO_IDEIA } from "@/lib/ideiasSeed";
import { SecaoIdeia } from "@/lib/types";
import IdeiaCard from "@/components/ideias/IdeiaCard";

const SECOES: SecaoIdeia[] = ["stories", "posts"];

export default function PaginaIdeias() {
  const { ideias, carregando, adicionarIdeia, alternarUsado } = useIdeias();
  const [secaoAtiva, setSecaoAtiva] = useState<SecaoIdeia>("stories");
  const [tipoFiltro, setTipoFiltro] = useState<string>("todos");
  const [busca, setBusca] = useState("");
  const [formAberto, setFormAberto] = useState(false);
  const [novoTitulo, setNovoTitulo] = useState("");
  const [novoTipo, setNovoTipo] = useState(TIPOS_IDEIA[secaoAtiva][0]);
  const [novaDescricao, setNovaDescricao] = useState("");

  const ideiasDaSecao = useMemo(
    () => ideias.filter((i) => i.secao === secaoAtiva),
    [ideias, secaoAtiva]
  );

  const ideiasFiltradas = useMemo(() => {
    const buscaNormalizada = busca.trim().toLowerCase();
    return ideiasDaSecao.filter((i) => {
      if (tipoFiltro !== "todos" && i.tipo !== tipoFiltro) return false;
      if (
        buscaNormalizada &&
        !i.titulo.toLowerCase().includes(buscaNormalizada) &&
        !i.descricao.toLowerCase().includes(buscaNormalizada)
      )
        return false;
      return true;
    });
  }, [ideiasDaSecao, tipoFiltro, busca]);

  function trocarSecao(secao: SecaoIdeia) {
    setSecaoAtiva(secao);
    setTipoFiltro("todos");
    setNovoTipo(TIPOS_IDEIA[secao][0]);
    setFormAberto(false);
  }

  function salvarNovaIdeia() {
    if (!novoTitulo.trim()) return;
    adicionarIdeia({
      secao: secaoAtiva,
      tipo: novoTipo,
      titulo: novoTitulo.trim(),
      descricao: novaDescricao.trim(),
    });
    setNovoTitulo("");
    setNovaDescricao("");
    setNovoTipo(TIPOS_IDEIA[secaoAtiva][0]);
    setFormAberto(false);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-lg font-semibold text-zinc-100">Banco de Ideias</h1>
        <button
          onClick={() => setFormAberto((v) => !v)}
          className="rounded-md bg-oliva px-3 py-2 text-sm font-medium text-white hover:bg-oliva-forte"
        >
          + Adicionar ideia
        </button>
      </div>

      <div className="flex gap-2">
        {SECOES.map((secao) => (
          <button
            key={secao}
            onClick={() => trocarSecao(secao)}
            className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              secaoAtiva === secao
                ? "bg-oliva text-white"
                : "bg-zinc-800 text-zinc-300 hover:bg-zinc-900"
            }`}
          >
            {LABEL_SECAO_IDEIA[secao]} ({ideias.filter((i) => i.secao === secao).length})
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <input
          type="text"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar ideia..."
          className="rounded-md border border-zinc-700 bg-zinc-800 px-2 py-1.5 text-sm text-zinc-300 placeholder:text-zinc-500"
        />
        <button
          onClick={() => setTipoFiltro("todos")}
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            tipoFiltro === "todos"
              ? "bg-zinc-200 text-zinc-900"
              : "bg-zinc-800 text-zinc-400 hover:bg-zinc-900"
          }`}
        >
          Todos
        </button>
        {TIPOS_IDEIA[secaoAtiva].map((tipo) => (
          <button
            key={tipo}
            onClick={() => setTipoFiltro(tipo)}
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              tipoFiltro === tipo
                ? "bg-zinc-200 text-zinc-900"
                : "bg-zinc-800 text-zinc-400 hover:bg-zinc-900"
            }`}
          >
            {tipo}
          </button>
        ))}
      </div>

      {formAberto && (
        <div className="flex flex-col gap-3 rounded-md border border-zinc-700 bg-zinc-800 p-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[2fr_1fr]">
            <input
              value={novoTitulo}
              onChange={(e) => setNovoTitulo(e.target.value)}
              placeholder="Título da ideia"
              className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100"
            />
            <select
              value={novoTipo}
              onChange={(e) => setNovoTipo(e.target.value)}
              className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100"
            >
              {TIPOS_IDEIA[secaoAtiva].map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
          </div>
          <textarea
            value={novaDescricao}
            onChange={(e) => setNovaDescricao(e.target.value)}
            placeholder="Descrição / gancho (opcional)"
            rows={2}
            className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setFormAberto(false)}
              className="rounded-md px-3 py-2 text-sm font-medium text-zinc-400 hover:bg-zinc-900"
            >
              Cancelar
            </button>
            <button
              onClick={salvarNovaIdeia}
              className="rounded-md bg-oliva px-3 py-2 text-sm font-medium text-white hover:bg-oliva-forte"
            >
              Salvar
            </button>
          </div>
        </div>
      )}

      {carregando ? (
        <p className="py-12 text-center text-sm text-zinc-600">Carregando...</p>
      ) : ideiasFiltradas.length === 0 ? (
        <p className="py-12 text-center text-sm text-zinc-600">
          Nenhuma ideia encontrada.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ideiasFiltradas.map((ideia) => (
            <IdeiaCard
              key={ideia.id}
              ideia={ideia}
              onToggleUsado={() => alternarUsado(ideia.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
