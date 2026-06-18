# Handoff — Siforma Calendário de Marketing

## Como usar este arquivo

- **Início de sessão**: leia este arquivo inteiro antes de fazer qualquer coisa no projeto.
- **Fim de sessão** (ou ao concluir uma parte significativa de trabalho): adicione uma
  nova entrada no topo da seção "Histórico de sessões" abaixo, em detalhe — o que foi
  pedido, o que foi feito, decisões tomadas e por quê, e o que ficou pendente. Não
  resuma demais: o objetivo é que a próxima sessão (ou outra pessoa) entenda o
  contexto completo sem precisar reconstruir nada.
- Atualize também a seção "Estado atual" e "Pendências" se algo mudou.

## Estado atual (resumo rápido)

- **Link de produção**: https://siforma-calendario.vercel.app
- **Repositório**: https://github.com/rebepiha/siforma-calendario (público, branch `main`)
- **Supabase**: projeto com URL `https://ayfbzhyykcqrkfpscgkv.supabase.co` (ref `ayfbzhyykcqrkfpscgkv`)
- **Vercel**: workspace `siforma-marketing`, projeto `siforma-calendario`, importado via
  GitHub → auto-deploy a cada push em `main`. Projeto local linkado em `.vercel/project.json`.
- **Stack**: Next.js 16 (App Router) + TypeScript + Tailwind CSS 4, `@dnd-kit` para
  drag-and-drop, `@supabase/supabase-js`, `date-fns`. Fonte: Mulish (`next/font/google`).
- **Identidade visual**: app inteiro em **tema escuro** (ver Sessão 2). Brandbook oficial
  em `/Users/rebep1/Documents/SIFORMA/Marca - RGB/BRANDBOOK SIFORMA.pdf` (cópia também na
  pasta pai `SIFORMA/`) — paleta oliva/grafite vem de lá e é usada nos acentos (nav ativo,
  botões primários, destaque de "hoje"), mas a cor dos cards do calendário editorial
  (laranja/azul/vermelho por canal) foi um pedido específico do usuário, não vem do
  brandbook. Logo: `public/siforma-logo.png` (fundo claro, não usado atualmente) e
  `public/siforma-logo-dark.png` (fundo escuro, em uso no `TopNav` — cópia de
  `ASSINATURAS PNG/PNG - SEM TAGLINE/SIFORMA SEM  (6).png`).
- **Etiquetas dos posts** (ver Sessão 3): o antigo campo fixo `formato` (enum) foi
  substituído por um sistema de etiquetas livre estilo Trello — tabelas `etiquetas`
  (nome + cor) e `post_etiquetas` (relação N:N), gerenciável dentro do modal de editar
  post (`components/calendario/EtiquetaPicker.tsx`). Equipe pode criar, renomear,
  recolorir e excluir etiquetas livremente; cada post pode ter várias.
- **Calendário Editorial redesenhado** (ver Sessão 4): layout em 3 colunas —
  `components/calendario/SidebarFiltros.tsx` (visão Mensal/Semanal/Lista + filtros
  multi-seleção de canal/status/etiqueta), calendário no centro, e
  `components/calendario/PostDetailPanel.tsx` fixo à direita (mostra detalhe do post
  selecionado: status, responsável, checklist de produção, etiquetas, categoria,
  observações — edição de campos como título/data/copy continua no modal de sempre,
  aberto pelo lápis). `components/calendario/EstatisticasCards.tsx` mostra contagens do
  período visível. `components/calendario/CampanhaBanner.tsx` mostra banners de
  campanha/evento (ex: Formobile) com data de início/fim **explícitas e editáveis**
  (tabela `campanhas`, não inferidas dos posts — ver Pendências). Posts agora têm
  `responsavel` (texto livre) e `checklist` (jsonb, 6 itens fixos por post, marcáveis no
  painel de detalhe). **Arquivos anexados ao post (upload/download) ainda não foram
  implementados** — ficou pendente, ver abaixo.
- **Sem autenticação**: acesso por link aberto. RLS habilitado nas 3 tabelas mas com
  política `using (true) with check (true)` (qualquer um com o link lê/escreve).
- **Ambiente local**: máquina não tinha Node/npm/Homebrew — Node foi instalado via `nvm`
  (`export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"`
  precisa rodar antes de qualquer comando `npm`/`npx` em sessão de terminal nova).

## Pendências / próximos passos conhecidos

- Nenhuma pendência crítica — o app está funcional e no ar, cobrindo os 3 requisitos
  (Calendário Editorial, Tarefas de Marketing, Metas e Progresso).
- Tabelas `tarefas` e `metas` continuam vazias por design (a equipe deve popular).
- Os tokens de GitHub e Vercel usados para configurar o pipeline inicial foram de uso
  único/curta duração e devem ter sido revogados ou expirado — se uma sessão futura
  precisar fazer push ou alterar env vars/redeploy e a credencial salva não funcionar
  mais, será necessário pedir ao usuário um token novo (ver "Como autenticar" abaixo).
- Identidade do git neste repo está autodetectada (`rebep1@MacBook-Air-3.local`) em vez
  do nome/email reais do usuário — não corrigido ainda, não é bloqueante.
- Canal `linkedin` existe no schema mas ainda não tem nenhum post de exemplo usando-o
  (nem era pedido) — só fica disponível para quando a equipe quiser usar.
- **PostCard atual** (ver Sessão 5, substitui a descrição de cores por canal das
  Sessões 2–4): card com fundo translúcido (`bg-white/10` + `backdrop-blur-sm`) e uma
  barra colorida na borda esquerda — cor vem da **primeira etiqueta do post**
  (`post.etiqueta_ids[0]`), com fallback pra cor do canal (`CORES_CANAL[canal].dot`) se
  o post não tiver etiqueta nenhuma. Não mostra mais o nome do canal nem todas as
  etiquetas no card (só a principal, com ícone) — informação completa só aparece no
  painel de detalhe ao clicar. Checkbox no canto superior esquerdo marca
  `status='publicado'` direto no card (sem abrir nada); quando marcado, a tag do
  rodapé do card muda pra "Publicado DD/MM" em verde em vez de mostrar tipo/categoria.
- Tema escuro foi aplicado convertendo classes Tailwind (não há `dark:` variants nem
  toggle claro/escuro — é hardcoded escuro). Se um dia quiserem voltar ao tema claro ou
  oferecer os dois, vai precisar reintroduzir as classes claras como variante, não é
  uma reversão trivial de 1 linha.
