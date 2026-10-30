import { addDays, differenceInCalendarDays, format, parseISO } from "date-fns";
import { Post } from "./types";

export interface MovimentoFeed {
  post: Post;
  data: string;
  ordem: number;
}

// Datas especiais (ex: "Feed: Retrospectiva", "Feed: Lançamentos 2026") não
// andam junto com a sequência, e os dias delas não servem de bloco pra outro post.
const POST_DATA_ESPECIAL = /^(feed\s*[:-]\s*)?(retrospectiva|lançamentos?\b)/i;

function dataEspecial(post: Post) {
  return POST_DATA_ESPECIAL.test(post.titulo.trim());
}

function ehFeedPendente(post: Post, feedId: string) {
  return post.etiqueta_ids.includes(feedId) && post.status !== "publicado";
}

// Depois do último bloco não existe post pra ceder a data. O ritmo do feed é
// misto (1 ou 2 dias de intervalo), então alterna com o intervalo anterior.
function proximaDataNoRitmo(blocos: string[], reservadas: Set<string>) {
  const ultimo = parseISO(blocos[blocos.length - 1]);
  const anterior = blocos.length > 1 ? parseISO(blocos[blocos.length - 2]) : ultimo;
  let dia = addDays(ultimo, differenceInCalendarDays(ultimo, anterior) === 2 ? 3 : 2);
  while (reservadas.has(format(dia, "yyyy-MM-dd"))) {
    dia = addDays(dia, 1);
  }
  return format(dia, "yyyy-MM-dd");
}

/**
 * Ao adiar um post de feed de `post.data` para `novaData`, calcula pra onde vão
 * os posts de feed a partir de `novaData`: cada um passa pra data do seguinte, e
 * o último ganha uma data nova. Vazio se não é um adiamento de feed pendente ou
 * se não há nada depois.
 */
export function planejarAdiamento(
  post: Post,
  novaData: string,
  posts: Post[],
  feedId: string | undefined
): MovimentoFeed[] {
  if (!feedId || novaData <= post.data) return [];
  if (!ehFeedPendente(post, feedId) || dataEspecial(post)) return [];

  const feed = posts.filter((p) => p.id !== post.id && ehFeedPendente(p, feedId));
  const seguintes = feed
    .filter((p) => !dataEspecial(p) && p.data >= novaData)
    .sort((a, b) => a.data.localeCompare(b.data) || a.ordem - b.ordem);
  if (seguintes.length === 0) return [];

  const reservadas = new Set(feed.filter(dataEspecial).map((p) => p.data));
  const dataFinal = proximaDataNoRitmo(
    seguintes.map((p) => p.data),
    reservadas
  );
  const ordemFinal = Math.max(-1, ...posts.filter((p) => p.data === dataFinal).map((p) => p.ordem)) + 1;

  return seguintes.map((p, i) => {
    const proximo = seguintes[i + 1];
    return {
      post: p,
      data: proximo ? proximo.data : dataFinal,
      ordem: proximo ? proximo.ordem : ordemFinal,
    };
  });
}
