import { Canal, StatusPost, TipoPost } from "./types";

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
  email: "Email",
};

export const LABEL_STATUS: Record<StatusPost, string> = {
  pendente: "Pendente",
  em_producao: "Em produção",
  agendado: "Agendado",
  publicado: "Publicado",
};
