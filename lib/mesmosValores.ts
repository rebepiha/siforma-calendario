export function mesmosValores<T extends object>(a: T, b: T): boolean {
  return (Object.keys(a) as (keyof T)[]).every((chave) => a[chave] === b[chave]);
}
