-- Siforma — Calendário de Marketing
-- Schema + seed inicial (posts) das tabelas posts, tarefas e metas.
-- Pode ser executado direto no SQL Editor do Supabase, ou via `supabase db push`.
-- É seguro executar este script mais de uma vez (idempotente).

create extension if not exists pgcrypto;

-- ─── Enums ──────────────────────────────────────────────────────────────

do $$ begin
  create type canal_enum as enum ('instagram', 'linkedin', 'youtube');
exception when duplicate_object then null; end $$;

do $$ begin
  create type tipo_post_enum as enum ('produto', 'lancamento', 'nao_produto', 'evento');
exception when duplicate_object then null; end $$;

do $$ begin
  create type status_post_enum as enum ('pendente', 'em_producao', 'agendado', 'publicado');
exception when duplicate_object then null; end $$;

do $$ begin
  create type prioridade_enum as enum ('baixa', 'media', 'alta');
exception when duplicate_object then null; end $$;

do $$ begin
  create type coluna_enum as enum ('a_fazer', 'em_andamento', 'em_revisao', 'concluido');
exception when duplicate_object then null; end $$;

-- ─── Tabela: posts ──────────────────────────────────────────────────────

create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  data date not null,
  canal canal_enum not null default 'instagram',
  tipo tipo_post_enum not null,
  categoria text,
  video_pronto boolean not null default false,
  novo_produto boolean not null default false,
  status status_post_enum not null default 'pendente',
  copy text,
  observacoes text,
  responsavel text,
  checklist jsonb not null default
    '[
      {"item":"Roteiro","feito":false},
      {"item":"Gravação","feito":false},
      {"item":"Edição","feito":false},
      {"item":"Arte/Capa","feito":false},
      {"item":"Agendado","feito":false},
      {"item":"Publicado","feito":false}
    ]'::jsonb
);

create index if not exists idx_posts_data on posts (data);

alter table posts enable row level security;

drop policy if exists "acesso publico total - posts" on posts;
create policy "acesso publico total - posts" on posts
  for all using (true) with check (true);

-- ─── Tabela: tarefas ────────────────────────────────────────────────────

create table if not exists tarefas (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  descricao text,
  responsavel text,
  prazo date,
  prioridade prioridade_enum not null default 'media',
  coluna coluna_enum not null default 'a_fazer',
  criado_em timestamptz not null default now()
);

create index if not exists idx_tarefas_coluna on tarefas (coluna);

alter table tarefas enable row level security;

drop policy if exists "acesso publico total - tarefas" on tarefas;
create policy "acesso publico total - tarefas" on tarefas
  for all using (true) with check (true);

-- ─── Tabela: metas ──────────────────────────────────────────────────────

create table if not exists metas (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  valor_atual numeric not null default 0,
  valor_meta numeric not null,
  unidade text,
  prazo date,
  categoria text
);

alter table metas enable row level security;

drop policy if exists "acesso publico total - metas" on metas;
create policy "acesso publico total - metas" on metas
  for all using (true) with check (true);

-- ─── Tabela: campanhas ──────────────────────────────────────────────────
-- Campanhas/eventos com data de início e fim explícitas (ex: Formobile),
-- usadas no banner de contagem do calendário editorial.

create table if not exists campanhas (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  data_inicio date not null,
  data_fim date not null,
  criado_em timestamptz not null default now()
);

alter table campanhas enable row level security;

drop policy if exists "acesso publico total - campanhas" on campanhas;
create policy "acesso publico total - campanhas" on campanhas
  for all using (true) with check (true);

-- ─── Tabela: etiquetas ──────────────────────────────────────────────────
-- Etiquetas livres (nome + cor editáveis pela equipe), estilo Trello.
-- Substituem o antigo campo fixo `formato` dos posts.

create table if not exists etiquetas (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  cor text not null,
  criado_em timestamptz not null default now()
);

alter table etiquetas enable row level security;

