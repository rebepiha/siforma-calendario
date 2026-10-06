-- Siforma — Calendário de Marketing
-- Tabela de produtos de verdade, pra Biblioteca (e futuras telas) agrupar por
-- referência (produto_id) em vez de por texto do título. Ver HANDOFF.md, Sessão 42,
-- pro raciocínio completo (por que uma tabela agora, por que só 17 produtos no
-- backfill inicial, por que os demais posts tipo produto/lancamento ficam sem
-- produto_id por enquanto).
-- É seguro executar este script mais de uma vez (idempotente).

create table if not exists produtos (
  id uuid primary key default gen_random_uuid(),
  nome text not null unique,
  criado_em timestamptz not null default now()
);

alter table produtos enable row level security;

drop policy if exists "acesso publico total - produtos" on produtos;
create policy "acesso publico total - produtos" on produtos
  for all using (true) with check (true);

alter table posts add column if not exists produto_id uuid references produtos (id);
create index if not exists idx_posts_produto_id on posts (produto_id);

-- ─── Backfill: só os 17 produtos já confirmados manualmente (Sessão 42) ───────
-- Os demais posts tipo produto/lancamento (ambíguos ou genéricos, ex: "Interativo",
-- "Rotary" sem sufixo, "OPK Perfect Camarão" sem "(explicativo)") ficam com
-- produto_id NULL de propósito — não foram confirmados como o mesmo produto ainda.

insert into produtos (nome) values
  ('Dobradiças 3D invisíveis'),
  ('E-Motion Slim'),
  ('SI Ocean'),
  ('SI20 FH-S'),
  ('Submarine'),
  ('Linha Pivot Superior (bocreio)'),
  ('OPK Perfect Camarão'),
  ('Porta Invisível em Alumínio (slim)'),
  ('Maçaneta fecho magnético'),
  ('Perfect Pivot Brises 360'),
  ('SI Rotary 35'),
  ('Coplanar 2 Portas'),
  ('OPK Perfect Pivot'),
  ('Si Rotary Easy'),
  ('Perfect Pocket Wood'),
  ('Perfect Pocket Slim'),
  ('OPK Perfect Synchro')
on conflict (nome) do nothing;

update posts set produto_id = (select id from produtos where nome = 'Dobradiças 3D invisíveis')
  where id in ('0ef8c28c-b949-41bd-bc2a-17cb99a6b5da', 'a72aa729-f41c-4ebc-9467-e08ded67f80f');

update posts set produto_id = (select id from produtos where nome = 'E-Motion Slim')
  where id in ('024f3837-80ad-443c-8fb5-486bf1b31f8c', '9e9f6235-0abe-418f-ac63-eea8ff78d838');

update posts set produto_id = (select id from produtos where nome = 'SI Ocean')
  where id in ('1c9d245a-1381-4cd6-9fd7-650fbf8cd985', '97ac2496-a7d3-479e-89f9-72b0b8916892');

update posts set produto_id = (select id from produtos where nome = 'SI20 FH-S')
  where id in ('642f81d9-ce58-4137-9627-2cde98843cc0', '2865d270-d407-425d-a534-82e698a3f3eb');

update posts set produto_id = (select id from produtos where nome = 'Submarine')
  where id in ('405440a8-cec9-4119-a28c-6fb255be4d9e', 'daf2e5b3-2dd4-4bb4-93d2-d35e0a362148');

update posts set produto_id = (select id from produtos where nome = 'Linha Pivot Superior (bocreio)')
  where id in ('0e71e0a5-6f06-4326-8ba8-4a83d7cc7238', '1b19c52a-a2e3-4646-906e-ad4f684c2f0b');

update posts set produto_id = (select id from produtos where nome = 'OPK Perfect Camarão')
  where id in ('9e12d4b6-5524-49f9-b552-f2f451f0fc2f');

update posts set produto_id = (select id from produtos where nome = 'Porta Invisível em Alumínio (slim)')
  where id in ('52df973e-dc42-4bd2-b1a9-57e0fe6a8d28', '7c141f5b-c0e3-4f5e-b34f-3afb9aa514b7', '4a236ed4-92d2-4396-9355-3c1c9decfa73', '8f7fc9d7-3665-434c-a609-fe33e15892d8');

update posts set produto_id = (select id from produtos where nome = 'Maçaneta fecho magnético')
  where id in ('1f45553b-e173-4d0c-9439-a5e6e3a9d810', 'dc11c1aa-b95e-4c98-bab4-bac2addc6f9d');

update posts set produto_id = (select id from produtos where nome = 'Perfect Pivot Brises 360')
  where id in ('6a51475e-cd59-4690-a4be-b07b229937d5', '60e38027-f2e7-42f8-b1bb-414903fce020');

update posts set produto_id = (select id from produtos where nome = 'SI Rotary 35')
  where id in ('4a86b3dd-28c7-425f-bc0f-ad74e5804c9e');

update posts set produto_id = (select id from produtos where nome = 'Coplanar 2 Portas')
  where id in ('d28fe959-5334-490b-87fa-c5bdc32eb53f');

update posts set produto_id = (select id from produtos where nome = 'OPK Perfect Pivot')
  where id in ('8b23cffa-bd21-4e72-9fe1-0de6dd51b138', '15d55dfe-68c7-4053-8035-ba2e5a14842f');

update posts set produto_id = (select id from produtos where nome = 'Si Rotary Easy')
  where id in ('579172bc-2642-428a-9c71-75b3168485f3');

update posts set produto_id = (select id from produtos where nome = 'Perfect Pocket Wood')
  where id in ('38c32230-af33-4295-833f-99d5590da522', '7bee88a0-3539-4c50-b394-6084a8f5b913');

update posts set produto_id = (select id from produtos where nome = 'Perfect Pocket Slim')
  where id in ('a05e79b8-807b-45c1-a192-8de3a0380cf3', '012235d1-2de1-45ff-86e2-f7930746ec76');

update posts set produto_id = (select id from produtos where nome = 'OPK Perfect Synchro')
  where id in ('ac1f09dd-aba3-4b77-9a4c-6551bd636112');

