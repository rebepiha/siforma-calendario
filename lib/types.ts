export type Canal = "instagram" | "linkedin" | "youtube" | "email";

export type TipoPost = "produto" | "lancamento" | "nao_produto" | "evento";

export type StatusPost = "pendente" | "em_producao" | "agendado" | "publicado";

export type Prioridade = "baixa" | "media" | "alta";

export type ColunaTarefa = "a_fazer" | "em_andamento" | "em_revisao" | "concluido";

export interface Post {
  id: string;
  titulo: string;
  data: string;
  canal: Canal;
  tipo: TipoPost;
  categoria: string | null;
  video_pronto: boolean;
  novo_produto: boolean;
  status: StatusPost;
  copy: string | null;
  observacoes: string | null;
  etiqueta_ids: string[];
  ordem: number;
}

export type NovoPost = Omit<Post, "id" | "etiqueta_ids" | "ordem">;

export interface Etiqueta {
  id: string;
  nome: string;
  cor: string;
}

export interface Tarefa {
  id: string;
  titulo: string;
  descricao: string | null;
  responsavel: string | null;
  prazo: string | null;
  prioridade: Prioridade;
  coluna: ColunaTarefa;
  criado_em: string;
  ordem: number;
}

export type NovaTarefa = Omit<Tarefa, "id" | "criado_em" | "ordem">;

export interface Meta {
  id: string;
  titulo: string;
  valor_atual: number;
  valor_meta: number;
  unidade: string | null;
  prazo: string | null;
  categoria: string | null;
}

export type NovaMeta = Omit<Meta, "id">;

export const COLUNAS_TAREFA: { id: ColunaTarefa; titulo: string }[] = [
  { id: "a_fazer", titulo: "A Fazer" },
  { id: "em_andamento", titulo: "Em Andamento" },
  { id: "em_revisao", titulo: "Em Revisão" },
  { id: "concluido", titulo: "Concluído" },
];

export type StatusTarefaSite = "a_fazer" | "em_andamento" | "concluido";

export interface TarefaSite {
  id: string;
  titulo: string;
  descricao: string | null;
  status: StatusTarefaSite;
  prioridade: Prioridade;
  cor: string | null;
  ordem: number;
  criado_em: string;
}

export type NovaTarefaSite = Omit<TarefaSite, "id" | "criado_em">;

export const COLUNAS_SITE: { id: StatusTarefaSite; titulo: string }[] = [
  { id: "a_fazer", titulo: "A Fazer" },
  { id: "em_andamento", titulo: "Em Andamento" },
  { id: "concluido", titulo: "Concluído" },
];

export type SecaoIdeia = "stories" | "posts";

export interface Ideia {
  id: string;
  secao: SecaoIdeia;
  titulo: string;
  tipo: string;
  descricao: string;
  usado: boolean;
  criado_em: string;
}

export type NovaIdeia = Omit<Ideia, "id" | "criado_em" | "usado">;
