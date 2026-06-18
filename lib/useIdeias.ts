"use client";

import { useCallback, useEffect, useState } from "react";
import { Ideia, NovaIdeia } from "./types";
import { IDEIAS_SEED } from "./ideiasSeed";

const CHAVE_LOCALSTORAGE = "siforma-banco-ideias";

export function useIdeias() {
  const [ideias, setIdeias] = useState<Ideia[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const salvas = localStorage.getItem(CHAVE_LOCALSTORAGE);
    const existentes: Ideia[] = salvas ? (JSON.parse(salvas) as Ideia[]) : [];

    // Sempre mescla ideias do seed que ainda não existem (por seção + título) —
    // assim, quando o seed cresce com novas ideias numa sessão futura, elas
    // aparecem pra quem já tinha aberto a página antes (não fica preso ao que foi
    // salvo da primeira vez), sem duplicar nem apagar ideias já marcadas/criadas.
    const chavesExistentes = new Set(existentes.map((i) => `${i.secao}::${i.titulo}`));
    const novasDoSeed: Ideia[] = IDEIAS_SEED.filter(
      (ideia) => !chavesExistentes.has(`${ideia.secao}::${ideia.titulo}`)
    ).map((ideia) => ({
      ...ideia,
      id: crypto.randomUUID(),
      usado: false,
      criado_em: new Date().toISOString(),
    }));

    const atualizadas = [...existentes, ...novasDoSeed];
    if (novasDoSeed.length > 0 || !salvas) {
      localStorage.setItem(CHAVE_LOCALSTORAGE, JSON.stringify(atualizadas));
    }
    setIdeias(atualizadas);
    setCarregando(false);
  }, []);

  const adicionarIdeia = useCallback(
    (valores: NovaIdeia) => {
      const nova: Ideia = {
        ...valores,
        id: crypto.randomUUID(),
        usado: false,
        criado_em: new Date().toISOString(),
      };
      setIdeias((atual) => {
        const atualizadas = [...atual, nova];
        localStorage.setItem(CHAVE_LOCALSTORAGE, JSON.stringify(atualizadas));
        return atualizadas;
      });
    },
    []
  );

  const editarIdeia = useCallback(
    (id: string, campos: Partial<Omit<Ideia, "id" | "criado_em">>) => {
      setIdeias((atual) => {
        const atualizadas = atual.map((i) => (i.id === id ? { ...i, ...campos } : i));
        localStorage.setItem(CHAVE_LOCALSTORAGE, JSON.stringify(atualizadas));
        return atualizadas;
      });
    },
    []
  );

  const excluirIdeia = useCallback((id: string) => {
    setIdeias((atual) => {
      const atualizadas = atual.filter((i) => i.id !== id);
      localStorage.setItem(CHAVE_LOCALSTORAGE, JSON.stringify(atualizadas));
      return atualizadas;
    });
  }, []);

  return { ideias, carregando, adicionarIdeia, editarIdeia, excluirIdeia };
}
