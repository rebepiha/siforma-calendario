import { Canal, Formato, StatusPost, TipoPost } from "./types";

export const CORES_CANAL: Record<Canal, { text: string }> = {
  instagram: { text: "text-orange-400" },
  linkedin: { text: "text-blue-400" },
  youtube: { text: "text-red-400" },
};

export const CORES_FORMATO: Record<Formato, { barra: string; texto: string }> = {
  feed: { barra: "bg-zinc-500", texto: "text-zinc-400" },
  stories: { barra: "bg-violet-500", texto: "text-violet-400" },
  reels: { barra: "bg-pink-500", texto: "text-pink-400" },
  carrossel: { barra: "bg-amber-500", texto: "text-amber-400" },
  enquete: { barra: "bg-teal-500", texto: "text-teal-400" },
  quiz: { barra: "bg-indigo-500", texto: "text-indigo-400" },
  caixa_perguntas: { barra: "bg-cyan-500", texto: "text-cyan-400" },
};

export const LABEL_TIPO: Record<TipoPost, string> = {
  produto: "Produto",
  lancamento: "Lançamento",
  evento: "Evento",
  nao_produto: "Não-produto",
};

export const LABEL_FORMATO: Record<Formato, string> = {
  feed: "Feed",
  stories: "Stories",
  reels: "Reels",
  carrossel: "Carrossel",
  enquete: "Enquete",
  quiz: "Quiz",
  caixa_perguntas: "Caixa de perguntas",
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
