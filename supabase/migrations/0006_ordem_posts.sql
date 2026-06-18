-- Siforma — Calendário de Marketing
-- Adiciona a coluna `ordem` na tabela posts, usada para reordenar posts dentro do
-- mesmo dia por drag-and-drop no Calendário Editorial (mesmo padrão já usado em
-- `tarefas`, cuja coluna `ordem` já existia em produção mas nunca foi capturada
-- numa migration deste repo — esta migration também a recria de forma idempotente,
-- pra cobrir o caso de reconstruir o banco do zero).
-- É seguro executar este script mais de uma vez (idempotente).

alter table posts add column if not exists ordem integer not null default 0;
alter table tarefas add column if not exists ordem integer not null default 0;
