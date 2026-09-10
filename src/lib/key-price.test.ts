import { describe, expect, it } from "vitest";
import { bestKeyOffer, keyPriceBadge } from "./key-price";

const ks = { cents: 1399, formatted: "R$ 13,99" };
const rt = { cents: 2799, formatted: "R$ 27,99" };

describe("bestKeyOffer", () => {
  it("prefere keyshop", () => {
    expect(bestKeyOffer({ keyKeyshop: ks, keyRetail: rt })).toEqual({ ...ks, kind: "keyshop" });
  });
  it("cai para retail quando nao ha keyshop", () => {
    expect(bestKeyOffer({ keyKeyshop: null, keyRetail: rt })).toEqual({ ...rt, kind: "retail" });
  });
  it("null quando nao ha nenhuma", () => {
    expect(bestKeyOffer({ keyKeyshop: null, keyRetail: null })).toBeNull();
  });
});

describe("keyPriceBadge", () => {
  it("formata o rotulo", () => {
    expect(keyPriceBadge({ keyKeyshop: ks, keyRetail: null })).toBe("Chave a partir de R$ 13,99");
  });
  it("null sem oferta", () => {
    expect(keyPriceBadge({ keyKeyshop: null, keyRetail: null })).toBeNull();
  });
});
