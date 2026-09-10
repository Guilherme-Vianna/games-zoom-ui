/**
 * Sequencia de paginas a exibir no controle de paginacao, com "..." onde ha
 * salto. Ex.: pageRange(5, 20) -> [1, "...", 4, 5, 6, "...", 20].
 */
export function pageRange(
  page: number,
  totalPages: number,
  opts: { siblings?: number } = {},
): (number | "ellipsis")[] {
  const siblings = opts.siblings ?? 1;
  if (totalPages <= 0) return [];

  // Poucas paginas: mostra todas, sem elipse.
  const maxInline = 5 + siblings * 2;
  if (totalPages <= maxInline) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const current = Math.min(Math.max(1, page), totalPages);
  const first = 1;
  const last = totalPages;

  const start = Math.max(first, current - siblings);
  const end = Math.min(last, current + siblings);

  const pages: (number | "ellipsis")[] = [];

  if (start > first) {
    pages.push(first);
    if (start > first + 1) pages.push("ellipsis");
  }

  for (let p = start; p <= end; p++) pages.push(p);

  if (end < last) {
    if (end < last - 1) pages.push("ellipsis");
    pages.push(last);
  }

  return pages;
}
