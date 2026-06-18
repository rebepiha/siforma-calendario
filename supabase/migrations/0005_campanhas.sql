-- Siforma — Calendário de Marketing
-- Campanhas/eventos com data de início e fim explícitas e editáveis, em vez
-- de inferir o período a partir das datas dos posts — alguns posts são
-- "esquenta" (ex: contagem regressiva) publicados antes do evento começar
-- de fato, o que distorcia o cálculo automático. Seguro executar mais de
-- uma vez.

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

do $$
begin
  if not exists (select 1 from campanhas where nome = 'Formobile') then
    insert into campanhas (nome, data_inicio, data_fim) values
      ('Formobile', '2026-06-30', '2026-07-03');
  end if;
end $$;
