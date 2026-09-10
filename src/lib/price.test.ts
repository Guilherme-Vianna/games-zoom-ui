import { describe, expect, it } from "vitest";
import {
  discountLabel,
  formatCents,
  formatPrice,
  originalPrice,
  priceSortKey,
  type PriceOverview,
} from "./price";

const withDiscount: PriceOverview = {
  currency: "BRL",
  initial: 3699,
  final: 1849,
  discountPercent: 50,
  finalFormatted: "R$ 18,49",
};
const noDiscount: PriceOverview = {
  currency: "BRL",
  initial: 5000,
  final: 5000,
  discountPercent: 0,
  finalFormatted: "R$ 50,00",
};

describe("formatCents", () => {
  it("formata BRL", () => {
    expect(formatCents(1849)).toBe("R$ 18,49");
  });
  it("zero centavos", () => {
    expect(formatCents(0)).toBe("R$ 0,00");
  });
  it("outra moeda usa o codigo", () => {
    expect(formatCents(1000, "USD")).toBe("USD 10,00");
  });
});

describe("formatPrice", () => {
  it("gratuito", () => {
    expect(formatPrice(null, true)).toBe("Gratuito");
  });
  it("sem dados de preco", () => {
    expect(formatPrice(null, false)).toBe("Preco indisponivel");
  });
  it("usa finalFormatted quando presente", () => {
    expect(formatPrice(withDiscount, false)).toBe("R$ 18,49");
  });
  it("cai no fallback de centavos sem finalFormatted", () => {
    expect(formatPrice({ ...withDiscount, finalFormatted: "" }, false)).toBe("R$ 18,49");
  });
});

describe("discountLabel / originalPrice", () => {
  it("mostra o desconto", () => {
    expect(discountLabel(withDiscount)).toBe("-50%");
    expect(originalPrice(withDiscount)).toBe("R$ 36,99");
  });
  it("nada quando nao ha desconto", () => {
    expect(discountLabel(noDiscount)).toBeNull();
    expect(originalPrice(noDiscount)).toBeNull();
    expect(discountLabel(null)).toBeNull();
  });
});

describe("priceSortKey", () => {
  it("gratuito ordena primeiro", () => {
    expect(priceSortKey(null, true)).toBe(0);
  });
  it("indisponivel ordena por ultimo", () => {
    expect(priceSortKey(null, false)).toBe(Number.POSITIVE_INFINITY);
  });
  it("usa o preco final", () => {
    expect(priceSortKey(withDiscount, false)).toBe(1849);
  });
});
