const PALETA_AVATAR = [
  "#2563eb",
  "#db2777",
  "#16a34a",
  "#d97706",
  "#7c3aed",
  "#0891b2",
  "#dc2626",
];

export function corAvatar(nome: string): string {
  const soma = nome
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return PALETA_AVATAR[soma % PALETA_AVATAR.length];
}

export function inicialAvatar(nome: string): string {
  return nome.trim().charAt(0).toUpperCase() || "?";
}
