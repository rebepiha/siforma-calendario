# Siforma — Calendário de Marketing

Aplicação web para gerenciar o calendário editorial e as tarefas de marketing da
Siforma (distribuidora das marcas SI Line, OPK Perfect e HAWA). Tem 3 abas:

1. **Calendário Editorial** — calendário mensal dos posts de Instagram (feed/story), com drag-and-drop entre dias.
2. **Tarefas de Marketing** — board Kanban (A Fazer / Em Andamento / Em Revisão / Concluído).
3. **Metas e Progresso** — acompanhamento de metas com barra de progresso.

Não há login: qualquer pessoa com o link da aplicação publicada pode ver e editar.

## Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS 4
- Supabase (Postgres) via `@supabase/supabase-js`
- `@dnd-kit/core` para drag-and-drop

## 1. Configurar o Supabase

1. Crie uma conta e um novo projeto em [supabase.com](https://supabase.com).
2. No projeto criado, abra **SQL Editor**.
3. Copie todo o conteúdo de [`supabase/migrations/0001_init.sql`](./supabase/migrations/0001_init.sql),
   cole no editor e clique em **Run**. Isso cria as tabelas `posts`, `tarefas` e `metas`,
   configura as políticas de acesso (RLS aberto, já que não há login) e popula a tabela
   `posts` com o calendário editorial inicial (jun–set/2026). As tabelas `tarefas` e
   `metas` ficam vazias, para o time preencher.
   - Se preferir usar a [Supabase CLI](https://supabase.com/docs/guides/cli), o mesmo
     arquivo pode ser aplicado com `supabase db push` (a pasta `supabase/migrations`
     já está no formato esperado pela CLI).
4. Em **Project Settings > API**, copie a **Project URL** e a chave **anon public** —
   elas serão usadas nas variáveis de ambiente abaixo.

> ⚠️ Como a aplicação não tem autenticação, o acesso ao banco é feito com a chave
> `anon` direto do navegador. A migration já habilita Row Level Security com uma
> política aberta (`using (true)`) em cada tabela — qualquer pessoa com o link da
> aplicação pode ler e escrever nos dados. Não coloque a chave `service_role` no
> frontend.

## 2. Rodar localmente

```bash
npm install
cp .env.example .env.local
# edite .env.local com a URL e a anon key do seu projeto Supabase
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

### Variáveis de ambiente

| Variável | Onde encontrar |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Project Settings > API > Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Project Settings > API > anon public |

## 3. Deploy no Vercel

1. Suba este repositório para o GitHub (ou outro provedor suportado pela Vercel).
2. Em [vercel.com/new](https://vercel.com/new), importe o repositório.
3. Em **Environment Variables**, adicione `NEXT_PUBLIC_SUPABASE_URL` e
   `NEXT_PUBLIC_SUPABASE_ANON_KEY` com os mesmos valores do `.env.local`.
4. Clique em **Deploy**. Builds seguintes (novos `git push`) fazem deploy automático.

## Estrutura do projeto

```
app/
  page.tsx          Calendário Editorial (rota "/")
  tarefas/page.tsx  Tarefas de Marketing
  metas/page.tsx    Metas e Progresso
components/
  calendario/       Grid do calendário, card de post, modal, filtros
  tarefas/          Colunas Kanban, card de tarefa, modal
  metas/            Card de meta com barra de progresso, modal
lib/
  supabase.ts       Cliente Supabase (usa as env vars acima)
  types.ts          Tipos TypeScript espelhando os enums do banco
supabase/migrations/0001_init.sql   Schema + seed do calendário editorial
```
