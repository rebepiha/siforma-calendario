import { Post, Produto } from "./types";

export function nomeBaseProduto(titulo: string): string {
  return titulo.replace(/^(stories|feed)\s*[-:]?\s*/i, "").trim();
}

// Fallback de agrupamento pra posts ainda sem produto_id (ver migration
// 0008_produtos.sql e Sessão 42 do HANDOFF.md): a Biblioteca agrupa por
// produto_id quando o post já foi vinculado a um produto de verdade, mas
// posts antigos/ambíguos que não foram migrados ainda caem aqui, agrupados
// só por texto do título — com esses dois pares conhecidos de nomes
// diferentes pro mesmo produto real, resolvidos manualmente antes da tabela
// `produtos` existir. Não precisa crescer essa lista pra novos posts (o
// campo Produto do PostModal.tsx resolve isso na origem agora), só serve
// pra não voltar a duplicar os posts históricos que já tinham esse problema.
const ALIASES_PRODUTO: Record<string, string> = {
  "si porta invisível": "Porta Invisível em Alumínio (slim)",
  "e-motion (video editado)": "E-Motion Slim",
  "perfect pocket": "Perfect Pocket Slim",
  "perfect pocket slim (feira)": "Perfect Pocket Slim",
  "opk perfect pocket wood": "Perfect Pocket Wood",
  "pocket 160": "Perfect Pocket Wood",
  "perfect pivot brises": "Perfect Pivot Brises 360",
  "perfect pivot brises 360 central slim": "Perfect Pivot Brises 360",
};

export function nomeCanonicoProduto(titulo: string): string {
  const nome = nomeBaseProduto(titulo);
  return ALIASES_PRODUTO[nome.toLowerCase()] ?? nome;
}

// Grupo da Biblioteca a que um post pertence (ou null se não entra nela por
// tipo/nome). Usado pela própria Biblioteca e pelas sugestões do campo
// Produto no modal de post, pra as duas listas nunca divergirem.
// Post vinculado agrupa por produto_id; sem vínculo, entra no produto
// cadastrado de mesmo nome (senão "Submarine" vinculado e não vinculado
// virariam dois grupos); senão agrupa só pelo nome canônico do título.
export function grupoBiblioteca(
  post: Post,
  produtos: Produto[]
): { chave: string; nome: string } | null {
  if (post.tipo !== "produto" && post.tipo !== "lancamento") return null;
  const canonico = nomeCanonicoProduto(post.titulo);
  const produto = post.produto_id
    ? produtos.find((p) => p.id === post.produto_id)
    : produtos.find((p) => p.nome.toLowerCase() === canonico.toLowerCase());
  const nome = produto?.nome ?? canonico;
  // "Lançamentos de <mês> (...)" é um resumo mensal recorrente, não um produto.
  if (!nome || /^lançamentos? de\b/i.test(nome)) return null;
  const produtoId = post.produto_id ?? produto?.id;
  return { chave: produtoId ? `id:${produtoId}` : `texto:${nome.toLowerCase()}`, nome };
}

// A Biblioteca só mostra posts publicados com a etiqueta Feed.
export function entraNaBiblioteca(post: Post, etiquetaFeedId: string | undefined): boolean {
  return (
    post.status === "publicado" && !!etiquetaFeedId && post.etiqueta_ids.includes(etiquetaFeedId)
  );
}
