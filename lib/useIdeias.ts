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
    if (salvas) {
      setIdeias(JSON.parse(salvas) as Ideia[]);
    } else {
      const seed: Ideia[] = IDEIAS_SEED.map((ideia) => ({
        ...ideia,
        id: crypto.randomUUID(),
        usado: false,
        criado_em: new Date().toISOString(),
      }));
      setIdeias(seed);
      localStorage.setItem(CHAVE_LOCALSTORAGE, JSON.stringify(seed));
    }
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

  const alternarUsado = useCallback(
    (id: string) => {
      setIdeias((atual) => {
        const atualizadas = atual.map((i) => (i.id === id ? { ...i, usado: !i.usado } : i));
        localStorage.setItem(CHAVE_LOCALSTORAGE, JSON.stringify(atualizadas));
        return atualizadas;
      });
    },
    []
  );

  return { ideias, carregando, adicionarIdeia, alternarUsado };
}
