-- Siforma — Calendário de Marketing
-- Schema + seed inicial (posts) das tabelas posts, tarefas e metas.
-- Pode ser executado direto no SQL Editor do Supabase, ou via `supabase db push`.
-- É seguro executar este script mais de uma vez (idempotente).

create extension if not exists pgcrypto;

-- ─── Enums ──────────────────────────────────────────────────────────────

do $$ begin
  create type canal_enum as enum ('feed', 'story');
exception when duplicate_object then null; end $$;

do $$ begin
  create type tipo_post_enum as enum ('produto', 'lancamento', 'nao_produto', 'evento');
exception when duplicate_object then null; end $$;

do $$ begin
  create type formato_enum as enum ('post', 'reels', 'carrossel', 'story_estatico', 'enquete', 'quiz', 'caixa_perguntas');
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
  canal canal_enum not null default 'feed',
  tipo tipo_post_enum not null,
  categoria text,
  formato formato_enum not null default 'post',
  video_pronto boolean not null default false,
  novo_produto boolean not null default false,
  status status_post_enum not null default 'pendente',
  copy text,
  observacoes text
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

-- ─── Seed: calendário editorial (2026) ─────────────────────────────────
-- Só popula se a tabela posts ainda estiver vazia, para não duplicar em re-execuções.

