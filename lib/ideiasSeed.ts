import { NovaIdeia, SecaoIdeia } from "./types";

export const TIPOS_IDEIA: Record<SecaoIdeia, string[]> = {
  stories: ["Quiz", "Enquete", "Verdadeiro ou Falso", "Antes e Depois", "Outro"],
  posts: ["Produto", "Tendência", "Bastidores", "Obras", "Depoimentos", "Outro"],
};

export const LABEL_SECAO_IDEIA: Record<SecaoIdeia, string> = {
  stories: "Stories",
  posts: "Posts",
};

export const IDEIAS_SEED: NovaIdeia[] = [
  // Stories — Enquetes
  {
    secao: "stories",
    tipo: "Enquete",
    titulo: "Você já teve problemas com trilhos desajustados?",
    descricao: "Sim / Não",
  },
  {
    secao: "stories",
    tipo: "Enquete",
    titulo: "Qual o maior desafio na hora de escolher sistemas deslizantes?",
    descricao: "Qualidade / Instalação / Durabilidade / Acabamento",
  },
  {
    secao: "stories",
    tipo: "Enquete",
    titulo: "Você prefere que o amortecimento seja:",
    descricao: "Suave e silencioso / Mais firme e com trava",
  },
  {
    secao: "stories",
    tipo: "Enquete",
    titulo: "Você já testou algum sistema deslizante da Siforma?",
    descricao: "Sim / Ainda não / Quero conhecer",
  },
  // Stories — Caixinha de perguntas (sem tipo próprio na lista fornecida — usando "Outro")
  {
    secao: "stories",
    tipo: "Outro",
    titulo: "Tem alguma dúvida sobre instalação de sistemas deslizantes?",
    descricao: "",
  },
  {
    secao: "stories",
    tipo: "Outro",
    titulo: "Conta pra gente: o que você mais procura em uma ferragem de qualidade?",
    descricao: "",
  },
  {
    secao: "stories",
    tipo: "Outro",
    titulo:
      "Quer agendar uma visita técnica no showroom da Siforma? Escreva aqui o nome da sua marcenaria.",
    descricao: "",
  },
  {
    secao: "stories",
    tipo: "Outro",
    titulo: "Qual produto você quer ver aqui com mais detalhes?",
    descricao: "",
  },
  {
    secao: "stories",
    tipo: "Outro",
    titulo: "O que te faz escolher uma marca de ferragens?",
    descricao: "",
  },
  // Stories — Caixinha Estratégica (sem tipo próprio na lista fornecida — usando "Outro")
  {
    secao: "stories",
    tipo: "Outro",
    titulo: "Qual desafio técnico você enfrenta com mais frequência?",
    descricao: "",
  },
  {
    secao: "stories",
    tipo: "Outro",
    titulo: "Qual produto você gostaria de ver em funcionamento?",
    descricao: "",
  },
  {
    secao: "stories",
    tipo: "Outro",
    titulo: "Existe algum sistema que você gostaria de conhecer melhor?",
    descricao: "",
  },
  {
    secao: "stories",
    tipo: "Outro",
    titulo: "Qual tema técnico devemos abordar nos próximos conteúdos?",
    descricao: "",
  },
  {
    secao: "stories",
    tipo: "Outro",
    titulo: "Que tipo de solução seus clientes mais pedem atualmente?",
    descricao: "",
  },
  // Stories — Quiz
  {
    secao: "stories",
    tipo: "Quiz",
    titulo: "Qual sistema suporta portas de maiores dimensões?",
    descricao: "",
  },
  {
    secao: "stories",
    tipo: "Quiz",
    titulo: "Qual dessas soluções permite ocultar completamente um ambiente?",
    descricao: "",
  },
  {
    secao: "stories",
    tipo: "Quiz",
    titulo: "Qual característica mais influencia a durabilidade de um sistema deslizante?",
    descricao: "",
  },
  {
    secao: "stories",
    tipo: "Quiz",
    titulo: "Você sabe quantos ciclos um sistema premium pode suportar?",
    descricao: "",
  },
  {
    secao: "stories",
    tipo: "Quiz",
    titulo: "Qual ferragem é indicada para portas articuladas ocultas?",
    descricao: "",
  },
  // Stories — Enquetes (segunda rodada, sem opções fornecidas)
  {
    secao: "stories",
    tipo: "Enquete",
    titulo: "O que mais influencia sua decisão na escolha de uma ferragem?",
    descricao: "",
  },
  {
    secao: "stories",
    tipo: "Enquete",
    titulo: "Em seus projetos, qual é o principal desafio?",
    descricao: "",
  },
  {
    secao: "stories",
    tipo: "Enquete",
    titulo: "Você já especificou portas invisíveis em algum projeto?",
    descricao: "",
  },
  {
    secao: "stories",
    tipo: "Enquete",
    titulo: "O que seus clientes mais valorizam?",
    descricao: "",
  },
  // Posts — Tendência (a maioria)
  {
    secao: "posts",
    tipo: "Tendência",
    titulo: "O fim dos puxadores?",
    descricao:
      "Crescimento dos sistemas touch e push-to-open. Gancho: Será que os puxadores estão com os dias contados?",
  },
  {
    secao: "posts",
    tipo: "Tendência",
    titulo: "Ambientes que mudam de função",
    descricao:
      "Sistemas deslizantes para integrar e separar ambientes. Gancho: A mesma casa pode ter vários layouts ao longo do dia.",
  },
  {
    secao: "posts",
    tipo: "Tendência",
    titulo: "A tendência da arquitetura invisível",
    descricao:
      "Portas embutidas, sistemas ocultos e ferragens invisíveis. Gancho: Quanto menos você vê a ferragem, mais sofisticado tende a ser o projeto.",
  },
  {
    secao: "posts",
    tipo: "Tendência",
    titulo: "Ferragens inteligentes: o luxo que ninguém vê",
    descricao:
      "Tecnologia: amortecimento, sincronização, fechamento suave, deslizamento silencioso.",
  },
  {
    secao: "posts",
    tipo: "Tendência",
    titulo: "O que diferencia um móvel comum de um móvel premium?",
    descricao:
      "O papel das ferragens na experiência do usuário. Gancho: O acabamento chama atenção. A ferragem faz a diferença no dia a dia.",
  },
  {
    secao: "posts",
    tipo: "Tendência",
    titulo: "Tecnologia que dura décadas",
    descricao:
      "Testes de ciclo e durabilidade. Gancho: Quantas vezes uma porta é aberta durante sua vida útil?",
  },
  {
    secao: "posts",
    tipo: "Tendência",
    titulo: "O conceito Hidden Design",
    descricao:
      "Elementos que aparecem apenas quando necessários: closets ocultos, cozinhas ocultas e home offices ocultos.",
  },
  {
    secao: "posts",
    tipo: "Tendência",
    titulo: "O luxo silencioso chegou à marcenaria",
    descricao: "Silent Luxury: ausência de ruídos, movimentos suaves, sofisticação discreta.",
  },
  {
    secao: "posts",
    tipo: "Tendência",
    titulo: "Trend Alert: Transformable Spaces",
    descricao:
      "Espaços transformáveis: sala → escritório, quarto → closet, cozinha → painel oculto.",
  },
  {
    secao: "posts",
    tipo: "Tendência",
    titulo: "O que existe por trás de um deslizamento perfeito?",
    descricao: "A engenharia invisível: trilhos, roldanas, regulagens e amortecedores.",
  },
  {
    secao: "posts",
    tipo: "Tendência",
    titulo: "O que esperar da Formóbile 2026?",
    descricao: "Tendências que devem dominar o setor.",
  },
  {
    secao: "posts",
    tipo: "Bastidores",
    titulo: "O que estamos levando para a Formóbile?",
    descricao: "Bastidores, lançamentos e novidades da Siforma.",
  },
  {
    secao: "posts",
    tipo: "Outro",
    titulo: "A evolução dos sistemas deslizantes em 20 anos",
    descricao: "Formato: Antes x Depois.",
  },
  {
    secao: "posts",
    tipo: "Tendência",
    titulo: "O desafio das portas cada vez maiores",
    descricao: "Como as ferragens acompanham a tendência dos grandes painéis.",
  },
  {
    secao: "posts",
    tipo: "Tendência",
    titulo: "O que ninguém vê em um projeto de alto padrão",
    descricao:
      "Os detalhes técnicos que definem a experiência. Gancho: Todo mundo observa o acabamento. Poucos percebem o que faz o projeto funcionar perfeitamente.",
  },
];
