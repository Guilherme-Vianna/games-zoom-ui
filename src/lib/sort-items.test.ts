import { describe, expect, it } from "vitest";
import { parseSort, sortItems } from "./sort-items";
import type { WishlistItem } from "./types";

function item(over: Partial<WishlistItem>): WishlistItem {
  return {
    id: Math.random().toString(36),
    steamAppId: 1,
    title: "Jogo",
    imageUrl: null,
    storeUrl: "",
    isFree: false,
    priceOverview: null,
    releaseStatus: "released",
    onSale: false,
    discountPercent: 0,
    status: "regular",
    lastSyncedAt: null,
    keyRetail: null,
    keyKeyshop: null,
    keyHistoricalKeyshop: null,
    keyDealsUrl: null,
    keysLastSyncedAt: null,
    addedById: "u",
    addedByName: "Alguem",
    createdAt: "2026-01-01T00:00:00.000Z",
    ...over,
  };
}

const cs = item({
  title: "Counter-Strike",
  addedByName: "Bruno",
  createdAt: "2026-01-03T00:00:00Z",
  priceOverview: { currency: "BRL", initial: 4000, final: 2000, discountPercent: 50, finalFormatted: "" },
});
const free = item({ title: "Apex", addedByName: "Ana", createdAt: "2026-01-02T00:00:00Z", isFree: true });
const bg3 = item({
  title: "Baldurs Gate 3",
  addedByName: "Ana",
  createdAt: "2026-01-01T00:00:00Z",
  priceOverview: { currency: "BRL", initial: 20000, final: 20000, discountPercent: 0, finalFormatted: "" },
});
const all = [cs, free, bg3];

describe("parseSort", () => {
  it("valida ou cai no default", () => {
    expect(parseSort("price_asc")).toBe("price_asc");
    expect(parseSort("xxx")).toBe("recent");
    expect(parseSort(null)).toBe("recent");
  });
});

describe("sortItems", () => {
  it("nao muta o array original", () => {
    const copy = [...all];
    sortItems(all, "title");
    expect(all).toEqual(copy);
  });
  it("recent: mais novo primeiro", () => {
    expect(sortItems(all, "recent").map((i) => i.title)).toEqual([
      "Counter-Strike",
      "Apex",
      "Baldurs Gate 3",
    ]);
  });
  it("oldest: inverte", () => {
    expect(sortItems(all, "oldest")[0].title).toBe("Baldurs Gate 3");
  });
  it("price_asc: gratuito primeiro, depois barato->caro", () => {
    expect(sortItems(all, "price_asc").map((i) => i.title)).toEqual([
      "Apex",
      "Counter-Strike",
      "Baldurs Gate 3",
    ]);
  });
  it("price_desc: caro primeiro", () => {
    expect(sortItems(all, "price_desc")[0].title).toBe("Baldurs Gate 3");
  });
  it("discount: maior desconto primeiro", () => {
    expect(sortItems(all, "discount")[0].title).toBe("Counter-Strike");
  });
  it("title: alfabetico", () => {
    expect(sortItems(all, "title").map((i) => i.title)).toEqual([
      "Apex",
      "Baldurs Gate 3",
      "Counter-Strike",
    ]);
  });
  it("author: por quem adicionou, empate por mais recente", () => {
    const r = sortItems(all, "author");
    expect(r.map((i) => i.addedByName)).toEqual(["Ana", "Ana", "Bruno"]);
    expect(r[0].title).toBe("Apex"); // Ana mais recente
  });
});