- As 7 etiquetas iniciais (Feed/Stories/Reels/Carrossel/Enquete/Quiz/Caixa de perguntas)
  foram criadas automaticamente pela migration 0003 com cores arbitrárias só pra não
  ficar tudo cinza — a equipe pode renomear/recolorir/excluir cada uma livremente pelo
  painel de etiquetas, não há nada de especial preso a esses 7 nomes no código.
- A paleta de cores oferecida ao criar/editar uma etiqueta é fixa (12 cores, ver
  `lib/etiquetaCores.ts`, `PALETA_ETIQUETAS`) — não é um color picker livre (RGB/hex
  manual). Se pedirem mais variedade de cores, é só adicionar hex novos nesse array.
- **Arquivos anexados ao post (pendente)**: o painel de detalhe (ver Sessão 4) ainda não
  tem a seção de arquivos (upload/download de vídeo, capa, etc. — vista no mockup que o
  usuário mandou). Precisa de um bucket no Supabase Storage (configuração manual no
  painel, igual às migrations SQL) antes de implementar. Usuário decidiu adiar essa
  parte para uma sessão futura.
- O painel de detalhe (`PostDetailPanel.tsx`) não tem um jeito de "fechar"/desselecionar
  o post (só troca ao clicar em outro post, ou fica vazio se o post selecionado for
  excluído). Não pedido explicitamente, mas pode ser uma melhoria pequena no futuro.
- Nos cards do calendário mensal/semanal, quando o post tem responsável (mostra avatar)
  E o tipo tem nome longo, a etiqueta de tipo no rodapé do card pode truncar (ex:
  "Produto" → "Pro...") por falta de espaço — cosmético, não afeta dados.
- O banner de campanha some quando o período visível (mês/semana) não tem overlap com
  nenhuma campanha cadastrada — isso é esperado, não é bug.

## Como autenticar (se precisar fazer push/deploy futuro)

- **Git/GitHub**: a credencial fica salva no `osxkeychain` via `git credential approve`.
  Se expirar/parar de funcionar, pedir ao usuário um novo Personal Access Token
  (classic, scope `public_repo` é suficiente pois o repo é público) em
  `https://github.com/settings/tokens/new?scopes=public_repo`, depois rodar:
  `printf 'protocol=https\nhost=github.com\nusername=rebepiha\npassword=<TOKEN>\n\n' | git credential approve`
- **Vercel**: usar `npx vercel <comando> --token=<TOKEN>`. Pedir ao usuário um token em
  `https://vercel.com/account/tokens` se necessário. O diretório já está linkado ao
  projeto (`vercel link --project=siforma-calendario` se o link se perder).
- **Supabase**: não há CLI/token configurado — alterações de schema são feitas pedindo
  ao usuário para colar SQL no SQL Editor do painel do Supabase e rodar manualmente
  (o anon key não permite DDL via REST API, só CRUD nas tabelas governado por RLS).

## Histórico de sessões

### Sessão 5 — 2026-06-18

**Contexto**: dois pedidos curtos, mas o primeiro eu interpretei errado da primeira vez.

**1. Drag-and-drop nas Tarefas de Marketing**
- Usuário: "não consigo mover as tarefas de marketing entre os dias". Conferi e
  confirmei — a vista de Calendário das Tarefas (`app/tarefas/page.tsx`) nunca teve
  drag-and-drop implementado, só o Kanban tinha (`DndContext` só envolvia a vista
  Kanban). `TaskChip.tsx` não usava `useDraggable`, `TaskCalendarDayCell.tsx` não usava
  `useDroppable`.
- Corrigido: `TaskChip.tsx` ganhou `useDraggable` (mesmo padrão do `PostCard.tsx`),
  `TaskCalendarDayCell.tsx` ganhou `useDroppable` com destaque visual ao arrastar por
  cima. A vista de calendário agora também fica dentro de um `DndContext` próprio
  (`aoFinalizarArrasteCalendario`), com uma função nova `moverPrazoTarefa` que
  atualiza o campo `prazo`. A caixa "Sem prazo definido" também virou uma zona de
  drop (`useDroppable({id: "sem-prazo"})`) — arrastar uma tarefa pra lá agora limpa o
  prazo (`prazo: null`); antes só aparecia quando havia tarefas sem prazo, agora
  aparece sempre (com texto de dica "Arraste uma tarefa aqui para remover o prazo.")
  pra sempre ter um lugar pra soltar.

**2. Redesign do PostCard — pedido mal interpretado na primeira tentativa**
- Primeiro pedido do usuário (em texto): "as etiquetas e opções de cada card devem
  aparecer apenas quando clicar no card, como era antes. em cada card, um checkbox no
  canto superior esquerdo para quando ele for postado/finalizado". Interpretei como
  "remover etiquetas/pills do card e só mostrar no painel de detalhe" + adicionei um
  checkbox simples. Usuário respondeu que eu **não fiz o que pedi** e mandou um print
  de refer��ncia (calendário de Junho/Julho de outra ferramenta) mostrando exatamente o
  layout esperado — bem mais específico do que eu tinha entendido do texto.
- Layout do card, conforme a referência (`components/calendario/PostCard.tsx`,
  reescrito do zero):
  - Barra vertical colorida na borda esquerda do card inteiro (`<span className="w-1"
    style={{backgroundColor: corPrincipal}} />`), cor = primeira etiqueta do post (ou
    cor do canal se não tiver etiqueta).
  - Linha 1: checkbox (marca/desmarca `status='publicado'` direto, sem abrir o post —
    `onClick`/`onChange` com `stopPropagation` pra não disparar o clique do card) + um
    círculo pequeno colorido com um ícone (criei `IconeFormato` com reconhecimento
    simples por substring no nome da etiqueta: "reel"→play, "carrossel"→quadrados,
    "stor"→círculo pontilhado, "enquete"/"quiz"/"pergunta"→"?", fallback→quadrado
    genérico — já que etiquetas são livres agora, não há like 1:1 garantido com um
    "formato" oficial) + nome da etiqueta principal.
  - Linha 2: título do post.
  - Linha 3: uma tag colorida (`tagPrincipal()` — mostra "Publicado DD/MM" em verde se
    `status==='publicado'`; senão mostra a `categoria` se o post for evento e a
    categoria for curta tipo "Formobile"; senão mostra o `LABEL_TIPO`) + avatar do
    responsável à direita.
  - Não mostra mais o nome do canal (Instagram/LinkedIn/YouTube) nem a lista completa
    de etiquetas no card — só a principal. Informação completa continua no painel de
    detalhe ao clicar.
  - Como `PostCard` deixou de precisar só de `etiquetas` e passou a precisar também de
    `onChangeStatus` (pro checkbox), toda a cadeia de props mudou:
    `DayCell`/`CalendarGrid`/`PostWeekGrid` agora recebem e repassam os dois
    (`etiquetas` E `onChangeStatus`) — `app/page.tsx` passa `onChangeStatus=
    {atualizarStatus}` (função já existente, criada na Sessão 4 pro painel de
    detalhe).
