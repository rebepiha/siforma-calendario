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

- **⚠️ Risco conhecido: sessões paralelas no mesmo repositório** (ver Sessão 8). Já
  aconteceu de duas sessões de agente trabalharem nesse projeto ao mesmo tempo (provavelmente
  o usuário com duas janelas/dispositivos abertos) e ambas commitarem/pusharem pro mesmo
  `main`, gerando 13 commits divergentes que tiveram que ser descartados via
  `git push --force` (a pedido do usuário, que não soube confirmar a origem da outra
  sessão). Se no início de uma sessão `git fetch` mostrar commits em `origin/main` que não
  fazem sentido com o que está documentado aqui, **pare e avise o usuário antes de
  push/pull** — não dá pra saber se é trabalho real perdido ou outra sessão concorrente.
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
- **Header mais claro/destacado** (ver Sessão 21): `TopNav.tsx` foi de `bg-zinc-800`
  pra `bg-zinc-700` (e borda `border-zinc-700`→`border-zinc-600`) — usuário achou o
  header original pouco destacado do fundo da página. Textos secundários ajustados pra
  manter contraste no fundo mais claro: subtítulo "Calendário de Marketing"
  `text-zinc-600`→`text-zinc-300`, abas inativas `text-zinc-400`→`text-zinc-200`.
- **Cards "Stories"/"Feed" vazios mostram a etiqueta colorida normalmente** (Sessão 21
  tentou esconder essa barrinha nos posts placeholder sem conteúdo real, mas o usuário
  corrigiu na Sessão 23: não era isso que tinha pedido — a barrinha devia continuar
  aparecendo em todos os posts, vazios ou não. Revertido: `PostCard.tsx` não tem mais a
  variável `semConteudo`, a barrinha de etiqueta volta a renderizar sempre que o post
  tem etiquetas, sem exceção).
- **Favicon** (ver Sessão 16): `app/favicon.ico` (multi-resolução 16/32/48/64) e
  `app/icon.png` (512×512) são o ícone de calendário (fundo verde-oliva no topo, corpo
  branco, grade preta) que o usuário forneceu como PNG com fundo branco — removi o fundo
  via flood-fill a partir das bordas (preservando o branco interno do calendário, que é
  uma região fechada separada do fundo pela borda preta) usando Pillow/numpy num script
  Python ad-hoc (não ficou nada salvo no repo, só os PNGs/ICO finais). Os dois arquivos
  juntos cobrem navegadores antigos (`.ico`) e modernos (`.png`); o Next.js App Router já
  detecta os dois automaticamente pela convenção de nome de arquivo em `app/`, sem
  precisar editar `app/layout.tsx`.
- **Etiquetas dos posts** (ver Sessão 3): o antigo campo fixo `formato` (enum) foi
  substituído por um sistema de etiquetas livre estilo Trello — tabelas `etiquetas`
  (nome + cor) e `post_etiquetas` (relação N:N), gerenciável dentro do modal de editar
  post (`components/calendario/EtiquetaPicker.tsx`). Equipe pode criar, renomear,
  recolorir e excluir etiquetas livremente; cada post pode ter várias.
- **Convenção de cor por etiqueta** (ver Sessão 7): a pedido do usuário, "Stories" é
  laranja (`#f97316`), "Feed" é amarelo (`#eab308`) e existe uma etiqueta "Formobile"
  verde (`#22c55e`) usada pra marcar todos os posts relacionados ao evento/campanha
  Formobile (27/jun–3/jul), além da etiqueta de formato (Stories/Feed/Reels/etc.) de
  cada post. Não é uma regra hardcoded no código — é só convenção de uso que o usuário
  pediu pra manter ao criar/editar etiquetas e posts futuros; nada impede recolorir de
  novo pelo picker se quiserem.
- **Formato (Stories/Feed) aparece no título do card, não mais no nome do canal**
  (Sessões 14–15 revertidas/substituídas na Sessão 19): o usuário achou o card poluído
  com "Instagram - Stories"/"Instagram - Feed" coloridos (laranja/amarelo) competindo
  com a barrinha de etiqueta. Simplificado: o label do canal em `PostCard.tsx` voltou a
  ser sempre só `LABEL_CANAL[post.canal]` na cor fixa de `CORES_CANAL` — Instagram
  passou por rosa vibrante (`text-pink-400`, Sessão 14) → rosa suave (`text-pink-300/80`,
  Sessão 20) → **neutro** (`text-zinc-400`, Sessão 22, sem nenhum tom de rosa) — usuário
  foi pedindo mais discrição em rodadas sucessivas até tirar a cor de identidade do
  canal completamente; LinkedIn (azul) e YouTube (vermelho) não foram tocados em
  nenhuma dessas rodadas. O formato passou a aparecer como prefixo do
  **título** — `"Stories- "` ou `"Feed: "` — só quando o post tem a etiqueta
  correspondente *e* o título ainda não começa com essa palavra (regex
  `/^(stories|feed)\b/i`, pra não duplicar em posts que a equipe já escreveu manualmente
  como "Stories - xyz"). É só uma transformação de exibição (`prefixoFormato` calculado
  em `PostCard.tsx`) — o `post.titulo` salvo no banco não é alterado.
- **Tarefa recorrente "Programar posts do fim de semana"** (ver Sessão 17): existe uma
  linha em `tarefas` pra cada sexta-feira de 19/jun a 18/set/2026 (14 no total, mesmo
  responsável Victoria/prioridade média/coluna a_fazer da que já existia em 19/jun) — não
  é uma recorrência automática no código, foram inseridas manualmente via REST API como
  linhas independentes. Se quiserem mais sextas além de 18/set, é preciso inserir mais
  linhas (não há lógica de "repetir toda sexta" rodando em background).
- **Posts "Stories" vazios em todo dia sem Stories (próx. 3 meses)** (ver Sessão 17): 80
  posts genéricos (`titulo: "Stories"`, canal Instagram, tipo produto, etiqueta Stories)
  foram inseridos pra cobrir todo dia de 18/jun a 18/set/2026 que não tinha post com
  etiqueta Stories ainda (13 dias já tinham, principalmente a semana do Formobile —
  esses não foram duplicados). É conteúdo placeholder pra equipe preencher/editar
  depois, não conteúdo real. Mesma observação: inserção pontual via API, não é uma
  regra/cron rodando — não vai continuar gerando novos posts automaticamente além de
  18/set.
- **Tarefa "Atendimento nas redes sociais" como primeiro card do dia (próx. 3 meses)**
  (ver Sessão 18): inserida pra todo dia de 18/jun a 18/set/2026, exceto 18/jun e 19/jun
  (que já tinham uma tarefa quase idêntica, "Atendimento redes sociais", criada pela
  equipe). Como a vista Calendário de Tarefas ordena por `criado_em` (não por `prazo`
  nem pela coluna `ordem`, que existe na tabela mas não é usada pelo código — ver
  Sessão 8), garantir "primeiro card do dia" exigiu setar `criado_em` artificialmente
  antes de qualquer outra tarefa real daquele dia, não só inserir a linha. **Erro
  cometido e corrigido na hora**: a primeira tentativa setou `criado_em` como
  `"{prazo}T00:00:01"` (meia-noite do dia do prazo) — parecia razoável, mas como tarefas
  reais são todas criadas "hoje" (18/jun) independente de pra qual dia futuro são, uma
  tarefa com prazo em julho/agosto/setembro acabava com `criado_em` cronologicamente
  *depois* das tarefas reais (criadas hoje), não antes — resultado: aparecia por
  último, não primeiro. Corrigido com um `UPDATE` em massa setando `criado_em` pra um
  valor sentinela bem no passado (`2026-01-01T00:00:00Z`, antes de qualquer tarefa real
  do projeto) pra todas as 91 linhas dessa tarefa, garantindo que sempre ordene primeiro
  independente de quando as outras tarefas do mesmo dia foram criadas. Validado
  visualmente em dias que já tinham outras tarefas (22/jun, 26/jun, 28/jun) antes de
  considerar resolvido. **Restrita a dias de semana na Sessão 19**: usuário pediu pra
  essa tarefa só entrar de segunda a sexta — apaguei as 26 linhas que tinham caído em
  sábado/domingo dentro da janela de 3 meses (sobraram 65 de 91).
- **Bolinha de prioridade sem cor em Tarefas** (ver Sessão 19): `TaskChip.tsx` não tinge
  mais o círculo não-marcado pela cor de prioridade (`COR_PRIORIDADE` removido) — agora é
  sempre um círculo neutro `border-zinc-500`, igual ao padrão do `PostCard.tsx`. Pedido
  do usuário pra reduzir poluição visual; a prioridade da tarefa continua existindo no
  banco (`prioridade`) e editável no modal, só não tem mais indicação visual de cor no
  card.
- **Calendário mostra dias de outros meses** (ver Sessão 7): a grade volta a preencher a
  primeira/última semana com dias do mês anterior/seguinte (revertendo a decisão da
  Sessão 3 de escondê-los) — mas agora aparecem esmaecidos (`opacity-60`, fundo
  `bg-zinc-900/60`, número em `text-zinc-600`) com os posts reais daquela data, em vez de
  vazios. Todo `DayCell` (dentro ou fora do mês) agora tem altura fixa (`h-[130px]
  sm:h-[150px]`, antes era `min-h` e crescia com a quantidade de posts) — usuário pediu
  "quadrados do mesmo tamanho". Dias muito cheios (3+ posts, ex: 30/jun na semana do
  Formobile) mostram scroll interno dentro do próprio quadrado em vez de esticar a
  célula — confirmado com o usuário que esse comportamento é aceitável (ver Sessão 7).
