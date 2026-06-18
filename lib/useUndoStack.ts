"use client";

import { useCallback, useEffect, useRef } from "react";

/**
 * Pilha de "desfazer" em memória (perdida ao recarregar a página). Cada ação
 * registrada empilha a função que a reverte; Ctrl+Z (ou Cmd+Z no Mac) desempilha
 * e executa a mais recente. Não há redo — é só desfazer, na ordem inversa.
 */
export function useUndoStack(ativo: boolean = true) {
  const pilhaRef = useRef<(() => void | Promise<void>)[]>([]);

  const registrarAcao = useCallback((desfazer: () => void | Promise<void>) => {
    pilhaRef.current.push(desfazer);
  }, []);

  useEffect(() => {
    if (!ativo) return;

    function aoTeclar(evento: KeyboardEvent) {
      const teclaZ = evento.key === "z" || evento.key === "Z";
      if (!teclaZ || !(evento.metaKey || evento.ctrlKey) || evento.shiftKey) return;

      // Dentro de um campo de texto, Ctrl+Z deve desfazer a digitação (comportamento
      // nativo do navegador), não a última ação da pilha do app.
      const alvo = evento.target as HTMLElement | null;
      const editandoTexto =
        alvo?.tagName === "INPUT" || alvo?.tagName === "TEXTAREA" || alvo?.isContentEditable;
      if (editandoTexto) return;

      const desfazer = pilhaRef.current.pop();
      if (!desfazer) return;
      evento.preventDefault();
      desfazer();
    }

    window.addEventListener("keydown", aoTeclar);
    return () => window.removeEventListener("keydown", aoTeclar);
  }, [ativo]);

  return { registrarAcao };
}
