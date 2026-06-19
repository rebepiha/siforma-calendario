// Service worker minimo, só pra satisfazer o critério de instalável (PWA) do
// Chrome/Android. Não cacheia nada de propósito — os dados (posts, tarefas,
// metas) vêm do Supabase em tempo real e mudam o tempo todo entre usuários
// diferentes, então cachear aqui criaria a impressão de dados desatualizados.
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", () => {
  self.clients.claim();
});

self.addEventListener("fetch", () => {
  // intencionalmente vazio: deixa todo request seguir pra rede normalmente.
});
