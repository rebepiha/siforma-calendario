"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

export interface ItemMenuContexto {
  label: string;
  onClick: () => void;
  destrutivo?: boolean;
}

export default function ContextMenu({
  x,
  y,
  itens,
  onFechar,
}: {
  x: number;
  y: number;
  itens: ItemMenuContexto[];
  onFechar: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [posicao, setPosicao] = useState({ top: y, left: x });

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const { width, height } = el.getBoundingClientRect();
    setPosicao({
      top: Math.min(y, window.innerHeight - height - 8),
      left: Math.min(x, window.innerWidth - width - 8),
    });
  }, [x, y]);

  useEffect(() => {
    function aoClicarFora() {
      onFechar();
    }
    function aoTeclar(e: KeyboardEvent) {
      if (e.key === "Escape") onFechar();
    }
    window.addEventListener("click", aoClicarFora);
    window.addEventListener("contextmenu", aoClicarFora);
    window.addEventListener("scroll", aoClicarFora, true);
    window.addEventListener("keydown", aoTeclar);
    return () => {
      window.removeEventListener("click", aoClicarFora);
      window.removeEventListener("contextmenu", aoClicarFora);
      window.removeEventListener("scroll", aoClicarFora, true);
      window.removeEventListener("keydown", aoTeclar);
    };
  }, [onFechar]);

  return (
    <div
      ref={ref}
      style={{ top: posicao.top, left: posicao.left }}
      className="fixed z-[100] min-w-[160px] overflow-hidden rounded-md border border-zinc-700 bg-zinc-800 py-1 shadow-2xl"
      onClick={(e) => e.stopPropagation()}
      onContextMenu={(e) => e.preventDefault()}
    >
      {itens.map((item) => (
        <button
          key={item.label}
          onClick={() => {
            item.onClick();
            onFechar();
          }}
          className={`block w-full px-3 py-1.5 text-left text-sm hover:bg-zinc-900 ${
            item.destrutivo ? "text-red-400" : "text-zinc-200"
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
