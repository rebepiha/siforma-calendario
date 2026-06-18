"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ABAS = [
  { href: "/", label: "Calendário Editorial" },
  { href: "/tarefas", label: "Tarefas de Marketing" },
  { href: "/metas", label: "Metas e Progresso" },
  { href: "/ideias", label: "Banco de Ideias" },
];

export default function TopNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-600 bg-zinc-700">
      <div className="flex w-full flex-wrap items-center gap-4 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2.5">
          <Image
            src="/siforma-logo-dark.png"
            alt="Siforma"
            width={120}
            height={33}
            className="h-7 w-auto"
            priority
          />
          <span className="hidden text-sm text-zinc-300 sm:inline">
            Calendário de Marketing
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
                    ? "bg-oliva text-white"
                    : "text-zinc-200 hover:bg-zinc-900 hover:text-oliva-claro"
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
