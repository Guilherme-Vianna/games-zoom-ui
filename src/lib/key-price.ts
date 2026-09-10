import type { GameFields } from "@/lib/types";

export type BestKeyOffer = {
  cents: number;
  formatted: string;
  kind: "keyshop" | "retail";
};

/**
 * Melhor oferta de chave de um jogo: prefere keyshop (revendedor), cai para
 * loja oficial. `null` quando nao ha nenhuma.
 */
export function bestKeyOffer(item: {
  keyKeyshop: GameFields["keyKeyshop"];
  keyRetail: GameFields["keyRetail"];
}): BestKeyOffer | null {
  if (item.keyKeyshop) return { ...item.keyKeyshop, kind: "keyshop" };
  if (item.keyRetail) return { ...item.keyRetail, kind: "retail" };
  return null;
}

/** Rotulo curto para o badge do card. `null` = sem oferta. */
export function keyPriceBadge(item: {
  keyKeyshop: GameFields["keyKeyshop"];
  keyRetail: GameFields["keyRetail"];
}): string | null {
  const best = bestKeyOffer(item);
  if (!best) return null;
  return `Chave a partir de ${best.formatted}`;
}
