-- Siforma — Calendário de Marketing
-- Substitui o campo fixo `formato` (enum) por um sistema de etiquetas livre,
-- estilo Trello: nome e cor editáveis, várias etiquetas por post, criadas pela
-- equipe. Migra os posts existentes para etiquetas equivalentes ao formato
-- antigo antes de remover a coluna. Seguro executar mais de uma vez.

-- ─── Tabela: etiquetas ──────────────────────────────────────────────────

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

-- ─── Tabela: post_etiquetas (relação N:N) ─────────────────────────────

create table if not exists post_etiquetas (
  post_id uuid not null references posts (id) on delete cascade,
  etiqueta_id uuid not null references etiquetas (id) on delete cascade,
  primary key (post_id, etiqueta_id)
);

alter table post_etiquetas enable row level security;

drop policy if exists "acesso publico total - post_etiquetas" on post_etiquetas;
create policy "acesso publico total - post_etiquetas" on post_etiquetas
  for all using (true) with check (true);

-- ─── Seed: uma etiqueta por formato antigo (só na primeira execução) ──

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

-- ─── Migrar posts existentes: formato antigo → etiqueta equivalente ──

do $$
begin
  if exists (select 1 from information_schema.columns where table_name = 'posts' and column_name = 'formato') then
    insert into post_etiquetas (post_id, etiqueta_id)
    select p.id, e.id
    from posts p
    join etiquetas e on e.nome = case p.formato::text
      when 'feed' then 'Feed'
      when 'stories' then 'Stories'
      when 'reels' then 'Reels'
      when 'carrossel' then 'Carrossel'
      when 'enquete' then 'Enquete'
      when 'quiz' then 'Quiz'
      when 'caixa_perguntas' then 'Caixa de perguntas'
    end
    on conflict (post_id, etiqueta_id) do nothing;

    alter table posts drop column formato;
  end if;
end $$;

drop type if exists formato_enum;
