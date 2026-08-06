import { Post } from "./types";

export function nomeBaseProduto(titulo: string): string {
  return titulo.replace(/^(stories|feed)\s*[-:]?\s*/i, "").trim();
}

// Posts que a equipe escreveu com títulos diferentes pro mesmo produto real
// (ex: "SI Porta Invisível" e "Porta Invisível em Alumínio (slim)") — sem
// isso, a Biblioteca (que agrupa por título exato) mostraria o mesmo produto
// duas vezes. Adicionar um par aqui sempre que notar um produto repetido com
// nomes diferentes; a chave é o nome em minúsculas, o valor é o nome
// canônico que deve aparecer na Biblioteca e nas sugestões de autocompletar
// ao criar um post novo (ver Sessão 42 do HANDOFF.md pro caso que motivou
// isso e pra decisão de não criar uma tabela de produtos separada).
const ALIASES_PRODUTO: Record<string, string> = {
  "si porta invisível": "Porta Invisível em Alumínio (slim)",
  "e-motion (video editado)": "E-Motion Slim",
};

export function nomeCanonicoProduto(titulo: string): string {
  const nome = nomeBaseProduto(titulo);
  return ALIASES_PRODUTO[nome.toLowerCase()] ?? nome;
}

// Lista (única, ordenada) de nomes de produto já usados em posts existentes
// — usada como sugestão de autocompletar no campo Título ao criar um post
// novo, pra reduzir a chance de alguém digitar uma variação nova do mesmo
// produto sem perceber que já existe um com outro nome.
export function nomesProdutosExistentes(posts: Post[]): string[] {
  const nomes = new Set<string>();
  for (const post of posts) {
    if (post.tipo !== "produto" && post.tipo !== "lancamento") continue;
    const nome = nomeCanonicoProduto(post.titulo);
    if (nome) nomes.add(nome);
  }
  return Array.from(nomes).sort((a, b) => a.localeCompare(b, "pt-BR"));
}
