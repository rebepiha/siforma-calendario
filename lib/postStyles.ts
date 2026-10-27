import { Canal, Post, StatusPost, TipoPost } from "./types";

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

// Ordem dos cards dentro de um dia: Instagram sempre primeiro, depois o
// `ordem` salvo (arrastar continua reordenando dentro de cada bloco). Usada na
// grade, na lista mobile e no cálculo do arraste, pra posição na tela e
// índice do drop nunca divergirem.
export function compararPostsDoDia(a: Post, b: Post): number {
  const ia = a.canal === "instagram" ? 0 : 1;
  const ib = b.canal === "instagram" ? 0 : 1;
  return ia - ib || a.ordem - b.ordem;
}