do $$
begin
  if not exists (select 1 from posts) then

    insert into posts (titulo, data, canal, tipo, categoria, formato, video_pronto, novo_produto, status) values
      -- Semana 8–14 jun
      ('OPK Perfect Synchro', '2026-06-09', 'feed', 'produto', null, 'post', false, false, 'pendente'),
      ('SI Pocket 160', '2026-06-11', 'feed', 'produto', null, 'post', false, false, 'pendente'),
      ('SI Rotary Easy', '2026-06-13', 'feed', 'produto', null, 'post', false, false, 'pendente'),

      -- Semana 15–21 jun
      ('Contagem regressiva', '2026-06-15', 'feed', 'evento', 'Formobile', 'post', false, false, 'pendente'),
      ('OPK Perfect Pocket Wood', '2026-06-17', 'feed', 'produto', null, 'post', false, false, 'pendente'),
      ('OPK Perfect Pivot', '2026-06-19', 'feed', 'produto', null, 'post', false, false, 'pendente'),

      -- Semana 22–27 jun
      ('Spoiler', '2026-06-22', 'feed', 'evento', 'Formobile', 'post', false, false, 'pendente'),
      ('SI Porta Invisível Wood', '2026-06-24', 'feed', 'produto', null, 'post', false, false, 'pendente'),
      ('SI 300/400 H-S', '2026-06-26', 'feed', 'produto', null, 'post', false, false, 'pendente'),

      -- Semana do evento Formobile (28 jun – 3 jul)
      ('É amanhã! Estaremos te esperando', '2026-06-29', 'feed', 'evento', 'Formobile', 'post', false, false, 'pendente'),
      ('Reels: primeiro dia do evento', '2026-06-30', 'feed', 'evento', 'Formobile', 'reels', false, false, 'pendente'),
      ('Carrossel: fotos do stand', '2026-07-01', 'feed', 'evento', 'Formobile', 'carrossel', false, false, 'pendente'),
      ('Reels: representantes', '2026-07-02', 'feed', 'evento', 'Formobile', 'reels', false, false, 'pendente'),
      ('Reels: último dia do evento', '2026-07-03', 'feed', 'evento', 'Formobile', 'reels', false, false, 'pendente'),

      -- Semana 6–12 jul (lançamentos)
      ('SI80 Perfect Alumínio Slim', '2026-07-07', 'feed', 'lancamento', null, 'post', false, true, 'pendente'),
      ('Submarine', '2026-07-09', 'feed', 'lancamento', null, 'post', false, true, 'pendente'),
      ('Maçanetas', '2026-07-11', 'feed', 'lancamento', null, 'post', false, true, 'pendente'),

      -- Semana 13–19 jul (lançamentos)
      ('Linha Pivot Superior', '2026-07-14', 'feed', 'lancamento', null, 'post', false, true, 'pendente'),
      ('SI20 Light', '2026-07-16', 'feed', 'lancamento', null, 'post', false, true, 'pendente'),
      ('Tendências', '2026-07-18', 'feed', 'nao_produto', 'Carrossel de respiro — o que está em alta em projetos de marcenaria e arquitetura', 'carrossel', false, false, 'pendente'),

      -- Semana 20–26 jul (lançamentos)
      ('Porta Invisível em Alumínio', '2026-07-21', 'feed', 'lancamento', null, 'post', false, true, 'pendente'),
      ('Coplanar 2 Portas', '2026-07-23', 'feed', 'lancamento', null, 'post', false, true, 'pendente'),
      ('E-Motion', '2026-07-25', 'feed', 'lancamento', null, 'post', true, true, 'pendente'),

      -- Semana 27 jul – 2 ago (lançamentos)
      ('Linha Dobradiças Hidráulicas', '2026-07-28', 'feed', 'lancamento', null, 'post', false, true, 'pendente'),
      ('Depoimentos', '2026-08-01', 'feed', 'nao_produto', 'Carrossel de respiro — clientes e marceneiros sobre experiência com os produtos', 'carrossel', false, false, 'pendente'),

      -- Semana 3–9 ago (retomada dos novos restantes)
      ('SI Camarão (C40/C80/V40/V80)', '2026-08-04', 'feed', 'produto', null, 'post', false, false, 'pendente'),
      ('Hawa Variotec', '2026-08-06', 'feed', 'produto', null, 'post', false, false, 'pendente'),
      ('Projetos em destaque', '2026-08-08', 'feed', 'nao_produto', 'Carrossel de respiro — ambientes e obras que usam produtos Siforma', 'carrossel', false, false, 'pendente'),

      -- Semana 10–16 ago (retomada da fila antiga)
      ('OPK Perfect Telescópico Wood', '2026-08-11', 'feed', 'produto', null, 'post', false, false, 'pendente'),
      ('OPK Perfect Pocket Push to Open Slim', '2026-08-13', 'feed', 'produto', null, 'post', false, false, 'pendente'),
      ('OPK Perfect Telescópico Slim', '2026-08-15', 'feed', 'produto', null, 'post', true, false, 'pendente'),

      -- Semana 17–23 ago
      ('Projetos em destaque', '2026-08-18', 'feed', 'nao_produto', 'Carrossel de respiro — ambientes e obras que usam produtos Siforma', 'carrossel', false, false, 'pendente'),
      ('SI Coplanar', '2026-08-20', 'feed', 'produto', null, 'post', true, false, 'pendente'),
      ('SI Rotary 35', '2026-08-22', 'feed', 'produto', null, 'post', true, false, 'pendente'),

      -- Semana 24–30 ago
      ('SI Sailing', '2026-08-25', 'feed', 'produto', null, 'post', false, false, 'pendente'),
      ('Perfect Brises Slim', '2026-08-27', 'feed', 'produto', null, 'post', false, false, 'pendente'),
      ('OPK Perfect Camarão', '2026-08-29', 'feed', 'produto', null, 'post', false, false, 'pendente'),

      -- Semana 31 ago – 6 set
      ('Marcenarias', '2026-09-01', 'feed', 'nao_produto', 'Carrossel de respiro — seleção de projetos de parceiros com produtos Siforma', 'carrossel', false, false, 'pendente'),
      ('OPK Perfect Line', '2026-09-03', 'feed', 'produto', null, 'post', false, false, 'pendente'),
      ('Hawa Folding Concepta III', '2026-09-05', 'feed', 'produto', null, 'post', false, false, 'pendente'),

      -- Semana 7–13 set
      ('SI Ocean', '2026-09-08', 'feed', 'produto', null, 'post', false, false, 'pendente'),
      ('SI 100 Magnético', '2026-09-10', 'feed', 'produto', null, 'post', false, false, 'pendente'),
      ('Obras', '2026-09-12', 'feed', 'nao_produto', 'Carrossel de respiro', 'carrossel', false, false, 'pendente'),

      -- Semana 14–20 set
      ('Bastidores', '2026-09-15', 'feed', 'nao_produto', 'Carrossel de respiro', 'carrossel', false, false, 'pendente');

  end if;
end $$;