- Testado via Playwright: marcar o checkbox de um post real mudou o status pra
  "publicado" e a tag pra "Publicado DD/MM" corretamente; revertido depois (era post
  real, não de teste). Testado o arraste de tarefa entre dias na vista de calendário
  (terça → quinta) e confirmado no banco. Tarefas "teste" que apareceram na coluna de
  quarta durante o teste **não foram criadas por mim** — são da própria usuária
  testando o app ao vivo enquanto eu trabalhava; identifiquei isso pelo timestamp
  `criado_em` e não toquei nelas, só apaguei a tarefa de teste que eu mesmo criei.

**3. Pendente**
- Nada novo. Arquivos anexados ao post continuam pendentes (ver Sessão 4).

### Sessão 4 — 2026-06-17/18

**Contexto**: usuário mandou um arquivo HTML (`calendario_feed_siforma_atualizado.html`,
salvo em Downloads) com uma versão atualizada do calendário editorial de junho, pedindo
pra deletar os posts antigos divergentes e atualizar com o conteúdo novo. Depois,
mandou um print de um mockup bem mais elaborado (sidebar de filtros, cards de
estatística, banner de campanha, painel de detalhe rico com checklist/arquivos/
responsável, perfil de usuário logado) pedindo pra replicar esse visual mantendo o
conteúdo já atualizado.

**1. Atualização de dados de junho (sem mudança de código)**
- Extraí os 42 posts do HTML (datas exatas onde dadas, senão inferidas pelo padrão
  Terça/Quinta/Sábado já usado) e mostrei a lista completa pro usuário confirmar antes
  de qualquer escrita no banco.
- Usuário corrigiu: não era pra substituir tudo, só atualizar o que **diverge** de
  junho, mantendo o resto do calendário (julho–setembro) intacto. Comparei os posts
  reais de junho no banco contra o HTML e identifiquei exatamente 10 mudanças: 4
  updates de data/status (SI Rotary Easy, Contagem regressiva, OPK Perfect Pivot, e SI
  Camarão que **saiu de agosto e entrou em junho** — atualizei a linha existente em vez
  de duplicar), 4 remoções (posts que não existem mais no calendário atualizado: OPK
  Perfect Pocket Wood, Spoiler, SI Porta Invisível Wood, SI 300/400 H-S) e 2 inserções
  (Tendências em 16/jun, SI Porta Invisível Slim em 20/jun). Tudo feito via REST API do
  Supabase direto (`curl` com a anon key), sem precisar de migration — são só
  dados, não schema. Confirmei o resultado final consultando o banco depois.
- Pedido seguinte: cards do calendário com "um pouco de contraste do fundo, com um
  branco meio transparente" — troquei o fundo do `PostCard` de `bg-zinc-800` sólido
  para `bg-white/10` com `backdrop-blur-sm` (efeito vidro). Só esse 1 arquivo mudou.

**2. Redesign grande do Calendário Editorial (mockup com sidebar/painel)**
- Antes de implementar, mapeei o que o mockup pedia e quais decisões precisavam de
  confirmação do usuário, porque misturava (a) estilo puramente visual, (b)
  funcionalidades novas de banco (checklist, arquivos, responsável, banner de
  campanha) e (c) um perfil de usuário logado que **contradizia** a decisão explícita
  de "sem login" do projeto. Perguntei e o usuário decidiu: quer aparência E as
  funcionalidades novas; sem login (remover essa parte do mockup); quer Mensal +
  Semanal + Lista funcionando (não só Mensal); manter os 4 status que já existem
  (Pendente/Em produção/Agendado/Publicado) em vez dos 5 do mockup.
- **Migration 0004**: `posts.responsavel` (text) e `posts.checklist` (jsonb, default
  com 6 itens fixos: Roteiro/Gravação/Edição/Arte-Capa/Agendado/Publicado, todos
  `feito:false`). Backfill automático via `default` na própria coluna — todos os posts
  existentes ganharam o checklist padrão zerado.
- **Migration 0005**: tabela `campanhas` (nome, data_inicio, data_fim) — ver item 3
  abaixo sobre por que isso foi necessário além do que tinha sido planejado
  originalmente.
- **Novos componentes**: `SidebarFiltros.tsx` (visão + canais/status/etiquetas como
  checkboxes multi-seleção, substituindo os 3 dropdowns de seleção única que existiam;
  reaproveita o `EtiquetaPicker.tsx` já existente pro "+ Nova etiqueta"/editar/excluir,
  só que agora as checkboxes do picker controlam o filtro em vez da seleção de um
  post específico), `EstatisticasCards.tsx` (posts programados/reels/carrosséis/
  lançamentos/eventos do período visível — reels/carrosséis contam por nome de
  etiqueta, lançamentos/eventos contam por `tipo`), `CampanhaBanner.tsx` (ver item 3),
  `PostDetailPanel.tsx` (painel fixo à direita — status com `<select>`, responsável com
  input que só salva no `onBlur` pra não disparar um update por tecla, checklist com
  checkboxes que persistem na hora), `PostWeekGrid.tsx` e `PostListView.tsx` (vistas
  Semanal e Lista, reaproveitando `DayCell`/estilos já existentes).
- `app/page.tsx` ficou bem mais complexo: estado de `visao` (mensal/semanal/lista) com
  navegação por mês OU semana dependendo da visão; `periodoInicio`/`periodoFim`
  calculados conforme a visão; filtros agora são arrays (`canaisFiltro: Canal[]`,
  `statusFiltro: StatusPost[]`, `etiquetaIdsFiltro: string[]`) em vez de um valor único
  + `"todos"`; separação entre "post selecionado" (popula o painel de detalhe, clique
  simples no card) e "post em edição" (abre o modal de sempre, só pelo lápis do painel
  ou pelo "+ Adicionar post"/"+ Novo post").
- `PostCard.tsx` ganhou: pills de etiqueta com texto (em vez das barrinhas finas da
  Sessão 3), pill de tipo (`CORES_TIPO`, reintroduzido em `postStyles.ts` — tinha sido
  removido na Sessão 2/3 quando o card passou a colorir por canal, agora virou um
  pill secundário, não mais a cor do card todo) e avatar do responsável (reaproveita
  `lib/avatar.ts`, já usado nas tarefas).

