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