- **Calendário Editorial — layout simples (revertido na Sessão 6)**: o redesign em 3
  colunas (sidebar + calendário + painel de detalhe) feito na Sessão 4 e o redesign de
  card da Sessão 5 foram **revertidos a pedido do usuário**, que mandou um print
  mostrando o visual antigo e pediu pra voltar exatamente a ele. Layout atual: filtros
  em dropdown único-seleção (`components/calendario/Filtros.tsx` — canal/tipo/etiqueta),
  grade do mês em coluna única ocupando a largura central (`max-w-7xl` centralizado, não
  mais tela cheia), clique no card abre direto o modal de edição de sempre (não há mais
  conceito de "post selecionado" separado de "post em edição"). Ver Sessão 6 para a
  lista exata de arquivos revertidos/removidos e o que ficou só no banco (não na UI).
- **Criar post: clicar em qualquer parte do quadrado do dia** (ver Sessão 10), não só num
  botão "+ Novo post" que só aparecia no hover (removido). `DayCell.tsx` tem `onClick` no
  container inteiro chamando `onNovoPost(dataStr)`; `PostCard.tsx` chama
  `e.stopPropagation()` no próprio `onClick` pra clicar num post existente abrir a edição
  dele em vez de também disparar a criação de um novo (o clique bolha do filho pro pai por
  padrão no React/DOM, então sem o stopPropagation os dois disparariam juntos).
- **Modal de post salva automaticamente ao fechar** (ver Sessão 10) — não existe mais
  botão "Salvar" separado de "Cancelar"; fechar pelo ✕, clicando fora (backdrop) ou pelo
  botão "Fechar" no rodapé chama a mesma função (`fecharSalvando` em
  `components/calendario/PostModal.tsx`), que salva se o título não estiver vazio, ou só
  fecha sem criar nada se estiver (evita posts vazios ao abrir "+ Adicionar post"/clicar
  num dia e fechar sem digitar nada). Editar um campo e fechar sem clicar em nada mais já
  persiste a mudança.
- **Marcar concluído/publicado direto no card** (Sessão 8, estendido na Sessão 9): em
  Tarefas (`TaskChip.tsx` — vista Calendário e a caixa "Sem prazo definido" — e também
  `TaskCard.tsx` do board Kanban, desde a Sessão 9) e no Calendário Editorial
  (`PostCard.tsx`), tem um botão pequeno no canto esquerdo do card (ponto de prioridade ou
  círculo vazio) que alterna o status sem abrir o card — em tarefas, alterna entre a coluna
  atual e `concluido` (some pra `a_fazer` se desmarcado); em posts, alterna `status` entre
  `publicado` e `pendente`. Usa `e.stopPropagation()` pra não disparar o clique do
  card/abrir o modal. Card inteiro fica com `opacity-60` quando concluído/publicado (em
  Tarefas já era assim desde a Sessão 8; faltava em `PostCard.tsx`, corrigido na Sessão 9
  depois que o usuário confirmou que esperava o mesmo efeito de transparência lá também).
  **Aparência do círculo não marcado** (corrigido na Sessão 12): em Tarefas
  (`TaskChip.tsx`/`TaskCard.tsx`) o círculo de prioridade era preenchido (`bg-*`), idêntico
  ao indicador de prioridade que já existia antes de qualquer checkbox — visualmente
  indistinguível de algo não clicável, por isso o usuário não tinha percebido que o
  checkbox já funcionava (confirmei via bundle de produção que o código já estava lá
  desde a Sessão 8/9, era só questão de aparência). Troquei pra um círculo vazio com
  borda colorida (`border-2 border-*` em vez de `bg-*`), igual ao padrão que o
  `PostCard.tsx` já usava — agora lê visualmente como um checkbox de verdade nos dois
  lugares.
- **Tarefas de Marketing não tem mais Kanban** (ver Sessão 13) — só existe a vista
  Calendário agora; o toggle Calendário/Kanban (introduzido na Sessão 8) foi removido a
  pedido do usuário, junto com os componentes que só serviam a ela
  (`KanbanColumn.tsx`/`TaskCard.tsx`, apagados — não são mais referenciados em lugar
  nenhum). `lib/types.ts` (`ColunaTarefa`/`COLUNAS_TAREFA`) continua existindo porque o
  campo `coluna` da tarefa ainda é usado internamente (o checkbox de concluir alterna
  entre `a_fazer`/`concluido`) e o `TaskModal.tsx` ainda tem um `<select>` manual de
  Coluna — só não há mais um quadro visual Kanban pra arrastar entre colunas.
- **Cards de tarefa permitem 2 linhas de título** (ver Sessão 13): `TaskChip.tsx`
  (Tarefas, vista Calendário) trocou `truncate` (1 linha, corta com "...") por
  `line-clamp-2` + `min-h-[2.5rem]` no título — títulos longos quebram em até 2 linhas em
  vez de cortar na primeira, e todo card reserva a mesma altura (2 linhas) independente do
  tamanho do título, pra manter os cards visualmente uniformes dentro de cada dia.
- **Tamanhos de fonte/card ajustados na Sessão 9**: `PostCard.tsx` (Calendário Editorial)
  ficou mais compacto (título `text-sm`→`text-xs`, textos secundários `11px`/`10px`→`10px`/
  `9px`, menos padding/gap) pra caber mais posts visíveis por dia sem precisar do scroll
  interno (ver bullet sobre altura fixa dos dias, Sessão 7) — pedido explícito do usuário
  ("aparecer mais detalhes em cada dia"). Já o `TaskChip.tsx` (Tarefas, vista Calendário)
  foi na direção contrária — aumentado (`text-xs`→`text-sm`, mais padding/gap) a pedido do
  usuário. São ajustes de gosto/densidade independentes entre as duas páginas, não uma
  regra geral — se pedirem mais ajuste fino de tamanho no futuro, é só variar essas mesmas
  classes Tailwind.
- **Tarefas (vista Calendário) ganhou os mesmos padrões do Calendário Editorial** (ver
  Sessão 11): colunas de Sábado/Domingo mais estreitas que as de dia de semana
  (`TaskCalendarGrid.tsx`, `grid-cols-[1.4fr_1.4fr_1.4fr_1.4fr_1.4fr_0.5fr_0.5fr]` em vez
  de `grid-cols-7` uniforme — pedido do usuário porque fim de semana raramente é usado);
  clicar em qualquer parte do quadrado do dia cria uma tarefa nova (`TaskCalendarDayCell.tsx`,
  mesmo padrão do `DayCell.tsx` do Calendário Editorial — botão "+ Nova" que só aparecia no
  hover foi removido); `TaskModal.tsx` salva automaticamente ao fechar (✕, clique fora ou
  botão "Fechar"), sem botões separados de Cancelar/Salvar, mesma função `fecharSalvando`
  que o `PostModal.tsx` já tinha desde a Sessão 10. Não toquei no Kanban (`TaskCard.tsx`/
  `KanbanColumn.tsx`) nem na caixa "Sem prazo definido" — só a vista Calendário, que foi o
  que pediram.
- **Sem autenticação**: acesso por link aberto. RLS habilitado nas 3 tabelas mas com
  política `using (true) with check (true)` (qualquer um com o link lê/escreve).
- **Ambiente local**: máquina não tinha Node/npm/Homebrew — Node foi instalado via `nvm`
  (`export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"`
  precisa rodar antes de qualquer comando `npm`/`npx` em sessão de terminal nova).

## Pendências / próximos passos conhecidos

- Nenhuma pendência crítica — o app está funcional e no ar, cobrindo os 3 requisitos
  (Calendário Editorial, Tarefas de Marketing, Metas e Progresso).
- Tabela `metas` continua vazia por design (a equipe deve popular). `tarefas` tem 2
  linhas de teste ("teste"/"teste", responsável Victoria, sem descrição) criadas pela
  própria usuária explorando o app ao vivo na Sessão 5 — não foram criadas por mim,
  deixei como estavam; pode apagar quando quiser, não é dado real de produção.
- Os tokens de GitHub e Vercel usados para configurar o pipeline inicial foram de uso
  único/curta duração e devem ter sido revogados ou expirado — se uma sessão futura
  precisar fazer push ou alterar env vars/redeploy e a credencial salva não funcionar
  mais, será necessário pedir ao usuário um token novo (ver "Como autenticar" abaixo).
- Identidade do git neste repo está autodetectada (`rebep1@MacBook-Air-3.local`) em vez
  do nome/email reais do usuário — não corrigido ainda, não é bloqueante.
- Canal `linkedin` existe no schema mas ainda não tem nenhum post de exemplo usando-o
  (nem era pedido) — só fica disponível para quando a equipe quiser usar.
- **PostCard atual** (voltou ao estilo da Sessão 3 depois do revert da Sessão 6): fundo
  translúcido (`bg-white/10` + `backdrop-blur-sm`, efeito da Sessão 4) mantido, mas sem
  checkbox e sem avatar de responsável. Mostra: barrinhas curtas coloridas por etiqueta
  (uma por etiqueta do post, todas, não só a principal), nome do canal em texto colorido
  (`CORES_CANAL[canal].text`), título, categoria (se houver) e badges "NOVO"/"✓ vídeo já
  feito". Não tem mais checkbox de publicado nem indicação de status no card — status só
  é editável dentro do modal (campo `<select>`).
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
- **Arquivos anexados ao post**: nunca foi implementado (precisaria de um bucket no
  Supabase Storage, configuração manual). Já era pendente antes da Sessão 4 ter
  desenhado um lugar pra isso (painel de detalhe); como esse painel foi removido na
  Sessão 6, não há mais nem um lugar na UI planejado pra essa seção — se for retomado,
  precisa decidir de novo onde mostrar (provavelmente dentro do próprio modal de edição,
  já que não há mais painel fixo).
