export type Canal = "feed" | "story";

export type TipoPost = "produto" | "lancamento" | "nao_produto" | "evento";

export type Formato =
  | "post"
  | "reels"
  | "carrossel"
  | "story_estatico"
  | "enquete"
  | "quiz"
  | "caixa_perguntas";

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
  formato: Formato;
  video_pronto: boolean;
  novo_produto: boolean;
  status: StatusPost;
  copy: string | null;
  observacoes: string | null;
}

export type NovoPost = Omit<Post, "id">;

export interface Tarefa {
  id: string;
  titulo: string;
  descricao: string | null;
  responsavel: string | null;
  prazo: string | null;
  prioridade: Prioridade;
  coluna: ColunaTarefa;
  criado_em: string;
}

export type NovaTarefa = Omit<Tarefa, "id" | "criado_em">;

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
