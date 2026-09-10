// Combining diacritical marks U+0300–U+036F (via constructor para nao depender
// de como o editor salva os caracteres literais).
const COMBINING_MARKS = new RegExp("[\\u0300-\\u036f]", "g");

/** Normaliza para busca: minusculo, sem acento, sem espaco nas pontas. */
export function normalize(value: string): string {
  return value.normalize("NFD").replace(COMBINING_MARKS, "").toLowerCase().trim();
}

/**
 * `true` se todos os termos de `query` aparecem em `haystack` (busca AND,
 * insensivel a acento/caixa). Query vazia casa com tudo.
 */
export function matchesQuery(haystack: string, query: string): boolean {
  const q = normalize(query);
  if (!q) return true;
  const hay = normalize(haystack);
  return q.split(/\s+/).every((term) => hay.includes(term));
}
