export const COR_TIPO_IDEIA: Record<string, string> = {
  Quiz: "#6366f1",
  Enquete: "#14b8a6",
  "Verdadeiro ou Falso": "#f59e0b",
  "Antes e Depois": "#ec4899",
  Produto: "#68a04a",
  Tendência: "#3b82f6",
  Bastidores: "#a855f7",
  Obras: "#f97316",
  Depoimentos: "#14b8a6",
  Outro: "#71717a",
};

export function corTipoIdeia(tipo: string): string {
  return COR_TIPO_IDEIA[tipo] ?? "#71717a";
}