**3. Por que existe uma tabela `campanhas` separada (não estava no plano original)**
- A primeira implementação do banner inferia o período (início/fim) a partir das datas dos
  posts marcados `tipo=evento` agrupados por `categoria` (ex: todos os posts com
  categoria "Formobile"). Usuário corrigiu: "formobile começa dia 30/6" — o post
  "Contagem regressiva" (27/jun) e "É amanhã! Estaremos te esperando" (29/jun) são
  *esquenta* publicados **antes** do evento, não dias do evento em si, e estavam
  distorcendo o cálculo (banner mostrava "27 jun – 30 jun" em vez do período real).
  Perguntei se queria um campo de data explícito (mais robusto pra eventos futuros) ou
  só ignorar posts de esquenta por heurística de título (mais simples mas frágil) —​
  escolheu o campo explícito. Criei a tabela `campanhas` com `data_inicio`/`data_fim`
  editáveis direto no banner (ícone de lápis abre um formulário inline, mesmo padrão
  do `EtiquetaPicker`), e segui via migration 0005, já semeando a campanha "Formobile"
  com as datas certas (30/jun–3/jul) informadas pelo usuário.

**4. Bug encontrado e corrigido durante os testes**
- O filtro de etiquetas (checkboxes na sidebar) tinha um `useEffect` de sincronização
  (pra adicionar etiquetas novas criadas automaticamente à lista de "selecionadas") que
  dependia de `etiquetaIdsFiltro` no array de dependências — toda vez que o usuário
  desmarcava uma etiqueta, o efeito rodava de novo, via que aquele id "não estava mais
  selecionado" e o tratava como "etiqueta nova", **readicionando-o automaticamente**.
  Resultado: impossível desmarcar uma etiqueta no filtro, ela "ressuscitava" sozinha.
  Corrigido trocando a comparação por um `useRef<Set<string>>` que guarda quais ids já
  foram "vistos" alguma vez (independente de estarem selecionados agora) — só ids
  realmente novos (nunca vistos) são auto-selecionados; desmarcação manual nunca é
  desfeita. O efeito agora só depende de `etiquetas` (com
  `eslint-disable-next-line react-hooks/exhaustive-deps` proposital, já que incluir
  `etiquetaIdsFiltro` reintroduziria o bug).

**5. Testes**
- `npm run lint` e `npm run build` limpos a cada etapa. Migrations 0004 e 0005
  confirmadas via REST API antes de testar (coluna `responsavel`/`checklist` presentes;
  tabela `campanhas` com a linha "Formobile" certa).
- Testado via Playwright/Chrome headless contra produção: vista Mensal com sidebar +
  stats + banner + cards novos; clicar um post populando o painel de detalhe; marcar
  item do checklist, mudar status, definir responsável (apareceu como avatar no card);
  vista Semanal e Lista; desmarcar/remarcar etiqueta no filtro (pegou o bug do item 4);
  abrir o modal de edição pelo lápis do painel. Reverti no banco os campos de teste
  (status/responsável/checklist) que setei no post real "SI Porta Invisível Slim"
  durante o teste.

**6. Pendente**
- Arquivos anexados ao post (upload/download) — ver "Pendências" no topo. Usuário
  decidiu adiar para depois de ver o resto funcionando em produção.

### Sessão 3 — 2026-06-17

