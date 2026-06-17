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
  drag-and-drop, `@supabase/supabase-js`, `date-fns`.
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
