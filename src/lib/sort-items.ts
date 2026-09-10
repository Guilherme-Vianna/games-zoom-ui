import { priceSortKey } from "@/lib/price";
import { normalize } from "@/lib/text";
import type { WishlistItem } from "@/lib/types";

export const SORT_OPTIONS = [
  { value: "recent", label: "Adicionados por ultimo" },
  { value: "oldest", label: "Adicionados primeiro" },
  { value: "price_asc", label: "Menor preco" },
  { value: "price_desc", label: "Maior preco" },
  { value: "discount", label: "Maior desconto" },
  { value: "title", label: "Nome (A-Z)" },
  { value: "author", label: "Quem adicionou" },
] as const;

export type SortValue = (typeof SORT_OPTIONS)[number]["value"];

export const DEFAULT_SORT: SortValue = "recent";

export function parseSort(value: string | null | undefined): SortValue {
  return SORT_OPTIONS.some((o) => o.value === value) ? (value as SortValue) : DEFAULT_SORT;
}

/** Ordena uma copia de `items`. Puro e estavel (empate -> mais recente primeiro). */
export function sortItems(items: readonly WishlistItem[], sort: SortValue): WishlistItem[] {
  const byRecent = (a: WishlistItem, b: WishlistItem) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

  const comparators: Record<SortValue, (a: WishlistItem, b: WishlistItem) => number> = {
    recent: byRecent,
    oldest: (a, b) => -byRecent(a, b),
    price_asc: (a, b) =>
      priceSortKey(a.priceOverview, a.isFree) - priceSortKey(b.priceOverview, b.isFree) ||
      byRecent(a, b),
    price_desc: (a, b) =>
      priceSortKey(b.priceOverview, b.isFree) - priceSortKey(a.priceOverview, a.isFree) ||
      byRecent(a, b),
    discount: (a, b) =>
      (b.priceOverview?.discountPercent ?? 0) - (a.priceOverview?.discountPercent ?? 0) ||
      byRecent(a, b),
    title: (a, b) => normalize(a.title).localeCompare(normalize(b.title)) || byRecent(a, b),
    author: (a, b) =>
      normalize(a.addedByName).localeCompare(normalize(b.addedByName)) || byRecent(a, b),
  };

  return [...items].sort(comparators[sort]);
}
