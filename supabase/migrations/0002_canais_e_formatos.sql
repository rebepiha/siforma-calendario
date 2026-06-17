-- Siforma — Calendário de Marketing
-- Atualiza o significado de `canal` (agora é a rede social: Instagram/LinkedIn/
-- YouTube) e de `formato` (agora inclui Feed e Stories). Como é um rename de
-- valor de enum, os posts já cadastrados são atualizados automaticamente,
-- sem precisar de UPDATE manual. Seguro executar mais de uma vez.

do $$
begin
  if exists (
    select 1 from pg_enum where enumtypid = 'canal_enum'::regtype and enumlabel = 'feed'
  ) then
    alter type canal_enum rename value 'feed' to 'instagram';
  end if;
end $$;

do $$
begin
  if exists (
    select 1 from pg_enum where enumtypid = 'canal_enum'::regtype and enumlabel = 'story'
  ) then
    alter type canal_enum rename value 'story' to 'youtube';
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_enum where enumtypid = 'canal_enum'::regtype and enumlabel = 'linkedin'
  ) then
    alter type canal_enum add value 'linkedin';
  end if;
end $$;

do $$
begin
  if exists (
    select 1 from pg_enum where enumtypid = 'formato_enum'::regtype and enumlabel = 'post'
  ) then
    alter type formato_enum rename value 'post' to 'feed';
  end if;
end $$;

do $$
begin
  if exists (
    select 1 from pg_enum where enumtypid = 'formato_enum'::regtype and enumlabel = 'story_estatico'
  ) then
    alter type formato_enum rename value 'story_estatico' to 'stories';
  end if;
end $$;

alter table posts alter column canal set default 'instagram';
alter table posts alter column formato set default 'feed';
