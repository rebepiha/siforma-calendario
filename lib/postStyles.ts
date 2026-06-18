import { Canal, StatusPost, TipoPost } from "./types";

export const CORES_CANAL: Record<Canal, { text: string; dot: string }> = {
  instagram: { text: "text-orange-400", dot: "#fb923c" },
  linkedin: { text: "text-blue-400", dot: "#60a5fa" },
  youtube: { text: "text-red-400", dot: "#f87171" },
};

export const LABEL_TIPO: Record<TipoPost, string> = {
  produto: "Produto",
  lancamento: "Lançamento",
  evento: "Evento",
  nao_produto: "Não-produto",
};

export const CORES_TIPO: Record<TipoPost, string> = {
  produto: "#3b82f6",
  lancamento: "#a855f7",
  evento: "#ec4899",
  nao_produto: "#22c55e",
};

export const CORES_STATUS: Record<StatusPost, string> = {
  pendente: "#a1a1aa",
  em_producao: "#f97316",
  agendado: "#3b82f6",
  publicado: "#22c55e",
};

export const LABEL_CANAL: Record<Canal, string> = {
  instagram: "Instagram",
  linkedin: "LinkedIn",
  youtube: "YouTube",
};

export const LABEL_STATUS: Record<StatusPost, string> = {
  pendente: "Pendente",
  em_producao: "Em produção",
  agendado: "Agendado",
  publicado: "Publicado",
};
