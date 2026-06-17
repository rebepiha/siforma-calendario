"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ABAS = [
  { href: "/", label: "Calendário Editorial" },
  { href: "/tarefas", label: "Tarefas de Marketing" },
  { href: "/metas", label: "Metas e Progresso" },
];

export default function TopNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-produto-text text-sm font-bold text-white">
            S
          </span>
          <span className="text-base font-semibold text-zinc-900">
            Siforma <span className="text-zinc-400">—</span> Calendário de Marketing
          </span>
        </div>

        <nav className="flex flex-1 items-center gap-1 sm:justify-end">
          {ABAS.map((aba) => {
            const ativo = pathname === aba.href;
            return (
              <Link
                key={aba.href}
                href={aba.href}
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  ativo
                    ? "bg-zinc-900 text-white"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                }`}
              >
                {aba.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
