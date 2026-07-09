create table if not exists tarefas_site (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  descricao text,
  status text not null default 'a_fazer'
    check (status in ('a_fazer', 'em_andamento', 'concluido')),
  prioridade text not null default 'media'
    check (prioridade in ('baixa', 'media', 'alta')),
  responsavel text,
  criado_em timestamptz not null default now()
);

alter table tarefas_site enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'tarefas_site' and policyname = 'acesso total'
  ) then
    create policy "acesso total" on tarefas_site
      for all using (true) with check (true);
  end if;
end $$;