drop policy if exists "acesso publico total - etiquetas" on etiquetas;
create policy "acesso publico total - etiquetas" on etiquetas
  for all using (true) with check (true);

create table if not exists post_etiquetas (
  post_id uuid not null references posts (id) on delete cascade,
  etiqueta_id uuid not null references etiquetas (id) on delete cascade,
  primary key (post_id, etiqueta_id)
);

alter table post_etiquetas enable row level security;

drop policy if exists "acesso publico total - post_etiquetas" on post_etiquetas;
create policy "acesso publico total - post_etiquetas" on post_etiquetas
  for all using (true) with check (true);

do $$
begin
  if not exists (select 1 from etiquetas) then
    insert into etiquetas (nome, cor) values
      ('Feed', '#71717a'),
      ('Stories', '#8b5cf6'),
      ('Reels', '#ec4899'),
      ('Carrossel', '#f59e0b'),
      ('Enquete', '#14b8a6'),
      ('Quiz', '#6366f1'),
      ('Caixa de perguntas', '#06b6d4');
  end if;
end $$;

-- ─── Seed: calendário editorial (2026) ─────────────────────────────────
-- Só popula se a tabela posts ainda estiver vazia, para não duplicar em re-execuções.

do $$
begin
  if not exists (select 1 from posts) then

    insert into posts (titulo, data, canal, tipo, categoria, video_pronto, novo_produto, status) values
      -- Semana 8–14 jun
      ('OPK Perfect Synchro', '2026-06-09', 'instagram', 'produto', null, false, false, 'pendente'),
      ('SI Pocket 160', '2026-06-11', 'instagram', 'produto', null, false, false, 'pendente'),
      ('SI Rotary Easy', '2026-06-13', 'instagram', 'produto', null, false, false, 'pendente'),

      -- Semana 15–21 jun
      ('Contagem regressiva', '2026-06-15', 'instagram', 'evento', 'Formobile', false, false, 'pendente'),
      ('OPK Perfect Pocket Wood', '2026-06-17', 'instagram', 'produto', null, false, false, 'pendente'),
      ('OPK Perfect Pivot', '2026-06-19', 'instagram', 'produto', null, false, false, 'pendente'),

      -- Semana 22–27 jun
      ('Spoiler', '2026-06-22', 'instagram', 'evento', 'Formobile', false, false, 'pendente'),
      ('SI Porta Invisível Wood', '2026-06-24', 'instagram', 'produto', null, false, false, 'pendente'),
      ('SI 300/400 H-S', '2026-06-26', 'instagram', 'produto', null, false, false, 'pendente'),

      -- Semana do evento Formobile (28 jun – 3 jul)
      ('É amanhã! Estaremos te esperando', '2026-06-29', 'instagram', 'evento', 'Formobile', false, false, 'pendente'),
      ('Reels: primeiro dia do evento', '2026-06-30', 'instagram', 'evento', 'Formobile', false, false, 'pendente'),
      ('Carrossel: fotos do stand', '2026-07-01', 'instagram', 'evento', 'Formobile', false, false, 'pendente'),
      ('Reels: representantes', '2026-07-02', 'instagram', 'evento', 'Formobile', false, false, 'pendente'),
      ('Reels: último dia do evento', '2026-07-03', 'instagram', 'evento', 'Formobile', false, false, 'pendente'),

      -- Semana 6–12 jul (lançamentos)
      ('SI80 Perfect Alumínio Slim', '2026-07-07', 'instagram', 'lancamento', null, false, true, 'pendente'),
      ('Submarine', '2026-07-09', 'instagram', 'lancamento', null, false, true, 'pendente'),
      ('Maçanetas', '2026-07-11', 'instagram', 'lancamento', null, false, true, 'pendente'),

      -- Semana 13–19 jul (lançamentos)
      ('Linha Pivot Superior', '2026-07-14', 'instagram', 'lancamento', null, false, true, 'pendente'),
      ('SI20 Light', '2026-07-16', 'instagram', 'lancamento', null, false, true, 'pendente'),
      ('Tendências', '2026-07-18', 'instagram', 'nao_produto', 'Carrossel de respiro — o que está em alta em projetos de marcenaria e arquitetura', false, false, 'pendente'),

      -- Semana 20–26 jul (lançamentos)
      ('Porta Invisível em Alumínio', '2026-07-21', 'instagram', 'lancamento', null, false, true, 'pendente'),
      ('Coplanar 2 Portas', '2026-07-23', 'instagram', 'lancamento', null, false, true, 'pendente'),
      ('E-Motion', '2026-07-25', 'instagram', 'lancamento', null, true, true, 'pendente'),

      -- Semana 27 jul – 2 ago (lançamentos)
      ('Linha Dobradiças Hidráulicas', '2026-07-28', 'instagram', 'lancamento', null, false, true, 'pendente'),
      ('Depoimentos', '2026-08-01', 'instagram', 'nao_produto', 'Carrossel de respiro — clientes e marceneiros sobre experiência com os produtos', false, false, 'pendente'),

      -- Semana 3–9 ago (retomada dos novos restantes)
      ('SI Camarão (C40/C80/V40/V80)', '2026-08-04', 'instagram', 'produto', null, false, false, 'pendente'),
      ('Hawa Variotec', '2026-08-06', 'instagram', 'produto', null, false, false, 'pendente'),
      ('Projetos em destaque', '2026-08-08', 'instagram', 'nao_produto', 'Carrossel de respiro — ambientes e obras que usam produtos Siforma', false, false, 'pendente'),

      -- Semana 10–16 ago (retomada da fila antiga)
      ('OPK Perfect Telescópico Wood', '2026-08-11', 'instagram', 'produto', null, false, false, 'pendente'),
      ('OPK Perfect Pocket Push to Open Slim', '2026-08-13', 'instagram', 'produto', null, false, false, 'pendente'),
      ('OPK Perfect Telescópico Slim', '2026-08-15', 'instagram', 'produto', null, true, false, 'pendente'),

      -- Semana 17–23 ago
      ('Projetos em destaque', '2026-08-18', 'instagram', 'nao_produto', 'Carrossel de respiro — ambientes e obras que usam produtos Siforma', false, false, 'pendente'),
      ('SI Coplanar', '2026-08-20', 'instagram', 'produto', null, true, false, 'pendente'),
      ('SI Rotary 35', '2026-08-22', 'instagram', 'produto', null, true, false, 'pendente'),

      -- Semana 24–30 ago
      ('SI Sailing', '2026-08-25', 'instagram', 'produto', null, false, false, 'pendente'),
      ('Perfect Brises Slim', '2026-08-27', 'instagram', 'produto', null, false, false, 'pendente'),
      ('OPK Perfect Camarão', '2026-08-29', 'instagram', 'produto', null, false, false, 'pendente'),

      -- Semana 31 ago – 6 set
      ('Marcenarias', '2026-09-01', 'instagram', 'nao_produto', 'Carrossel de respiro — seleção de projetos de parceiros com produtos Siforma', false, false, 'pendente'),
      ('OPK Perfect Line', '2026-09-03', 'instagram', 'produto', null, false, false, 'pendente'),
      ('Hawa Folding Concepta III', '2026-09-05', 'instagram', 'produto', null, false, false, 'pendente'),

      -- Semana 7–13 set
      ('SI Ocean', '2026-09-08', 'instagram', 'produto', null, false, false, 'pendente'),
      ('SI 100 Magnético', '2026-09-10', 'instagram', 'produto', null, false, false, 'pendente'),
      ('Obras', '2026-09-12', 'instagram', 'nao_produto', 'Carrossel de respiro', false, false, 'pendente'),

      -- Semana 14–20 set
      ('Bastidores', '2026-09-15', 'instagram', 'nao_produto', 'Carrossel de respiro', false, false, 'pendente');

  end if;
end $$;
