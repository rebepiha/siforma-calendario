export const PALETA_ETIQUETAS = [
  "#22c55e", // verde
  "#84cc16", // verde-limão
  "#eab308", // amarelo
  "#f97316", // laranja
  "#ef4444", // vermelho
  "#ec4899", // rosa
  "#a855f7", // roxo
  "#6366f1", // índigo
  "#3b82f6", // azul
  "#06b6d4", // ciano
  "#14b8a6", // teal
  "#71717a", // cinza
];

export function corTextoContraste(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminancia = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminancia > 0.6 ? "#18181b" : "#ffffff";
}
