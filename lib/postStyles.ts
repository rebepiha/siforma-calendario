import { Canal, Formato, StatusPost, TipoPost } from "./types";

export const CORES_TIPO: Record<
  TipoPost,
  { bg: string; border: string; text: string }
> = {
  produto: {
    bg: "bg-produto-bg",
    border: "border-produto-border",
    text: "text-produto-text",
  },
  lancamento: {
    bg: "bg-lancamento-bg",
    border: "border-lancamento-border",
    text: "text-lancamento-text",
  },
  evento: {
    bg: "bg-evento-bg",
    border: "border-evento-border",
    text: "text-evento-text",
  },
  nao_produto: {
    bg: "bg-naoproduto-bg",
    border: "border-naoproduto-border",
    text: "text-naoproduto-text",
  },
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
