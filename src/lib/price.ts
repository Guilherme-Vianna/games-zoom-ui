export type PriceOverview = {
  currency: string;
  initial: number;
  final: number;
  discountPercent: number;
  finalFormatted: string;
};

/** Formata centavos como moeda BR (fallback quando a Steam nao mandou `final_formatted`). */
export function formatCents(cents: number, currency = "BRL"): string {
  const symbol = currency === "BRL" ? "R$ " : `${currency} `;
  return `${symbol}${(cents / 100).toFixed(2).replace(".", ",")}`;
}

/** Texto de preco a exibir no card do jogo. */
export function formatPrice(price: PriceOverview | null, isFree: boolean): string {
  if (isFree) return "Gratuito";
  if (!price) return "Preco indisponivel";
  if (price.finalFormatted) return price.finalFormatted;
  return formatCents(price.final, price.currency);
}

/** "-50%" quando ha desconto ativo; senao null. */
export function discountLabel(price: PriceOverview | null): string | null {
  if (!price || price.discountPercent <= 0) return null;
  return `-${price.discountPercent}%`;
}

/** Preco "cheio" riscado, quando ha desconto. */
export function originalPrice(price: PriceOverview | null): string | null {
  if (!price || price.discountPercent <= 0 || !price.initial) return null;
  return formatCents(price.initial, price.currency);
}

/** Chave numerica para ordenar por preco (gratuito = 0, indisponivel = infinito). */
export function priceSortKey(price: PriceOverview | null, isFree: boolean): number {
  if (isFree) return 0;
  if (!price) return Number.POSITIVE_INFINITY;
  return price.final;
}