- **`responsavel` e `checklist` dos posts**: colunas continuam existindo no banco
  (migration 0004) e a tabela `campanhas` também (migration 0005) — só não tem mais
  nenhuma tela que leia ou escreva esses dados desde o revert da Sessão 6 (não fazem
  parte do tipo `Post` em `lib/types.ts` atualmente). Os dados que já existiam (ex:
  campanha "Formobile" com data 30/jun–3/jul) não foram apagados, só ficaram
  inacessíveis pela UI. Se uma sessão futura quiser essas funcionalidades de volta,
  reintroduzir os campos no tipo e desenhar onde exibi-los (não recriar
  necessariamente o layout de 3 colunas da Sessão 4 — perguntar ao usuário antes).

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

### Sessão 23 — 2026-06-18

**Contexto**: usuário apontou um erro meu — "não era pra tirar a etiqueta colorida de
cima, e sim a cor rosa do texto Instagram". Reli o histórico: o pedido da Sessão 21
("tire as etiquetas coloridas dos cards de stories que não tem conteúdo") eu tinha
interpretado e implementado literalmente (esconder a barrinha só nos posts placeholder
vazios), mas o usuário considerou isso errado — o que ele queria mesmo, nessa direção
de simplificação, era só a cor do texto "Instagram" (resolvido depois, Sessões 20 e 22),
não a remoção da barrinha de etiqueta dos cards vazios.

**1. Revert**
- `components/calendario/PostCard.tsx`: removida a variável `semConteudo` e a condição
  `!semConteudo` que escondia a `<div>` das barrinhas de etiqueta. A barrinha volta a
  aparecer em todo post que tem etiquetas, inclusive os placeholders "Stories"/"Feed"
  vazios da Sessão 17 — exatamente como era antes da Sessão 21.
- Não toquei na cor do texto "Instagram" (`lib/postStyles.ts`), que já está neutra
  (`text-zinc-400`) desde a Sessão 22 e continua correta.

**2. Testes**
- `npm run lint` e `npm run build` limpos. Confirmei visualmente que todo card "Stories"
  (vazio ou não) voltou a mostrar a barrinha laranja, e que "Instagram" continua
  neutro. Usuário confirmou ("sim") que ficou certo antes de eu seguir pro commit.

**3. Pendente**
- Nada novo. Mudança ainda não commitada — perguntar antes de commitar/push.

### Sessão 22 — 2026-06-18

**Contexto**: continuação direta da Sessão 21. Usuário pediu pra tirar completamente a
cor rosa da palavra "Instagram" no Calendário Editorial (terceira rodada nessa mesma
direção — Sessão 14 trocou de laranja pra rosa vibrante, Sessão 20 suavizou pra um rosa
mais claro, agora vira neutro).

**1. Mudança**
- `lib/postStyles.ts`: `CORES_CANAL.instagram.text` de `text-pink-300/80` para
  `text-zinc-400` — mesmo tom neutro usado em outros textos secundários do app. LinkedIn
  e YouTube não foram alterados.

**2. Testes**
- `npm run lint` e `npm run build` limpos. Confirmado visualmente via Playwright/Chrome
  headless.

**3. Pendente**
- Nada novo. Mudança ainda não commitada — perguntar antes de commitar/push.

### Sessão 21 — 2026-06-18

**Contexto**: dois pedidos rápidos: (1) header do app pouco destacado, pedido pra ficar
mais claro; (2) os cards placeholder de Stories (Sessão 17, sem conteúdo real ainda)
deveriam parar de mostrar a etiqueta colorida, que ficava sem sentido num card vazio.

**1. Header mais claro**
- `components/TopNav.tsx`: fundo `bg-zinc-800`→`bg-zinc-700`, borda
  `border-zinc-700`→`border-zinc-600`. Subi o contraste dos textos secundários pra
  acompanhar o fundo mais claro: subtítulo `text-zinc-600`→`text-zinc-300`, abas
  inativas `text-zinc-400`→`text-zinc-200` (aba ativa continua `bg-oliva text-white`,
  sem mudança).

