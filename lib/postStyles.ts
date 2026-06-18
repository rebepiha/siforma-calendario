import { Canal, StatusPost, TipoPost } from "./types";

export const CORES_CANAL: Record<Canal, { text: string }> = {
  instagram: { text: "text-zinc-400" },
  linkedin: { text: "text-blue-400" },
  youtube: { text: "text-red-400" },
};

export const LABEL_TIPO: Record<TipoPost, string> = {
  produto: "Produto",
  lancamento: "Lançamento",
  evento: "Evento",
  nao_produto: "Não-produto",
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
