-- Siforma — Calendário de Marketing
-- Adiciona responsável e checklist de produção aos posts, parte do redesign
-- do calendário editorial (sidebar, cards de estatística, painel de
-- detalhe). Seguro executar mais de uma vez.

alter table posts add column if not exists responsavel text;

alter table posts add column if not exists checklist jsonb not null default
  '[
    {"item":"Roteiro","feito":false},
    {"item":"Gravação","feito":false},
    {"item":"Edição","feito":false},
    {"item":"Arte/Capa","feito":false},
    {"item":"Agendado","feito":false},
    {"item":"Publicado","feito":false}
  ]'::jsonb;