**2. Esconder etiqueta colorida nos cards de Stories/Feed vazios**
- `components/calendario/PostCard.tsx`: nova variável `semConteudo` — `true` quando
  `post.titulo` (trim + lowercase) é exatamente `"stories"` ou `"feed"` (esses são os
  únicos títulos usados pelos 80 placeholders da Sessão 17). Quando `true`, a barrinha
  de etiqueta não renderiza, mesmo que o post tenha a etiqueta Stories/Feed anexada
  (continua tendo a etiqueta no banco, só não mostra a cor no card). Posts com título
  real (incluindo os que começam com "Stories"/"Feed" mas têm mais texto, ex: "Stories
  - Backstage Cobertura") não são afetados — a comparação é com o título completo, não
  prefixo.

**3. Testes**
- `npm run lint` e `npm run build` limpos.
- Playwright/Chrome headless: confirmei visualmente o header mais claro/contrastado, e
  que os cards genéricos "Stories" (ex: 19, 20, 21, 23, 25, 26/jun) não têm mais
  barrinha colorida, enquanto cards com conteúdo real (ex: "Stories - Backstage
  Cobertura" 28/jun, "Feed: SI Camarão..." 24/jun) continuam mostrando normalmente.

**4. Pendente**
- Nada novo. Mudanças ainda não commitadas — perguntar antes de commitar/push.

### Sessão 20 — 2026-06-18

**Contexto**: continuação direta da Sessão 19. Usuário achou o rosa do Instagram
(`text-pink-400`) ainda muito chamativo mesmo depois de simplificar o card, pediu um
rosa "mais neutro".

**1. Ajuste de cor**
- `lib/postStyles.ts`: `CORES_CANAL.instagram.text` de `text-pink-400` para
  `text-pink-300/80` (tom mais claro/suave do Tailwind, com 80% de opacidade) — fica
  visivelmente mais discreto contra o fundo escuro, sem perder a identificação de cor
  por canal.

**2. Testes**
- `npm run lint` e `npm run build` limpos. Confirmado visualmente via Playwright/Chrome
  headless antes de considerar pronto.

**3. Pendente**
- Nada novo. Mudança ainda não commitada — perguntar antes de commitar/push.

### Sessão 19 — 2026-06-18

**Contexto**: usuário mandou print do Calendário Editorial dizendo que estava "muito
poluído visualmente" (cards com barrinha de etiqueta + "Instagram - Stories/Feed"
colorido competindo) e pediu 3 ajustes em sequência: (1) simplificar o card —
"Instagram" sempre rosa, formato (Stories/Feed) move pro início do título; (2) a tarefa
"Atendimento nas redes sociais" (Sessão 18) só deveria valer de segunda a sexta, não fim
de semana; (3) tirar a cor laranja da bolinha de prioridade nas Tarefas, deixar neutra.

**1. Card do Calendário Editorial simplificado**
- `components/calendario/PostCard.tsx`: removida a lógica da Sessão 14/15 que mudava a
  cor do label do canal e acrescentava "- Stories"/"- Feed" nele. O label volta a ser só
  `LABEL_CANAL[post.canal]` na cor fixa (`CORES_CANAL`, rosa pro Instagram).
- Em troca, o formato agora aparece como prefixo do título: `prefixoFormato` é
  `"Stories- "` ou `"Feed: "` (separadores diferentes por formato, conforme pedido
  literal do usuário) quando o post tem a etiqueta correspondente. Pra evitar duplicar
  em posts que a equipe já escreve manualmente com prefixo (ex: "Stories - Ajustes
  finais..."), só adiciona o prefixo se o título **ainda não começar** com
  "stories"/"feed" (`/^(stories|feed)\b/i`, case-insensitive). Notei (não corrigi, é
  dado e não bug meu) que alguns posts com título "Reels: ..." têm etiqueta "Feed" em
  vez de "Reels" anexada — aparecem como "Feed: Reels: ..." na tela; é inconsistência de
  tagueamento de dado já existente, não introduzida por esta mudança.

**2. Tarefa "Atendimento nas redes sociais" só dias de semana**
- Calculei as 26 datas de sábado/domingo dentro da janela de 3 meses (18/jun–18/set) e
  apaguei via REST API as linhas dessa tarefa nesses dias (`DELETE` filtrando por
  `titulo` + `prazo IN (...)`). Sobraram 65 das 91 originais. Validado visualmente que
  sábado/domingo ficaram sem essa tarefa (ex: 27/jun vazio, 28/jun só com "Backstage
  Formóbile", sem duplicata).

**3. Bolinha de prioridade neutra em Tarefas**
- `components/tarefas/TaskChip.tsx`: removido `COR_PRIORIDADE` (mapa de cor por
  prioridade) — o círculo não-marcado agora é só `border-zinc-500`, sem variar de cor.
  Não toquei no campo `prioridade` em si (continua no banco/modal), só a indicação
  visual no card.

**4. Testes**
- `npm run lint` e `npm run build` limpos.
- Playwright/Chrome headless: confirmei visualmente o card simplificado (título com
  prefixo, canal sempre rosa), a ausência da tarefa em sábado/domingo numa semana de
  teste, e a bolinha neutra (sem laranja) nos cards de tarefa.

**5. Pendente**
- Nada novo. Mudanças ainda não commitadas — perguntar antes de commitar/push.

### Sessão 18 — 2026-06-18

**Contexto**: continuação direta da Sessão 17. Usuário pediu pra criar o card
"Atendimento nas redes sociais" como **primeiro card do dia**, todo dia, pelos próximos
3 meses também (mesmo padrão de preenchimento em massa das duas sessões anteriores).

**1. Levantamento antes de escrever**
- Já existia uma tarefa quase idêntica "Atendimento redes sociais" (sem "nas") em 18/jun
  e 19/jun, criada pela equipe — usei como template de campos (responsável Victoria,
  prioridade média, coluna a_fazer) mas não dupliquei esses 2 dias, só criei a partir de
  20/jun. Calculei o intervalo de 18/jun a 18/set (mesma janela de 3 meses das sessões
  anteriores) → 91 dias a preencher.

**2. Garantir "primeiro card do dia"**
- A vista Calendário de Tarefas ordena os cards pela ordem em que `carregarTarefas`
  busca os dados (`order("criado_em", { ascending: true })` em `app/tarefas/page.tsx`)
  — não existe ordenação manual nem uso da coluna `ordem` (que está na tabela desde a
  sessão de trabalho paralelo descartada na Sessão 8, mas nunca foi conectada a nenhuma
  lógica de exibição). Pra essa tarefa aparecer primeiro em dias que já têm outras
  tarefas, foi preciso inserir com um `criado_em` mais antigo que o das tarefas já
  existentes naquele dia, não bastava só criar a linha.
- **Errei na primeira tentativa**: setei `criado_em` como meia-noite do próprio `prazo`
  (ex: prazo 26/jun → `criado_em = 2026-06-26T00:00:01`). Parecia razoável mas estava
  errado — tarefas reais (ex: "Programar posts do fim de semana", "Ver resultados do
  patrocinado") foram todas *criadas* hoje (18/jun), só têm *prazo* no futuro. Meia-noite
  de um dia futuro é cronologicamente *depois* de "hoje às 14h", então minhas tarefas
  ordenavam por último, não primeiro — percebi isso só depois de inserir as 91 linhas e
  conferir visualmente no app (22/jun e 26/jun mostravam a tarefa nova no final).
- **Corrigido** com um único `UPDATE` em massa (`titulo=eq.Atendimento nas redes
  sociais`) setando `criado_em` pra `2026-01-01T00:00:00+00:00` (sentinela no passado,
  antes de qualquer `criado_em` real do projeto) em todas as 91 linhas de uma vez —
  mais simples que teria sido recalcular um valor por linha, e funciona porque o que
  importa é só estar *antes* das outras tarefas do mesmo dia, não ter uma data
  realista.

**3. Testes**
- Validei visualmente via Playwright/Chrome headless, antes e depois da correção: dias
  vazios (20/jun, 21/jun) trivialmente mostravam a tarefa nova como única; dias com
  outras tarefas (22/jun "Fechar reserva restaurante", 26/jun "Ver resultados do
  patrocinado" + "Programar posts do fim de semana", 28/jun "Backstage Formóbile")
  mostravam a tarefa nova por último antes da correção e primeiro depois. 18/jun e
  19/jun confirmados intocados (só a tarefa original "Atendimento redes sociais", sem
  duplicata).

**4. Pendente**
- Nada novo. Nenhuma mudança de código nesta sessão (só dados) — `HANDOFF.md` é a única
  mudança de arquivo; perguntar ao usuário se quer commit/push só da documentação.
- Mesma observação das sessões anteriores: isso não é uma recorrência automática, é
  inserção pontual. Passado 18/set, será necessário gerar mais linhas manualmente se
  pedirem continuidade.

### Sessão 17 — 2026-06-18

**Contexto**: dois pedidos de preenchimento de dados pros próximos 3 meses (sem mudança
de código): (1) em Tarefas, repetir o card "Programar posts do fim de semana" toda
sexta; (2) no Calendário Editorial, criar um card de Stories vazio em todo dia que ainda
não tem Stories.

**1. Tarefa recorrente de sexta**
- Consultei a tarefa real já existente "Programar posts do fim de semana" (prazo
  19/jun/2026, responsável Victoria, prioridade média, coluna a_fazer) pra usar como
  template. Calculei todas as sextas seguintes até completar 3 meses (26/jun a
  18/set/2026, 13 datas) e inseri uma linha por data via REST API, copiando os mesmos
  campos. Confirmei a contagem final (14 = 1 original + 13 novas) e testei visualmente
  navegando até a semana de 29/jun–5/jul, vendo a tarefa aparecer certo na sexta 3/jul.

**2. Stories vazios em todo dia sem Stories**
- Antes de escrever, levantei quantos dias dos próximos 3 meses já tinham um post com
  etiqueta "Stories" (13 dias, concentrados na semana do Formobile) — isso revelou que
  preencher "todo dia" significava ~80 posts novos, incluindo finais de semana. Como é
  uma escrita grande no calendário real, perguntei ao usuário antes de executar: (a) se
  o preenchimento valia pra todos os dias (incl. fim de semana) ou só dias úteis/dias
  que já têm outro post, e (b) qual título/canal usar no post vazio. Usuário confirmou:
  todos os dias incluindo fim de semana, título genérico "Stories" em Instagram.
- Gerei a lista dos 80 dias faltantes (18/jun–18/set, excluindo os 13 que já tinham),
  inseri um post por dia (`titulo: "Stories"`, canal instagram, tipo produto) via REST
  API em lote, e aplichei a etiqueta "Stories" em cada um dos 80 (`post_etiquetas`,
  `Prefer: resolution=ignore-duplicates` por segurança, embora não devesse haver
  conflito já que são posts novos).
- Validado visualmente: dias que antes estavam vazios (ex: 19, 21, 23, 25, 26 de junho)
  agora mostram um card "Instagram - Stories" / título "Stories"; dias que já tinham
  conteúdo específico de Stories (ex: "Stories - Backstage Cobertura" 28/jun) não foram
  duplicados, ficaram como estavam.

**3. Observação importante pra sessões futuras**
- Nenhuma das duas operações criou uma regra/recorrência automática no código — são só
  linhas inseridas pontualmente no banco via API. Se o usuário pedir "continue
  repetindo" depois de 18/set, vai ser necessário gerar e inserir mais linhas
  manualmente (ver bullets correspondentes em "Estado atual").

**4. Testes**
- Nenhuma mudança de código nesta sessão (só dados via REST API), então não houve
  lint/build a rodar. Validação foi só visual via Playwright/Chrome headless, como
  descrito acima.

**5. Pendente**
- Nada novo. `HANDOFF.md` é a única mudança de arquivo nesta sessão — perguntar ao
  usuário se quer commit/push só dessa atualização de documentação.

### Sessão 16 — 2026-06-18

**Contexto**: usuário mandou um PNG (ícone de calendário, fundo branco, traço preto,
faixa superior verde-oliva) pedindo pra usar como favicon, mas sem o fundo branco.

**1. Remoção de fundo**
- A máquina não tinha Pillow/numpy instalados — instalei via `pip3 install --user`
  (mesmo padrão de sessões anteriores com pymupdf/playwright).
- Não bastava trocar todo pixel branco por transparente — o corpo do calendário no
  próprio ícone também é branco, e uma troca ingênua removeria isso também, deixando só
  o contorno preto "flutuando". Resolvido com flood-fill (BFS) a partir das bordas da
  imagem: só os pixels brancos **conectados ao fundo externo** ficam transparentes; o
  branco interno do calendário, isolado do fundo pela linha preta do contorno, não é
  alcançado pelo flood-fill e continua opaco.
- Depois do flood-fill, recortei as margens transparentes pelo bounding box do conteúdo
  visível, adicionei uma margem pequena uniforme de volta, e completei pra um canvas
  quadrado (centralizado) antes de gerar os arquivos finais.

**2. Arquivos gerados**
- `app/icon.png` (novo, 512×512, PNG com alpha) — convenção do Next.js App Router,
  detectado automaticamente sem precisar tocar em `app/layout.tsx`.
- `app/favicon.ico` (sobrescrito, multi-resolução 16/32/48/64px) — primeira tentativa
  com Pillow só gerou um ICO de 16×16 porque usei `append_images` (que não é o parâmetro
  certo pra esse formato); corrigido chamando `.save(..., format="ICO", sizes=[...])`
  direto na imagem quadrada de alta resolução, que faz o Pillow gerar os 4 tamanhos
  internamente.

**3. Testes**
- `npm run build` confirmou a rota estática `/icon.png` gerada.
- Rodei o dev server e inspecionei as tags `<link rel="icon">` no HTML servido —
  confirmei as duas (`favicon.ico` 64×64 e `icon.png` 512×512) presentes. Baixei o
  `icon.png` servido e abri pra confirmar visualmente o fundo transparente (xadrez no
  visualizador) com o calendário intacto.

**4. Pendente**
- Nada novo. Mudanças ainda não commitadas — perguntar antes de commitar/push.

### Sessão 15 — 2026-06-18

**Contexto**: continuação direta da Sessão 14, mesma conversa, vários pedidos curtos em
sequência: (1) tag "NOVO" mais discreta e sem rosa; (2) cor do "Instagram - Formato"
deveria seguir a cor real da etiqueta (amarelo p/ Feed, laranja p/ Story) em vez de
sempre rosa; (3) diminuir a fonte das Tarefas de Marketing seguindo o padrão do
Calendário Editorial.

**1. Tag "NOVO" mais discreta**
- `components/calendario/PostCard.tsx`: trocado o badge `bg-badge-novo` (rosa
  `#d4537e`, pill sólido, texto branco em negrito, sombra) por um badge bem mais leve —
  fundo `bg-zinc-900`, borda fina `border border-zinc-600`, texto `text-zinc-400`
  `text-[8px]` `font-medium`, sem sombra. Como nada mais usava a classe `bg-badge-novo`,
  removi a variável `--color-badge-novo` de `app/globals.css` (`--color-badge-video`
  continua, é de outro badge ainda em uso).

**2. Cor do formato segue a etiqueta real**
- `components/calendario/PostCard.tsx`: o `<span>` do "Instagram - Formato" agora usa
  `style={{ color: etiquetaFormato.cor }}` quando existe uma etiqueta Stories/Feed no
  post (cor inline, igual ao padrão já usado nas barrinhas de etiqueta), em vez do rosa
  fixo da Sessão 14. O rosa (`CORES_CANAL.instagram.text`) só aparece agora como
  fallback, quando o post não tem etiqueta de formato nenhuma.

**3. Fonte das Tarefas reduzida (padrão do Calendário Editorial)**
- `components/tarefas/TaskChip.tsx`: título `text-sm font-medium` → `text-xs
  font-semibold text-zinc-100` (mesmo padrão do título do `PostCard.tsx`), `leading-5`→
  `leading-4` e `min-h-[2.5rem]`→`min-h-[2rem]` (recalculado pra 2 linhas de
  `leading-4`, mantendo o efeito de altura uniforme da Sessão 13). Avatar de
  responsável `h-4 w-4 text-[9px]` → `h-3.5 w-3.5 text-[8px]`, texto do responsável
  `text-[11px]` → `text-[10px]`. Padding do card `px-2.5 py-1.5` → `px-1.5 py-1` (igual
  ao `PostCard.tsx`). Ícone de check e círculo de prioridade também encolheram
  (`h-4 w-4`/`h-3 w-3` → `h-3 w-3`/`h-2.5 w-2.5`).

**4. Testes**
- `npm run lint` e `npm run build` limpos a cada mudança.
- Playwright/Chrome headless: confirmei visualmente que "Instagram - Stories" aparece
  em laranja e "Instagram - Feed" em amarelo (cores idênticas às barrinhas de etiqueta),
  que o "LinkedIn" sem etiqueta de formato continua na cor de fallback (azul, sem
  mudança), que os cards de Tarefas ficaram visivelmente mais compactos/uniformes, e
  criei um post de teste com "Produto novo" marcado pra confirmar visualmente a nova
  tag "NOVO" discreta (cinza, borda fina) — removido depois de confirmar.

**5. Pendente**
- Nada novo. Mudanças desta sessão ainda não commitadas — perguntar antes de
  commitar/push.

### Sessão 14 — 2026-06-18

**Contexto**: continuação direta da Sessão 13, mesma conversa. Usuário pediu pro
Calendário Editorial: mostrar o formato (Feed ou Story) ao lado de "Instagram" no topo
do card (ex: "Instagram - Stories"), manter a etiqueta laranja pra Stories e amarela pra
Feed (já era assim desde a Sessão 7, sem mudança necessária), e escrever essa
identificação "Instagram - Formato" em rosa em vez de laranja.

**1. Implementação**
- `components/calendario/PostCard.tsx`: nova variável `etiquetaFormato` — busca em
  `etiquetasDoPost` (etiquetas já resolvidas do post) uma com `nome === "Stories"` ou
  `nome === "Feed"`. Se achar, o label do canal passa a mostrar `` `${LABEL_CANAL[canal]} - ${etiquetaFormato.nome}` ``
  em vez de só o nome do canal; se o post não tiver nem Stories nem Feed (ex: só Reels,
  Carrossel, ou nenhuma etiqueta), mostra só o canal como antes.
- `lib/postStyles.ts`: `CORES_CANAL.instagram.text` de `text-orange-400` para
  `text-pink-400` — só o Instagram mudou (LinkedIn continua azul, YouTube continua
  vermelho), pra não conflitar visualmente com a cor laranja da etiqueta "Stories".

**2. Testes**
- `npm run lint` e `npm run build` limpos.
- Playwright/Chrome headless: confirmei visualmente que posts com etiqueta "Stories"
  mostram "Instagram - Stories" em rosa com a barrinha de etiqueta laranja, posts com
  "Feed" mostram "Instagram - Feed" em rosa com barrinha amarela, e posts sem nenhuma
  das duas (ex: o post de teste "LinkedIn / Post") continuam mostrando só o nome do
  canal, sem sufixo.

**3. Pendente**
- Nada novo. Mudanças desta sessão e da Sessão 13 (cards de 2 linhas + remoção do
  Kanban) ainda não commitadas — perguntar ao usuário antes de commitar/push.

### Sessão 13 — 2026-06-18

**Contexto**: dois pedidos rápidos sobre Tarefas de Marketing: (1) segunda a sexta devem
ter o mesmo tamanho e os cards podem ter 2 linhas de texto; (2) tirar a opção Kanban e
deixar só Calendário.

**1. Cards com 2 linhas de título, tamanho uniforme**
- As colunas de segunda a sexta já eram do mesmo tamanho entre si desde a Sessão 11
  (`1.4fr` cada, só sábado/domingo são menores) — confirmei visualmente que esse ponto já
  estava correto. O problema real era a altura inconsistente dos *cards*: título usava
  `truncate` (corta em 1 linha com "..."), então um card com título curto e outro com
  título longo (cortado) acabavam com a mesma altura "às custas" de esconder texto, mas
  qualquer card que tivesse uma segunda linha de conteúdo (ex: avatar de responsável)
  ficava maior que os outros.
- `components/tarefas/TaskChip.tsx`: título trocou `truncate` por `line-clamp-2` (permite
  quebrar em até 2 linhas, corta com "..." só se passar disso) e ganhou `min-h-[2.5rem]`
  (altura de 2 linhas a `leading-5`) — agora todo card reserva esse espaço, com título
  curto ou longo, então ficam visualmente do mesmo tamanho. Também troquei
  `items-center` por `items-start` na linha do checkbox+título, pra o círculo do checkbox
  alinhar com a primeira linha do texto em vez de centralizar no bloco de 2 linhas.

**2. Remoção do Kanban**
- `app/tarefas/page.tsx`: removido o estado `visualizacao`/tipo `Visualizacao`, os 2
  botões de toggle, a função `abrirNovaTarefa(coluna)` (só usada pelo Kanban) e
  `aoFinalizarArraste` (handler de drag do Kanban). O bloco de navegação de semana +
  filtro de responsável, que antes só aparecia se `visualizacao === "calendario"`, agora
  aparece sempre (é a única vista). `moverTarefa` continua existindo — não é mais
  chamado pelo drag do Kanban, mas o `alternarConcluida` (checkbox) depende dele.
- Apaguei `components/tarefas/KanbanColumn.tsx` e `components/tarefas/TaskCard.tsx`
  (confirmei via `grep` que não tinham mais nenhuma referência em lugar nenhum do
  projeto antes de apagar).
- `lib/types.ts` (`ColunaTarefa`, `COLUNAS_TAREFA`) **não** foi removido — o campo
  `coluna` da tarefa continua existindo no banco e sendo usado (checkbox alterna
  `a_fazer`↔`concluido`; `TaskModal.tsx` ainda tem um `<select>` manual de Coluna pra
  quem quiser usar "Em andamento"/"Em revisão" mesmo sem quadro visual).

**3. Testes**
- `npm run lint` e `npm run build` limpos.
- Playwright/Chrome headless: confirmei que o toggle Kanban desapareceu da UI (só sobrou
  o título "Tarefas de Marketing" + navegação de semana + filtro). Criei uma tarefa de
  teste com título bem longo numa segunda-feira vazia e confirmei visualmente que quebrou
  em 2 linhas com altura de card consistente com os outros cards da grade; apaguei a
  tarefa de teste depois.

**4. Pendente**
- Nada novo. Mudanças ainda não commitadas nesta sessão.

### Sessão 12 — 2026-06-18

**Contexto**: usuário reportou "as tarefas da Vitória continuam sem checkbox" depois da
Sessão 8/9 terem implementado exatamente essa feature (e testado funcionando via
Playwright em várias rodadas desde então).

**1. Diagnóstico**
- Baixei o HTML/JS da produção (`siforma-calendario.vercel.app/tarefas`) e busquei a
  string `"Marcar como concluída"` (aria-label que só existe se o código do checkbox
  estiver no bundle) — encontrei no chunk JS, confirmando que o deploy estava correto e
  a funcionalidade existia em produção. Então tirei um screenshot da produção real e
  comparei com o Calendário Editorial: o "checkbox" de tarefa era só uma bolinha
  preenchida da cor de prioridade — exatamente igual ao indicador de prioridade que
  já existia antes de qualquer um dos meus trabalhos nesse projeto (não-clicável,
  decorativo). Ou seja, o recurso **funcionava** (clicar de fato marcava
  concluído/movia de coluna), mas **não parecia clicável** — nada na aparência mudou em
  relação ao indicador antigo, então o usuário nunca percebeu que podia clicar ali. No
  Calendário Editorial isso não aconteceu porque o círculo não marcado já tinha uma
  borda visível (`border-2 border-zinc-500`), lendo como checkbox de verdade.

**2. Correção**
- `components/tarefas/TaskChip.tsx` e `TaskCard.tsx`: troquei `COR_PRIORIDADE` de
  classes `bg-*` (preenchimento sólido) pra `border-*` (cor só na borda), e o `<span>`
  do círculo não marcado virou `h-3 w-3 rounded-full border-2 bg-zinc-800
  hover:bg-zinc-700 ${COR_PRIORIDADE[...]}` — um círculo vazio com contorno colorido
  (cor de prioridade preservada, agora na borda em vez do preenchimento) e leve
  destaque ao passar o mouse. Visualmente passa a se parecer com um checkbox de
  verdade, igual ao padrão do `PostCard.tsx`.

**3. Testes**
- `npm run lint` e `npm run build` limpos.
- Playwright/Chrome headless: screenshot antes/depois confirmando a mudança visual nas
  duas vistas (Calendário e Kanban); cliquei no botão de uma tarefa real pra confirmar
  que o toggle ainda funciona (vira check verde + tachado), revertido depois.

**4. Pendente**
- Nada novo. Mudanças ainda não commitadas — perguntar antes de commitar/push.
- Lição pra sessões futuras: ao adicionar um elemento interativo que reaproveita o
  espaço/cor de um indicador puramente visual que já existia, vale conferir se a
  aparência também comunica "isso é clicável agora" — funcionar não é suficiente se
  nada muda visualmente em relação ao estado anterior não-interativo.

### Sessão 11 — 2026-06-18

**Contexto**: usuário pediu pra levar os padrões do Calendário Editorial (Sessão 10) pra
Tarefas de Marketing (vista Calendário, a padrão): clicar em qualquer lugar do dia pra
criar tarefa, autosave ao fechar o modal, checkbox+transparência (já existia desde a
Sessão 8/9, só confirmei que estava certo). Além disso, pediu pra Sábado/Domingo
ocuparem menos espaço na grade (raramente usados) e os cards dos outros dias ficarem
maiores, aproveitando o espaço.

**1. Colunas de fim de semana mais estreitas**
- `components/tarefas/TaskCalendarGrid.tsx`: troquei `grid-cols-7` (7 colunas iguais) por
  `grid-cols-[1.4fr_1.4fr_1.4fr_1.4fr_1.4fr_0.5fr_0.5fr]` — como o array `dias` sempre
  começa na segunda (`weekStartsOn: 1`), as 5 primeiras posições são sempre dia de semana e
  as 2 últimas são sempre sábado/domingo, então não precisei calcular nada dinâmico, só
  uma proporção fixa (segunda–sexta quase 3x mais largas que sábado/domingo). Isso já
  resolve o "aumente os cards dentro dos outros dias" — os `TaskChip` são `w-full` dentro
  da célula, então ficam automaticamente maiores com a coluna mais larga; não precisei
  aumentar fonte/padding de novo (já tinha sido aumentado na Sessão 9).

**2. Clicar em qualquer parte do dia cria tarefa**
- Mesmo padrão exato da Sessão 10 no Calendário Editorial: `TaskCalendarDayCell.tsx`
  ganhou `onClick={() => onNovaTarefa(dataStr)}` no container raiz, removi o botão
  "+ Nova" que só aparecia no hover (e a classe `group`, sem mais nenhum consumidor) e
  adicionei `cursor-pointer`/`hover:bg-zinc-800/70` (só quando não é fim de semana, pra não
  conflitar com o estilo já esmaecido do `ehFimDeSemana`). `TaskChip.tsx` ganhou
  `e.stopPropagation()` no `onClick` do card (não tinha desde a Sessão 8 — só o botão de
  concluir tinha) pra clicar numa tarefa existente abrir a edição dela em vez de também
  disparar a criação de uma nova por baixo.

**3. Autosave ao fechar o modal de tarefa**
- `components/tarefas/TaskModal.tsx`: mesma função `fecharSalvando` do `PostModal.tsx`
  (Sessão 10) — salva se o título não estiver vazio, senão só fecha. Os 3 pontos de
  fechamento (backdrop, ✕, botão do rodapé) chamam essa função; removidos os botões
  separados "Cancelar"/"Salvar", sobrou um "Fechar" único.

**4. Escopo: só a vista Calendário**
- Não toquei no Kanban (`TaskCard.tsx`, `KanbanColumn.tsx`) nem na caixa "Sem prazo
  definido" em `app/tarefas/page.tsx` — o pedido foi especificamente sobre a vista
  Calendário (onde sábado/domingo aparecem, e que é a vista padrão/de referência). O
  checkbox+transparência que o usuário mencionou já existia em todos os lugares desde as
  Sessões 8/9, não precisei mudar nada ali.

**5. Testes**
- `npm run lint` e `npm run build` limpos.
- Playwright/Chrome headless: confirmei visualmente que sábado/domingo ficam visivelmente
  mais estreitos que os dias de semana. Testei o fluxo completo de criar tarefa clicando
  no dia (segunda-feira vazia) → fechar sem digitar nada (não cria) → digitar título e
  fechar pelo ✕ sem clicar em nenhum botão de salvar (cria) → clicar na tarefa criada
  (abre "Editar tarefa", não "Nova tarefa" por cima) → excluir pelo botão de teste, sem
  deixar lixo no banco.

**6. Pendente**
- Nada novo. Mudanças ainda não commitadas — perguntar antes de commitar/push.

### Sessão 10 — 2026-06-18

**Contexto**: dois pedidos curtos sobre o Calendário Editorial: (1) clicar em qualquer
lugar do quadrado do dia deveria criar um post novo, não só num botão pequeno que só
aparece no hover; (2) salvar automaticamente ao sair da edição, sem precisar clicar em
"Salvar".

**1. Clicar em qualquer parte do dia cria post**
- `components/calendario/DayCell.tsx`: `onClick={() => onNovoPost(dataStr)}` movido pro
  container raiz do dia (antes só existia no botão "+ Novo post", que ficava
  `invisible`/só aparecia com `group-hover`). Removi esse botão e a classe `group` (não
  tinha mais nenhum outro consumidor de `group-hover`). Adicionei `cursor-pointer`,
  `hover:bg-zinc-800/70` (só quando dentro do mês, pra não conflitar com o estilo
  esmaecido dos dias de fora) e um `title` de tooltip explicando o clique.
- `components/calendario/PostCard.tsx`: o `onClick` do card (que já existia, abre edição)
  ganhou `e.stopPropagation()` — sem isso, clicar num post existente também disparava o
  `onClick` do `DayCell` pai (bubbling padrão do DOM), abrindo "Novo post" por cima da
  edição que devia abrir. O botão de status (checkbox) já tinha `stopPropagation` desde a
  Sessão 8, não precisou mudar.
- Testado que isso não interfere com o drag-and-drop existente (arrastar um post pra outro
  dia não abre o modal de "novo post" no dia de destino — confirmado via Playwright,
  simulando mouse down/move/up).

**2. Autosave ao fechar o modal de post**
- `components/calendario/PostModal.tsx`: nova função `fecharSalvando` — se
  `valores.titulo.trim()` não for vazio, chama `salvar()` (que já existia e fecha o modal
  via `onSalvar`/`setModalAberto(false)` no `app/page.tsx`); se estiver vazio, só chama
  `onFechar()` sem salvar (evita criar posts vazios ao abrir "+ Adicionar post" ou clicar
  num dia e desistir sem digitar nada). Os 3 pontos de fechamento (clique no backdrop, ✕
  no canto, botão do rodapé) agora chamam `fecharSalvando` em vez de `onFechar` direto.
- Removidos os botões separados "Cancelar" e "Salvar" do rodapé — sobrou um único botão
  "Fechar" (mostra "Salvando..." e fica `disabled` enquanto `salvando` é true, mesma
  variável de estado que já existia). Não há mais como "descartar" uma edição em um post
  já existente fechando o modal — fechar sempre persiste o que estiver nos campos nesse
  momento (intencional, é o comportamento pedido). Continua dando pra excluir o post
  inteiro pelo botão "Excluir", que é uma ação separada.

**3. Testes**
- `npm run lint` e `npm run build` limpos.
- Playwright/Chrome headless, fluxo completo: cliquei num dia vazio (dia 1) → abriu "Novo
  post" → fechei sem digitar nada (clique no backdrop) → confirmei que não criou post
  nenhum. Cliquei no dia de novo, digitei um título, fechei pelo ✕ (sem clicar em nenhum
  botão de salvar) → confirmei que o post foi criado. Cliquei no post recém-criado →
  confirmei que abriu "Editar post" (não "Novo post" por cima). Editei o título, fechei
  clicando fora (backdrop) → confirmei que o título editado persistiu. Por fim abri de
  novo e excluí pelo botão "Excluir" pra não deixar lixo de teste no banco. Também testei
  arrastar "OPK Perfect Pivot" (post real) de um dia pro outro só pra confirmar que o
  drag-and-drop não dispara o "novo post" indevidamente — **revertido depois** a data
  desse post de volta pra 22/jun via REST API, já que o drag de teste realmente moveu o
  dado real (drag funciona de verdade, não é só visual).

**4. Pendente**
- Nada novo. Mudanças ainda não commitadas — perguntar ao usuário antes de
  commitar/push.

### Sessão 9 — 2026-06-18

**Contexto**: continuação direta da Sessão 8, mesmo dia. Usuário mandou o mesmo print de
referência (card de tarefa com check verde) e pediu três coisas: (1) o checkbox de
concluído "em cada card" — entendi como extensão pro board Kanban de Tarefas, que a
Sessão 8 tinha deixado de fora de propósito; (2) fonte menor no Calendário Editorial pra
mostrar mais detalhes por dia; (3) cards um pouco maiores nas Tarefas (Victoria).

**1. Checkbox de concluído também no Kanban**
- `components/tarefas/TaskCard.tsx`: ganhou a mesma estrutura da Sessão 8
  (`TaskChip.tsx`/`PostCard.tsx`) — o ponto de prioridade virou um `<button>` com
  `stopPropagation`, mostra `IconeCheck` (novo, duplicado localmente, mesmo SVG dos
  outros dois arquivos) quando `tarefa.coluna === "concluido"`, título com `line-through`
  e card com `opacity-60` quando concluída. Prop `onToggleConcluida` passada por
  `KanbanColumn.tsx` → `app/tarefas/page.tsx` (reaproveitando o `alternarConcluida` criado
  na Sessão 8 — desmarcar sempre volta pra `a_fazer`, mesma regra de antes).

**2. Calendário Editorial mais compacto**
- `components/calendario/PostCard.tsx`: reduzi padding (`px-2 py-1.5`→`px-1.5 py-1`),
  título (`text-sm`→`text-xs`), nome do canal e categoria (`11px`→`10px`), badges
  NOVO/vídeo (`10px`→`9px`), barrinhas de etiqueta (`h-1.5 w-6`→`h-1 w-5`), ícone de
  check/círculo do botão de status também encolheu um pouco.
- `components/calendario/DayCell.tsx`: gap entre cards de `gap-1`→`gap-0.5`. Não mudei a
  altura fixa do dia (`h-[130px] sm:h-[150px]`, da Sessão 7) — só o conteúdo ficou mais
  denso, então mais posts cabem antes de precisar do scroll interno.

**3. Cards de Tarefas maiores**
- `components/tarefas/TaskChip.tsx` (vista Calendário de Tarefas, que é a padrão desde a
  Sessão 8): padding (`px-2 py-1`→`px-2.5 py-1.5`), título (`text-xs`→`text-sm`), gap
  (`gap-0.5`/`gap-1.5`→`gap-1`/`gap-2`), avatar de responsável (`h-3.5 w-3.5`→`h-4 w-4`,
  texto `10px`→`11px`), ícone de check (`h-3.5 w-3.5`→`h-4 w-4`). Não toquei no
  `TaskCard.tsx` do Kanban nem no `KanbanColumn.tsx` — o pedido foi especificamente sobre
  os cards da vista Calendário (que é a referência do print e a vista padrão agora).

**4. Testes**
- `npm run lint` e `npm run build` limpos.
- Playwright/Chrome headless: confirmei visualmente que dias com 2 posts no Calendário
  Editorial (ex: 20/jun) agora mostram os 2 sem precisar rolar (antes só 1 cabia). No
  Kanban de Tarefas, cliquei no botão de uma tarefa "teste" em "A Fazer" e confirmei que
  moveu pra "Concluído" (check verde, tachado) sem abrir o modal (contei ocorrências de
  "Editar tarefa" na página = 0), depois revertido pelo mesmo botão.

**5. Pendente**
- Nada novo. Mudanças ainda não commitadas nesta sessão — perguntei ao usuário antes de
  commitar/dar push, já que ele não confirmou explicitamente nesta rodada (diferente da
  Sessão 8, onde pediu push de forma explícita).

### Sessão 8 — 2026-06-18

**Contexto**: usuário pediu pra commitar/dar push no que tinha sido feito na Sessão 7, e
junto pediu duas coisas novas: (1) em Tarefas de Marketing, abrir a vista Calendário por
padrão (antes era Kanban); (2) poder marcar uma tarefa/post como concluído/publicado
clicando direto num botão no canto esquerdo do card, sem precisar abrir o card — mandou
print de referência de um card de tarefa com um ícone de check verde.

**1. Incidente: 13 commits paralelos descobertos no `git push`**
- Ao tentar `git push`, o push foi rejeitado — `origin/main` tinha commits que não existiam
  localmente. Investiguei com `git fetch` + `git log main..origin/main --stat`: 13 commits
  entre 17/06 23:51 e 18/06 01:56 (exatamente a janela desta conversa), de outra sessão
  (provavelmente o usuário com outro dispositivo/janela do Claude Code aberta no mesmo
  projeto — ele não soube confirmar a origem). Tinham até uma entrada de HANDOFF própria
  pra uma "Sessão 7" diferente da minha (mesmo número, conteúdo diferente).
- Categorizei os 13 commits pro usuário antes de qualquer ação: ~7 conflitavam diretamente
  com o revert da Sessão 6 (transformavam a edição de post num painel lateral animado com
  `framer-motion`/"motion", calendário "deslizando", larguras teladas — o oposto do que a
  Sessão 6 tinha revertido a pedido do usuário), ~3 eram só da aba Tarefas e não conflitavam
  (drag-to-reorder com migration `0006_ordem_tarefas.sql`, criar tarefa ao clicar no dia,
  redesign do board de tarefas), e 1 era só a entrada de HANDOFF duplicada.
- Usuário decidiu: descartar todo o trabalho paralelo, sem querer investigar a origem.
  Executei `git push --force origin main`, sobrescrevendo `origin/main` pra ficar igual ao
  meu local (`3494e74`) — os 13 commits saíram do GitHub (continuam existindo localmente
  em qualquer sessão/clone que ainda os tenha, só não estão mais no remoto).
- **Resíduo no banco que não foi desfeito** (decisão consciente, mesmo padrão de sobras
  anteriores): a outra sessão já tinha rodado a migration `0006_ordem_tarefas.sql` contra o
  Supabase de produção antes do force-push — a tabela `tarefas` ficou com uma coluna
  `ordem` que o código atual (sem essa migration) não lê nem escreve. Inofensivo (coluna
  extra ignorada), só documentando pra não confundir uma sessão futura que for inspecionar
  o schema. Também notei uma tarefa real "Programar posts do fim de semana" (responsável
  Victoria, prazo 18/jun) criada por aquela sessão — não apaguei, é conteúdo real.
- **Risco registrado em "Estado atual" pra todas as sessões futuras**: ver bullet novo no
  topo deste arquivo. Se `git fetch` mostrar divergência inesperada, parar e perguntar
  antes de decidir sozinho.

**2. Tarefas de Marketing: Calendário como vista padrão**
- `app/tarefas/page.tsx`: `useState<Visualizacao>("kanban")` → `useState<Visualizacao>("calendario")`.
  Também troquei a ordem dos dois botões do toggle (Calendário primeiro, Kanban depois),
  já que o pedido foi "abrir primeiro calendário depois kanban".

**3. Marcar concluído/publicado direto no card**
- `components/tarefas/TaskChip.tsx`: o elemento raiz era um `<button>` (clique em qualquer
  parte abria o modal de edição) — trocado pra `<div onClick=...>` porque agora precisa de
  um botão *dentro* dele (não pode ter `<button>` dentro de `<button>`, HTML inválido). O
  pontinho de prioridade (ou o ícone de check verde quando já concluída) virou um
  `<button>` próprio com `onClick` que chama `e.stopPropagation()` antes de
  `onToggleConcluida()`, pra não abrir o modal. `onToggleConcluida` é uma prop nova,
  passada por `TaskCalendarDayCell.tsx` → `TaskCalendarGrid.tsx` → `app/tarefas/page.tsx`
  (e também direto onde `TaskChip` é usado na caixa "Sem prazo definido"). A função em
  `app/tarefas/page.tsx` (`alternarConcluida`) só reaproveita o `moverTarefa` que já
  existia: se a tarefa já está em `concluido`, volta pra `a_fazer`; senão, vai pra
  `concluido`. **Decisão**: não dá pra "lembrar" a coluna anterior (não é rastreada), então
  desmarcar sempre volta pra `a_fazer`, não pra onde estava antes (ex: "Em andamento").
  Não toquei em `TaskCard.tsx` (cards do board Kanban) — o pedido foi especificamente pro
  card de tarefa (que bate com a vista Calendário, que é a referência do print) e pro
  Calendário Editorial; no Kanban a coluna já mostra o status, então não pareceu necessário
  e não foi pedido.
- `components/calendario/PostCard.tsx`: mesma ideia — adicionei um `<button>` com a mesma
  estrutura de ícone (círculo vazio / check verde) antes do nome do canal, que chama uma
  prop nova `onToggleStatus` (alterna `status` entre `publicado` e `pendente`, mesma lógica
  de "não lembra o status anterior"). Like o `TaskChip`, usei `e.stopPropagation()` pra não
  abrir o modal de edição do post. Prop passada por `DayCell.tsx` → `CalendarGrid.tsx` →
  `app/page.tsx` (`alternarStatusPublicado`, nova função, mesmo padrão do `moverPost` já
  existente).

**4. Testes**
- `npm run lint` e `npm run build` limpos.
- Testado via Playwright/Chrome headless: clicar no botão do card de tarefa "teste" (vista
  Calendário) marcou como concluída (check verde, tachado, sem abrir modal — confirmei
  contando ocorrências de "Editar tarefa" na página, zero) e revertido depois. Trocar pra
  Kanban confirma que a tarefa voltou pra coluna "A Fazer" (5 tarefas), nada ficou
  inconsistente. No Calendário Editorial, clicar no botão do post de teste "LinkedIn /
  Post" (18/jun) marcou como publicado sem abrir o modal de edição, revertido depois.

**5. Pendente**
- Nada novo desta sessão. Mudanças já commitadas e enviadas ao GitHub (ver "Estado atual"
  sobre o force-push).

### Sessão 7 — 2026-06-18

**Contexto**: dois pedidos na mesma conversa. (1) Usuário mandou print de um board estilo
Trello com cards de conteúdo da semana do Formobile, cada um com 2 barrinhas de cor no
topo (verde + laranja/amarelo), pedindo pra "copiar" esse padrão de etiquetas/cores e
incorporar o conteúdo dos cards nas datas certas. (2) Pediu pra mostrar os dias de outros
meses na grade do calendário (esmaecidos) e deixar os quadrados de dia todos do mesmo
tamanho.

**1. Etiquetas Formobile/Story/Feed e conteúdo novo**
- Antes de escrever no banco, consultei o estado real (etiquetas existentes, posts já
  cadastrados nas datas da imagem) e apresentei um plano completo pro usuário confirmar —
  havia ambiguidade real: 2 das 5 datas da imagem (27/jun e 29/jun) já tinham posts
  existentes com título parecido mas não idêntico ("Contagem regressiva" / "É amanhã!
  Estaremos te esperando"), e não estava claro se era pra renomear esses posts pro texto
  exato da imagem ou só adicionar etiquetas mantendo o título atual. Perguntei e o
  usuário confirmou: renomear pro texto exato da imagem.
- Executado via REST API do Supabase (`curl` + anon key, mesma técnica de sessões
  anteriores):
  - Recolori etiqueta "Stories" pra laranja (`#f97316`) e "Feed" pra amarelo (`#eab308`)
    (ambas já existiam desde a Sessão 3, só trocou a cor).
  - Criei etiqueta nova "Formobile" verde (`#22c55e`).
  - Aplicada a etiqueta "Formobile" em todos os 9 posts da semana do evento (os 6 que já
    tinham `categoria = "Formobile"` mais os 3 novos abaixo).
  - Renomeei "Contagem regressiva" (27/jun) → "Contagem Regressiva - Formobile" (mantendo
    a etiqueta Feed que já tinha) e "É amanhã! Estaremos te esperando" (29/jun) →
    "Stories - Ajustes finais + É AMANHÃ!" (troquei a etiqueta de Feed pra Stories, já
    que o novo título deixa claro que é conteúdo de Stories, não Feed).
  - Inseri 3 posts novos (nenhum existia nessas combinações de data/conteúdo antes):
    27/jun "Stories - 'adicione ao calendário' evento formobile", 28/jun "Stories -
    Backstage Cobertura", 30/jun "Stories - Cobertura ao vivo" — todos canal Instagram,
    tipo evento, categoria "Formobile", etiquetas Formobile+Stories.
  - **Edição concorrente notada durante a sessão**: ao verificar visualmente depois (item
    2 abaixo), vi posts em 1–5 de julho que não existiam na minha consulta inicial desta
    sessão e que eu não criei ("Cobertura ao vivo" em 1/2/3 de julho, "Agradecimento" em
    5/jul) — e também que 2 posts que eu tinha consultado antes ("Carrossel: fotos do
    stand" 1/jul, id `a5d68e17`; "Reels: representantes" 2/jul, id `54e95ea3`) mudaram de
    título nesse meio tempo ("Lançamentos da Formobile" e "Reels: Depoimentos"). Os 4
    posts novos já vieram com as etiquetas "Formobile"+"Stories" aplicadas — as mesmas
    que criei/recolori nesta sessão. Conclusão: o usuário (ou a equipe) estava editando o
    calendário ao vivo em paralelo, reaproveitando a convenção de etiquetas que acabei de
    criar — não é inconsistência nem bug meu (a tag por `post_id` que eu já tinha
    aplicado nos 2 posts renomeados continua válida, já que não depende do título).
    Nenhuma ação necessária, só registrar que isso pode acontecer (banco compartilhado
    entre produção ao vivo e qualquer sessão de agente trabalhando ao mesmo tempo).
- Também notei (sem tocar) um post de teste "Post" / canal LinkedIn em 18/jun
  (`id 0bbb53e5...`) que não fui eu quem criou — provavelmente o usuário testando o app
  ao vivo, mesmo padrão de sessões anteriores. Deixei como está.

**2. Grade do calendário: dias de outros meses + quadrados uniformes**
- `components/calendario/CalendarGrid.tsx`: removida a ramificação que renderizava uma
  `<div>` vazia pra dias fora do mês atual — agora todo dia da grade (dentro ou fora do
  mês) passa por `DayCell`, com uma prop nova `foraDoMes` (`!isSameMonth(dia, mesAtual)`).
  Como `posts` já carrega TODOS os posts da tabela (sem filtro de data — ver
  `app/page.tsx`), não precisou mudar a busca de dados, só parar de escondê-los.
- `components/calendario/DayCell.tsx`: trocou `noMesAtual`/empty-div da Sessão 3 por
  `foraDoMes: boolean` — quando true, fundo `bg-zinc-900/60`, número do dia em
  `text-zinc-600` (em vez de `text-zinc-300`), e a célula inteira com `opacity-60`
  (exceto quando `isOver` de um drag-and-drop, pra não prejudicar o feedback visual de
  soltar um post ali). Mesma ideia/CSS que existia antes da Sessão 3 remover
  (`git show 3635835^:components/calendario/DayCell.tsx`), só que agora os posts daquele
  dia continuam aparecendo (a versão antiga já fazia isso, só o nome da prop mudou).
- Mesmo arquivo: trocado `min-h-[110px] sm:min-h-[130px]` (que crescia com a quantidade
  de posts do dia) por `h-[130px] sm:h-[150px]` fixo, com a lista de posts dentro em
  `overflow-y-auto` — pedido explícito do usuário ("quadrados do mesmo tamanho").
  Consequência: dias com muitos posts (o máximo hoje é 3, só 30/jun) mostram scroll
  interno em vez de esticar a célula. Perguntei explicitamente se esse trade-off era
  aceitável (alternativas seriam aumentar a altura fixa ou um link "+N mais" estilo
  Google Calendar) — usuário confirmou que scroll interno está bom.

**3. Testes**
- `npm run lint` e `npm run build` limpos depois de cada mudança.
- Validado visualmente com Playwright/Chrome headless: confirmei que os posts da semana
  do Formobile aparecem com as etiquetas/cores certas, que dias de julho aparecem
  esmaecidos na grade de junho preenchendo a última semana, e que os quadrados de dia
  ficaram visualmente uniformes (incluindo o scroll interno nos dias cheios).

**4. Pendente**
- Nada ficou pendente desta sessão. Mudanças de código (CalendarGrid/DayCell) ainda não
  foram commitadas — ver se o usuário quer commit/push agora ou depois.

### Sessão 6 — 2026-06-17

**Contexto**: usuário pediu pra continuar o projeto, mandou um print do calendário
(visão Julho 2026) e disse "quero que volte o layout para como estava antes". O print
mostrava o app **sem** sidebar de filtros, sem cards de estatística, sem banner de
campanha e sem painel de detalhe à direita — só os 3 dropdowns de filtro (canal/tipo/
etiqueta) e a grade do mês ocupando a tela. Isso correspondia exatamente ao estado do
app no commit `00bac35` (fim da Sessão 3 / antes do redesign grande da Sessão 4).

**1. Confirmação de escopo**
- Antes de reverter, perguntei explicitamente se era pra reverter tudo (perdendo da UI
  o checklist de produção, campo responsável e banner de campanha editável, que foram
  introduzidos junto com aquele layout na Sessão 4) ou só o visual, mantendo essas
  funcionalidades em algum lugar adaptado. Usuário confirmou: reverter tudo mesmo, igual
  ao print.

**2. O que foi feito**
- Restaurei via `git checkout 00bac35 -- <arquivo>` (não reescrevi manualmente, usei o
  conteúdo real do commit anterior ao redesign) os arquivos: `app/layout.tsx` (largura
  voltou a `max-w-7xl` centralizado, não mais tela cheia), `app/page.tsx` (filtros
  voltam a ser valor único em vez de array multi-seleção, navegação só por mês — sem
  visão Semanal/Lista —, clique no post abre o modal de edição direto em vez de só
  popular um painel lateral), `components/TopNav.tsx` (mesma reversão de largura),
  `components/calendario/CalendarGrid.tsx`, `DayCell.tsx`, `PostCard.tsx` (volta ao
  estilo da Sessão 3: barrinhas por etiqueta + nome do canal, sem checkbox/avatar),
  `PostModal.tsx`, `lib/postStyles.ts` (removi `CORES_TIPO`/`CORES_STATUS`/campo `dot`
  de `CORES_CANAL`, que só existiam pros componentes novos), `lib/types.ts` (removi
  `ChecklistItem`/`CHECKLIST_PADRAO`/`Campanha`/`NovaCampanha` e os campos
  `responsavel`/`checklist` de `Post` — `etiqueta_ids`/`Etiqueta` continuam, já
  existiam antes da Sessão 4). Restaurei também `components/calendario/Filtros.tsx`
  (tinha sido apagado na Sessão 4).
- Apaguei (não revertido, removido de verdade — ficaram sem nenhum uso depois do
  revert do `app/page.tsx`): `CampanhaBanner.tsx`, `EstatisticasCards.tsx`,
  `PostDetailPanel.tsx`, `PostListView.tsx`, `PostWeekGrid.tsx`, `SidebarFiltros.tsx`.
- **Não toquei**: nada da aba Tarefas de Marketing (`app/tarefas/page.tsx`,
  `components/tarefas/TaskChip.tsx`, `TaskCalendarDayCell.tsx`) — o drag-and-drop
  implementado ali na Sessão 5 é independente desse layout e o usuário não pediu pra
  reverter aquilo. Também não toquei nas migrations SQL (`0001`/`0004`/`0005`) nem no
  banco — as colunas `responsavel`/`checklist` e a tabela `campanhas` continuam
  existindo com os dados que já tinham (ver bullet novo em "Pendências"), só a UI parou
  de usá-las. Confirmei por `grep` antes de remover/reverter que nenhum desses símbolos
  (`CORES_TIPO`, `CORES_STATUS`, `.dot`, `responsavel`, `checklist`, `Campanha`) era
  referenciado fora dos arquivos do Calendário Editorial que estavam sendo revertidos.

**3. Testes**
- `npm run lint` e `npm run build` limpos depois do revert.
- Subi o dev server e tirei screenshot via Playwright/Chrome headless: confirmei
  visualmente que o layout ficou idêntico ao print do usuário (dropdowns + grade única,
  cards com barrinha de etiqueta + nome do canal). Cliquei num post real
  ("SI Porta Invisível Slim") e confirmei que abre o modal de edição direto, com os
  campos certos (sem campo de responsável/checklist, que não existem mais nesse modal);
  fechei sem salvar, nenhum dado foi alterado. Matei o processo do dev server e apaguei
  os screenshots temporários ao final.

**4. Pendente**
- Nada novo além do que já estava (arquivos anexados ao post). Ver bullet atualizado em
  "Pendências" sobre `responsavel`/`checklist`/`campanhas` continuarem no banco, só
  inacessíveis pela UI agora.
- Ainda não commitei essas mudanças — fica a critério da próxima sessão (ou do usuário
  direto) decidir quando commitar/dar push.

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
  de referência (calendário de Junho/Julho de outra ferramenta) mostrando exatamente o
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