**Contexto**: continuação da Sessão 2, mesma conversa. Dois pedidos do usuário: (1)
poder selecionar/editar a cor e o texto da etiqueta de formato — mandou um print do
painel de etiquetas do Trello (checkbox + swatch de cor + lápis de editar + "criar nova
etiqueta") como modelo; (2) o calendário editorial não deveria mais mostrar dias de
outros meses preenchendo a última semana da grade.

**1. Calendário só do mês atual**
- `components/calendario/CalendarGrid.tsx`: a grade de 7 colunas continua sendo
  calculada com padding (`startOfWeek`/`endOfWeek`) pra manter o alinhamento por dia da
  semana, mas agora, se um dia da grade não pertence ao `mesAtual`, renderiza uma
  `<div>` vazia (sem número, sem posts, sem drop target) em vez de um `DayCell`
  completo. `DayCell.tsx` perdeu a prop `noMesAtual` (não precisa mais saber se está
  "fora do mês", porque só é renderizado quando está dentro).

**2. Sistema de etiquetas livre (substituiu o campo `formato`)**
- Decisão de escopo: perguntei se era só para deixar editável os 7 formatos fixos, ou
  um sistema de etiquetas totalmente livre estilo Trello (várias por post, criadas pela
  equipe). Usuário escolheu o segundo, com a UI dentro do modal de editar post (não uma
  tela de configuração separada).
- **Banco de dados**: criei `supabase/migrations/0003_etiquetas.sql` — tabela
  `etiquetas` (id, nome, cor hex, criado_em) e tabela de junção `post_etiquetas`
  (post_id, etiqueta_id, FK com `on delete cascade` nos dois lados). Seed automático das
  7 etiquetas equivalentes aos formatos antigos (mesmos nomes, cores arbitrárias da
  paleta nova). Migra os 47 posts existentes (cada um pro seu formato antigo
  correspondente, via `ALTER TYPE`... não, via `case` + `join`, já que não dá pra
  renomear enum pra uma FK) e por fim **remove a coluna `formato` e o tipo
  `formato_enum`**. Usuária rodou no SQL Editor do Supabase e confirmei via REST API
  (`select=formato` retornou erro "column does not exist", `post_etiquetas` tinha 47
  linhas — uma por post, exatamente o esperado).
- Também atualizei `supabase/migrations/0001_init.sql` pra refletir o schema novo em
  instalações do zero (mesmo padrão das sessões anteriores: 0001 não é histórico
  imutável, é o "schema correto se alguém clonar o projeto hoje) — removi
  `formato_enum`/coluna `formato`, adicionei as tabelas `etiquetas`/`post_etiquetas` e o
  seed das 7 etiquetas, e tirei o valor de formato de cada uma das 44 linhas do seed de
  posts (column list e tuplas, via regex — confirmei contagem de colunas depois).
- **Modelo de dados no app**: `lib/types.ts` — removi `Formato`/`formato`; `Post` ganhou
  `etiqueta_ids: string[]` (resolvido em memória a partir de `post_etiquetas`, não é
  coluna real); novo tipo `Etiqueta { id, nome, cor }`. `NovoPost` exclui
  `etiqueta_ids` (não é enviado direto pra tabela `posts`).
- **`lib/etiquetaCores.ts`** (novo): paleta fixa de 12 cores (`PALETA_ETIQUETAS`, hex)
  oferecida no seletor de cor, e `corTextoContraste(hex)` — calcula luminância e
  devolve branco ou quase-preto, pra texto sempre legível em cima de qualquer cor que a
  equipe escolher (não dá pra gerar classe Tailwind em runtime pra cor arbitrária, por
  isso cor é sempre via `style={{ backgroundColor }}` inline, mesmo padrão que
  `lib/avatar.ts` já usava pros avatares de responsável).
- **`components/calendario/EtiquetaPicker.tsx`** (novo): painel modal (estilo
  Trello) com busca, lista de etiquetas com checkbox + cor de fundo + lápis de editar,
  formulário inline de criar/editar (nome + grade de cores + excluir), idêntico nas
  duas situações (criar e editar reusam o mesmo `FormularioEtiqueta`).
- **`components/calendario/PostCard.tsx`**: não tinta mais o fundo do card pela etiqueta
  — fundo voltou a ser cinza-escuro uniforme (`bg-zinc-800`). Cada etiqueta do post
  aparece como uma barrinha curta colorida (`h-1.5 w-6`) lado a lado no topo do card
  (várias etiquetas = várias barrinhas), com `title` (tooltip) mostrando o nome —
  decisão consciente de não escrever o nome por extenso no card pra não estourar o
  espaço quando há 2-3 etiquetas; o nome aparece no tooltip e, com mais destaque, no
  modal de edição.
- **`components/calendario/PostModal.tsx`**: campo "Formato" trocado por "Etiquetas" —
  mostra as etiquetas já marcadas como chips coloridos (com botão ✕ pra desmarcar
  direto, sem abrir o painel) e um botão "+ Adicionar" que abre o `EtiquetaPicker`.
  `onSalvar` agora recebe um terceiro argumento (`etiquetaIds: string[]`) além de
  `id`/`valores`.
- **`components/calendario/Filtros.tsx`**: terceiro filtro trocou de "formato" (lista
  fixa) pra "etiqueta" (lista dinâmica vinda do banco, via nova prop `etiquetas`).
- **`app/page.tsx`** (mudança mais profunda): carrega `posts` e `post_etiquetas` em
  paralelo (`Promise.all`) e funde os dois em memória pra montar `Post.etiqueta_ids`;
  carrega `etiquetas` numa chamada separada. Novas funções `criarEtiqueta` (retorna a
  etiqueta criada, pra poder marcá-la automaticamente no post que está sendo editado —
  igual ao Trello), `editarEtiqueta`, `excluirEtiqueta` (também limpa `etiqueta_ids` dos
  posts em memória que tinham aquela etiqueta, já que o `on delete cascade` do banco não
  atualiza o estado React sozinho). `salvarPost` agora: salva a linha em `posts` (sem
  `etiqueta_ids`, que não é coluna real), depois substitui todas as linhas de
  `post_etiquetas` daquele post (`delete` + `insert` do conjunto novo — mais simples que
  fazer diff).

**3. Erros e decisões durante a implementação**
- Os inputs/selects/textareas dos 3 modais (`PostModal`, `TaskModal`, `GoalModal`) não
  tinham `bg-*`/`text-*` explícitos desde a Sessão 2 (dependiam de `color-scheme: dark`
  e do `color: inherit` do preflight do Tailwind pra ficarem legíveis) — funcionava, mas
  decidi deixar explícito (`bg-zinc-900 text-zinc-100`) em todos pra não depender de
  comportamento de navegador, já que ia editar esses arquivos de qualquer forma.
- `CORES_TIPO` (cores por `tipo` de post) já estava morto desde a Sessão 2 (quando o
  card passou a colorir por canal) mas só removi agora, junto com o resto da limpeza.

**4. Testes**
- Pedi pra usuária rodar a migration 0003 antes de testar (app depende do schema novo:
  sem a coluna `formato`, com as tabelas `etiquetas`/`post_etiquetas`). Confirmei via
  REST API que rodou certo (7 etiquetas, 47 `post_etiquetas`, coluna `formato` ausente)
  antes de seguir.
- Testei o fluxo completo via Playwright/Chrome headless contra o banco de produção já
  migrado: abrir post → criar etiqueta nova (cor laranja) → confirmar que seleciona
  automaticamente e aparece como chip → salvar post → card mostra 2 barrinhas (Feed +
  a nova) → filtrar pela etiqueta "Stories" (mostra só o post certo) → editar
  nome/cor de uma etiqueta existente (e depois revertido, já que era dado real da
  equipe, não teste) → criar e excluir uma etiqueta de teste pelo botão "Excluir" do
  próprio formulário de edição (confirma que remove da lista E do post que estava
  usando). Em alguns testes criei etiquetas de teste duplicadas por rodar o mesmo
  script do Playwright mais de uma vez sem persistir estado entre execuções — todas
  removidas via REST API antes de finalizar; banco ficou só com as 7 etiquetas
  originais + a real "Carrossel" revertida pro nome/cor originais.
- `npm run lint` e `npm run build` limpos antes de cada commit.

**5. Pendente / observações pro futuro**
- Ver bullets novos em "Pendências" no topo deste arquivo (paleta de cores fixa de 12
  opções, as 7 etiquetas iniciais não têm nada de especial/hardcoded).

### Sessão 2 — 2026-06-17

**Contexto**: usuário pediu três coisas no início da sessão: (1) aplicar a identidade
visual da Siforma usando o brandbook oficial, (2) trocar a cor dos cards do calendário
editorial — etiquetas de cor para story/feed e canal em vez da cor por `tipo` que
existia — e (3) uma vista de calendário para as tarefas da Victoria (um dia, uma lista
de tarefas). Depois de uma primeira implementação, o usuário pediu ajustes e por fim
mandou duas imagens de referência (prints de um board do Notion) pedindo para seguir
aquele modelo visual, o que levou a uma revisão grande do design.

**1. Brandbook — leitura e extração**
- Usuário apontou o caminho `/Users/rebep1/Documents/SIFORMA/Marca - RGB`. Achei o PDF
  `BRANDBOOK SIFORMA.pdf` (42 páginas) e também uma pasta `ASSINATURAS PNG` com várias
  variações do logo já exportadas.
- Máquina não tinha `poppler`/`ghostscript`/ImageMagick para renderizar PDF em imagem e
  não há Homebrew. Resolvi instalando `pymupdf` via `pip3 install --user` (lib
  autocontida, não depende de binários de sistema) e renderizando cada página como PNG
  com `fitz` para poder "ver" o conteúdo do PDF.
- Paleta extraída: **Verde Oliva** `#68A04A` (principal), **Oliva Forte** `#375126`,
  **Oliva Claro** `#DBF2CC`, **Cinza Grafite** `#494B4C` (principal), **Grafite Escuro**
  `#2E3133`, **Grafite Claro** `#7F7F7F`. Apenas essas 2 matizes existem oficialmente
  (sem 3ª cor). Tipografia oficial: **Mulish**. Logo oficial tem variação para fundo
  claro (ícone+texto em oliva/grafite médio) e para fundo escuro (oliva/grafite claro).

**2. Primeira rodada (depois revisada — ver item 4)**
- Troquei a fonte de Inter para Mulish em `app/layout.tsx`, adicionei os tokens de cor
  da marca em `app/globals.css`, troquei o placeholder "S" do `TopNav` pelo logo real
  (`public/siforma-logo.png`), e recolori os botões primários e o estado ativo da nav
  para verde oliva.
- Primeira versão das cores de canal: testei com fundo do card tingido por canal
  (Instagram=verde oliva claro, LinkedIn=cinza claro, YouTube=grafite escuro sólido) —
  essa versão **foi descartada** depois (ver item 4).
- Primeira versão do calendário de tarefas: vista **mensal** (grid 7×~5 igual ao
  calendário editorial), com toggle Kanban/Calendário, filtro por responsável (default
  "Victoria"), seção "Sem prazo definido". O usuário depois pediu para trocar de mensal
  para **semanal** (uma linha de 7 colunas, bem mais alta, pra caber muitas tarefas por
  dia sem aperto) — implementado em `components/tarefas/TaskCalendarGrid.tsx` /
  `TaskCalendarDayCell.tsx`, navegação trocada de `addMonths/subMonths` para
  `addWeeks/subWeeks` em `app/tarefas/page.tsx`.
- Nessa mesma rodada o usuário também pediu pra trocar a cor de canal pra algo mais
  neutro: laranja (Instagram) / azul (LinkedIn) / vermelho (YouTube), tons claros e
  discretos — e que a etiqueta de formato (story/feed/etc.) tivesse cor própria por
  formato. Implementei isso em `lib/postStyles.ts` (`CORES_CANAL` com tons pastel
  `orange-50/blue-50/red-50`, `CORES_FORMATO` novo, um tom por formato).

**3. Verificação visual sem navegador interativo**
- Não há ferramenta de browser/screenshot disponível por padrão neste ambiente de
  agente. Resolvi instalando `playwright` via `pip3 install --user` e usando o Chrome
  já instalado no Mac (`channel="chrome"`, sem precisar baixar Chromium) para abrir o
  `localhost:3000`, clicar em elementos (ex: toggle "Calendário") e tirar screenshot.
  Para casos simples (sem clique) usei `Google Chrome --headless=new --screenshot=...`
  direto, mais rápido.
- Para validar visualmente cores de canal/formato e os chips de tarefa, inserí posts e
  tarefas temporários direto via REST API do Supabase (`curl` + anon key do
  `.env.local`), tirei o print, e **sempre apaguei** os registros de teste depois
  (filtrando por prefixo `TESTE` no título). Nenhum dado de teste ficou no banco.

**4. Pivô grande: tema escuro + redesign inspirado em referências do Notion**
- Usuário mandou 2 imagens: uma de um board "Tarefas Victoria" no Notion (vista semanal,
  tema escuro, colunas por dia, dia atual destacado com borda azul, cards minimalistas
  só com título, sem avatar — porque o board já é por pessoa) e um close-up de cards
  com uma **barrinha colorida fina no topo** indicando categoria (ex: dourado=Carrossel,
  roxo=Stories, azul=LinkedIn), em vez de pill/badge.
- Perguntei se era só pra seguir a estrutura/layout mantendo tema claro, ou migrar tudo
  pra escuro — usuário respondeu **"tema escuro no app todo"**. Isso expandiu bastante o
  escopo (afeta todas as 3 abas, todos os componentes).
- **Conversão de tema**: troquei `--background`/`--foreground` em `app/globals.css` pra
  tons escuros (`#0e0f11` / `#e4e4e7`) e adicionei `color-scheme: dark` (faz o navegador
  renderizar `<select>`, scrollbar, date picker nativos no estilo escuro automaticamente).
  Converti as classes Tailwind claras→escuras em massa com `perl -pi -e` rodando em todos
  os arquivos de `app/` e `components/` de uma vez (mapeamento tipo `bg-white→bg-zinc-900`,
  `text-zinc-900→text-zinc-100`, `text-zinc-600↔text-zinc-400` invertido, etc).
  - **Armadilha 1**: usei um placeholder `@@TMP600@@` no meio da troca de
    `text-zinc-600`/`text-zinc-400` (pra evitar que uma regra desfizesse a outra) mas
    escrevi o placeholder sem escapar o `@` no **lado de substituição** do `s///` do
    Perl — Perl interpreta `@algumacoisa` como interpolação de array nesse contexto, e
    silenciosamente "comeu" o placeholder, deixando literais `@@@` em vários arquivos
    (`TopNav.tsx`, `app/tarefas/page.tsx`, `TaskModal.tsx`, etc). Corrigido com um
    replace global de `@@@` → `text-zinc-400` (o único valor que o placeholder podia
    ter sido) depois de confirmar visualmente que era seguro.
  - **Armadilha 2**: a regra `bg-red-50→bg-red-500/10` colidiu como *substring* com
    `bg-red-500` (que já existia, ex. cor do indicador de prioridade "alta") — virou
    `bg-red-500/100` (sufixo de opacidade indevido). Corrigido manualmente em
    `GoalCard.tsx`, `TaskCard.tsx`, `TaskChip.tsx`.
  - **Armadilha 3 (mais sutil)**: o mapeamento direto `bg-white→bg-zinc-900` e
    `bg-zinc-50→bg-zinc-800` inverteu a relação de profundidade que existia no tema
    claro (lá, container=`zinc-50` mais escuro que o card=`white`; depois da troca
    ingênua, container=`zinc-800` ficou **mais claro** que o card=`zinc-900`, invertendo
    o efeito "card destacado sobre o fundo do container"). Corrigi com uma segunda
    passada trocando `bg-zinc-900 ↔ bg-zinc-800` (swap) em todos os arquivos, o que
    resolveu de uma vez tanto o `KanbanColumn`/`TaskCard` quanto o esmaecimento dos dias
    fora do mês no `DayCell.tsx`. Também tive que ajustar manualmente a borda dos grids
    de dia (`DayCell.tsx`/`TaskCalendarDayCell.tsx`) de `border-zinc-800` pra
    `border-zinc-700`, já que depois do swap ela ficou da mesma cor do card (invisível).
  - Encontrei também um `text-zinc-800` perdido no `TaskChip.tsx` (cor de texto escura
    que nenhuma regra cobria, sobrou do código original em tema claro) — texto ficaria
    invisível num card escuro. Corrigido pra `text-zinc-200` ao reescrever o componente.
- **Logo**: trocado para a variante "fundos escuros" do brandbook
  (`SIFORMA SEM  (6).png` → `public/siforma-logo-dark.png`), usada agora no `TopNav`.
- **PostCard redesenhado** (`components/calendario/PostCard.tsx` +
  `lib/postStyles.ts`): card passou a ter fundo escuro uniforme (não mais tingido por
  canal); `CORES_CANAL` agora só define cor de **texto** (laranja/azul/vermelho) pro
  nome do canal; `CORES_FORMATO` agora define `{ barra, texto }` — uma barrinha fina
  (`h-1 w-7 rounded-full`) no topo do card com cor própria por formato (cinza=Feed,
  violeta=Stories, rosa=Reels, âmbar=Carrossel, teal=Enquete, índigo=Quiz,
  ciano=Caixa de perguntas), igual ao estilo do print de referência.
- **TaskChip e calendário semanal redesenhados** seguindo a referência: dia atual com
  borda superior verde-oliva (2px) + texto do cabeçalho em oliva; fins de semana com
  fundo ligeiramente mais escuro (`bg-zinc-900/60`) pra parecer "menos relevante"; ícone
  de check verde (SVG inline) substituindo o ponto de prioridade quando a tarefa está
  concluída; **avatar do responsável só aparece quando o filtro é "Todos os
  responsáveis"** (`mostrarResponsavel` prop, passada de `app/tarefas/page.tsx` →
  `TaskCalendarGrid` → `TaskCalendarDayCell` → `TaskChip`) — fica redundante mostrar
  avatar quando já filtrou pra uma pessoa só, igual ao board "Tarefas Victoria" do
  Notion que não mostra avatar nenhum.
- Removido `CORES_TIPO` (e os tokens `--color-produto-*`/`lancamento-*`/`evento-*`/
  `naoproduto-*` em `globals.css`) de `lib/postStyles.ts` — ficou morto depois que o
  card passou a colorir por canal em vez de por tipo (o campo `tipo` continua existindo
  no schema/modal/filtro, só não tem mais cor associada).

**5. Testes**
- `npm run lint` e `npm run build` passaram limpos depois de cada rodada.
- Validação visual feita com Playwright/Chrome headless (ver item 3), inclusive
  conferindo as 3 cores de canal, as 7 cores de formato, o destaque do dia atual, tarefa
  atrasada (borda vermelha), tarefa concluída (check + tachado), e a troca de avatar
  visível/oculto ao mudar o filtro de responsável — tudo com dados de teste inseridos e
  removidos via REST API do Supabase.

**6. Pendente / observações pro futuro**
- Ver bullets atualizados em "Pendências" no topo deste arquivo (cores por canal ainda
  não vistas com dados reais de LinkedIn/YouTube; tema escuro é hardcoded, não tem
  toggle nem variante clara).

### Sessão 1 — 2026-06-17

**Contexto**: pedido inicial veio como um prompt grande e detalhado (em português) para
construir uma aplicação de calendário editorial/marketing para a Siforma (distribuidora
de ferragens — marcas SI Line, OPK Perfect, HAWA), estilo Trello/Asana, com 3 abas.

**1. Build inicial do projeto**
- Máquina (`/Users/rebep1`, fora de qualquer repo git) não tinha Node, npm nem
  Homebrew. Instalei `nvm` (script oficial via curl) e Node LTS (v24.16.0) por cima.
- Criado projeto em `~/siforma-calendario` via `create-next-app` (TypeScript, Tailwind,
  App Router, sem `src/`, import alias `@/*`). Next.js veio na versão 16.2.9 (mais
  recente disponível; pedido original dizia "14+").
- Dependências extras instaladas: `@supabase/supabase-js`, `@dnd-kit/core`,
  `@dnd-kit/sortable`, `@dnd-kit/utilities`, `date-fns`, `uuid`.

**2. Schema e seed do Supabase**
- `supabase/migrations/0001_init.sql`: 3 tabelas (`posts`, `tarefas`, `metas`), enums
  Postgres nativos para cada campo categórico, RLS aberto (`using (true) with check
  (true)`) em todas — sem autenticação, conforme pedido.
- Seed de 44 posts do calendário editorial (jun–set/2026) na tabela `posts`. O pedido
  original só dava a *semana* de cada post, não a data exata — calculei as datas
  manualmente usando `date -j -f "%Y-%m-%d"` no bash para confirmar dia da semana, e
  distribuí em padrão Terça/Quinta/Sábado (3 posts/semana) ou Terça/Sábado (2
  posts/semana), respeitando as datas explícitas que o pedido já dava (ex: evento
  Formobile 29/jun–3/jul, Segunda a Sexta).
- Tabelas `tarefas` e `metas` propositalmente sem seed (pedido explícito do usuário).

**3. As 3 abas**
- `app/page.tsx` (Calendário Editorial, rota padrão `/`): grid mensal calculado com
  `date-fns` (semana começa segunda), navegação de mês, drag-and-drop de posts entre
  dias via `@dnd-kit` (`DndContext` + `useDraggable`/`useDroppable`), modal lateral de
  edição (`components/calendario/PostModal.tsx`), badges "NOVO" e "✓ vídeo já feito",
  filtros por canal/tipo/formato, botão "+ Adicionar post" geral e "+ Novo post" por dia.
- `app/tarefas/page.tsx`: board Kanban com 4 colunas fixas (A Fazer, Em Andamento, Em
  Revisão, Concluído), drag-and-drop entre colunas, avatar com inicial colorida
  (`lib/avatar.ts`, cor determinística por soma de char codes), prazo atrasado em
  vermelho, indicador de prioridade por cor.
- `app/metas/page.tsx`: cards com barra de progresso (vermelho <30%, amarelo 30–70%,
  verde >70%), modal de criação/edição.
- Paleta de cores por `tipo` de post (produto/lançamento/evento/não-produto) definida
  como tokens Tailwind v4 customizados em `app/globals.css` (`@theme inline`), ex:
  `bg-produto-bg`, `border-produto-border`, `text-produto-text`.
- Fonte trocada de Geist (padrão do create-next-app) para Inter, conforme pedido.

**4. Decisões técnicas notáveis**
- `lib/supabase.ts` usa URL/key placeholder como fallback quando as env vars não estão
  configuradas — sem isso, o `next build` quebra no SSR (o client do Supabase lança
  erro síncrono se `supabaseUrl` for vazio), já que as páginas são client components mas
  ainda passam por uma prerender pass no build.
- Tive que desabilitar a regra `react-hooks/set-state-in-effect` no
  `eslint.config.mjs` — é uma regra nova (parte do React Compiler, vem junto no
  `eslint-plugin-react-hooks` v7 usado pelo Next 16) que reclama do padrão clássico
  "fetch no mount via `useEffect` + `setState`". Decisão consciente: o projeto não usa
  SWR/React Query, então esse padrão é o correto aqui, não um bug.
- Tive que reordenar declarações de função antes do `useEffect` que as chama em
  `app/page.tsx`, `app/tarefas/page.tsx` e `app/metas/page.tsx` por causa de outra regra
  nova (`react-hooks/immutability`) que reclamava de "uso antes da declaração" mesmo
  com hoisting de function declaration — comportamento inconsistente entre arquivos
  parecidos, então normalizei todos para declarar antes de usar.

**5. Pipeline de deploy (guiado passo a passo com o usuário)**
- **Supabase**: usuário criou o projeto e rodou a migration `0001_init.sql` manualmente
  no SQL Editor do painel. A anon key fornecida pelo usuário já contém o `ref` do
  projeto no payload do JWT — decodifiquei via `base64 -d` para derivar a Project URL
  sem precisar perguntar de novo.
- **GitHub**: usuário criou o repo `rebepiha/siforma-calendario` (público). Primeira
  tentativa de autenticação com um *fine-grained* Personal Access Token falhou com 403
  no `git push` — a permissão "Contents" não estava de fato como "Read and write"
  apesar da API reportar `push: true` no nível do usuário (esse campo reflete a
  permissão do usuário no repo, não o escopo do token). Resolvido trocando para um
  token *classic* com scope `public_repo`, que funcionou de primeira. Credencial
  guardada no `osxkeychain` via `git credential approve`.
- **Vercel**: usuário importou o repo pelo dashboard, mas esqueceu de configurar as
  env vars antes do primeiro deploy — o build ficou usando o fallback placeholder do
  `lib/supabase.ts` (detectei isso baixando os chunks JS do site e fazendo `grep` por
  `placeholder.supabase`). Como o usuário teve dificuldade para achar a tela de env
  vars/redeploy no dashboard, ele pediu para eu fazer tudo via terminal: usei a Vercel
  CLI (`npx vercel`) com um token temporário fornecido por ele — `vercel link
  --project=siforma-calendario`, depois `vercel env add` (uma vez por ambiente:
  production/preview/development, já que o CLI não aceita múltiplos ambientes em uma
  única chamada) para as duas variáveis, e por fim `vercel --prod` para o redeploy.
  Confirmei o sucesso baixando os chunks JS de novo e checando que a URL real do
  Supabase estava embutida (e o placeholder não).
- Depois desse setup inicial, pushes subsequentes no GitHub disparam auto-deploy no
  Vercel normalmente (confirmado na sessão ao push da mudança de canal/formato).
- Lembrei o usuário de revogar os tokens do GitHub e do Vercel depois de usados (eram
  de curta duração/uso único).

**6. Redefinição de `canal` e `formato` (mesma sessão, depois do deploy inicial)**
- Pedido do usuário: `canal` deveria representar a rede social (Instagram/LinkedIn/
  YouTube) em vez de feed/story; e `formato` deveria incluir "feed" e "stories" junto
  com os formatos que já existiam (reels, carrossel, enquete, quiz, caixa de
  perguntas). Também pedido um filtro adicional por formato.
- Mudei `lib/types.ts` (`Canal` e `Formato`), `lib/postStyles.ts` (novo
  `LABEL_CANAL`, `LABEL_FORMATO` atualizado), `components/calendario/PostCard.tsx`
  (ícone de "story" agora depende de `formato === "stories"`, não mais de `canal`; card
  agora mostra "Instagram · Feed" em vez de só "Feed"), `components/calendario/
  PostModal.tsx` (select de canal vira Instagram/LinkedIn/YouTube),
  `components/calendario/Filtros.tsx` (novo terceiro filtro por formato), e
  `app/page.tsx` (lógica de filtro estendida).
- `supabase/migrations/0001_init.sql` foi **editado direto** (não é mais histórico
  imutável — reflete o schema correto para instalações novas do zero) para já nascer
  com os enums certos (`canal_enum`: instagram/linkedin/youtube; `formato_enum`:
  feed/stories/reels/carrossel/enquete/quiz/caixa_perguntas).
- Como o banco do usuário **já estava em produção** com o schema antigo e 44 posts
  cadastrados, criei `supabase/migrations/0002_canais_e_formatos.sql` — usa `ALTER TYPE
  ... RENAME VALUE` (`feed`→`instagram`, `story`→`youtube`, `post`→`feed`,
  `story_estatico`→`stories`) em vez de `UPDATE`, porque renomear o *label* de um valor
  de enum no Postgres atualiza automaticamente todas as linhas que já usam aquele
  valor (o enum é armazenado por OID internamente, não por texto) — zero risco de
  perda de dados e não precisa de `UPDATE` manual. Usuário rodou no SQL Editor; validei
  via REST API (`select=canal,formato` em todos os posts) que os valores migraram
  certo. Notei de passagem um post de teste ("Teste") que ficou com `canal = youtube`
  — sobra de um teste manual do usuário na aplicação, sem problema.
- Commitei e fiz push (`git commit` + `git push`); o auto-deploy do Vercel via GitHub
  disparou sozinho. Confirmei no site ao vivo (`curl` + grep no HTML) que os textos
  "Instagram", "LinkedIn", "YouTube" e "Todos os formatos" apareciam.

**7. Este arquivo de handoff**
- Usuário pediu um arquivo de handoff para ser lido no início de toda sessão futura e
  atualizado em detalhe no fim de toda sessão. Criei este `HANDOFF.md` e adicionei
  instrução permanente no `CLAUDE.md` do projeto para que isso aconteça automaticamente.
