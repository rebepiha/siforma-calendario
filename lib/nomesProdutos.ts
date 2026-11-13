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

// Título de um post depois de renomear o produto de `antigo` pra `novo`.
// Título que é só o nome do produto (ou um alias dele), com ou sem prefixo
// "Stories - "/"Feed: ", vira prefixo + novo nome. Senão, troca só o trecho
// com o nome antigo e mantém o resto. Sem o nome antigo, o título não muda.
export function tituloRenomeado(titulo: string, antigo: string, novo: string): string {
  if (nomeCanonicoProduto(titulo).toLowerCase() === antigo.toLowerCase()) {
    const base = nomeBaseProduto(titulo);
    const prefixo = titulo.slice(0, titulo.toLowerCase().lastIndexOf(base.toLowerCase()));
    return prefixo + novo;
  }
  const i = titulo.toLowerCase().indexOf(antigo.toLowerCase());
  if (i === -1) return titulo;
  return titulo.slice(0, i) + novo + titulo.slice(i + antigo.length);
}

// Compara sem acento e sem diferenciar maiúsculas ("Telescópico" = "telescopico").
function normalizar(texto: string): string {
  return texto.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
}

export function tituloContemProduto(titulo: string, nomeProduto: string): boolean {
  const nome = normalizar(nomeProduto);
  return !!nome && normalizar(titulo).includes(nome);
}

// Produto cadastrado cujo nome aparece no título (o nome mais longo ganha:
// "Perfect Pocket Wood" antes de "Perfect Pocket"). Undefined se nenhum aparece.
export function produtoNoTitulo(titulo: string, produtos: Produto[]): Produto | undefined {
  return produtos
    .filter((p) => tituloContemProduto(titulo, p.nome))
    .sort((a, b) => b.nome.length - a.nome.length)[0];
}

// Campo Produto depois de o título mudar (Sessão 51). Trocar o título não
// mudava o produto_id, e o post ficava no grupo antigo da Biblioteca ("BLACK N.
// MAÇANETA PRETA" no Coplanar PL 80). Regras:
// - Algum produto cadastrado aparece no título novo e o produto atual não
//   aparece (ou está vazio): troca para ele.
// - Nenhum aparece, mas o produto atual estava no título original e saiu:
//   esvazia, pra o post não ficar no produto errado.
// - Senão, não mexe (ex.: "BLACK N. Rotary" ligado a "SI Rotary 35").
export function produtoAposMudarTitulo(
  tituloOriginal: string,
  tituloNovo: string,
  produtoAtual: string,
  produtos: Produto[]
): string {
  const atualNoTitulo = !!produtoAtual.trim() && tituloContemProduto(tituloNovo, produtoAtual);
  if (atualNoTitulo) return produtoAtual;
  const encontrado = produtoNoTitulo(tituloNovo, produtos);
  if (encontrado) return encontrado.nome;
  if (produtoAtual.trim() && tituloContemProduto(tituloOriginal, produtoAtual)) return "";
  return produtoAtual;
}

// Famílias: versões do mesmo produto (Slim/Wood, Rotary 35/Easy) que contam como
// um produto só na fila do feed, alternando a versão (Sessão 51). A Biblioteca
// mostra as versões juntas, cada uma com as próprias datas. Nomes = `produtos.nome`
// (comparados sem acento e sem diferenciar maiúsculas); renomear um produto da
// família exige atualizar aqui.
export const FAMILIAS_PRODUTO: { nome: string; versoes: string[] }[] = [
  { nome: "Perfect Pocket", versoes: ["Perfect Pocket Slim", "Perfect Pocket Wood"] },
  { nome: "E-Motion", versoes: ["E-Motion Slim", "E-Motion Wood"] },
  { nome: "OPK Perfect Telescópico", versoes: ["OPK Perfect Telescópico Slim", "OPK perfect telescopico wood"] },
  { nome: "SI Rotary", versoes: ["SI Rotary 35", "Si Rotary Easy"] },
];

export function familiaDoProduto(nomeProduto: string): string | undefined {
  const n = normalizar(nomeProduto);
  return FAMILIAS_PRODUTO.find((f) => f.versoes.some((v) => normalizar(v) === n))?.nome;
}
