import { describe, expect, it } from "vitest";
import { pageRange } from "./pagination-range";

describe("pageRange", () => {
  it("lista tudo quando cabe", () => {
    expect(pageRange(1, 5)).toEqual([1, 2, 3, 4, 5]);
  });
  it("elipse dos dois lados no meio", () => {
    expect(pageRange(10, 20)).toEqual([1, "ellipsis", 9, 10, 11, "ellipsis", 20]);
  });
  it("sem elipse esquerda perto do inicio", () => {
    expect(pageRange(2, 20)).toEqual([1, 2, 3, "ellipsis", 20]);
  });
  it("sem elipse direita perto do fim", () => {
    expect(pageRange(19, 20)).toEqual([1, "ellipsis", 18, 19, 20]);
  });
  it("nao gera elipse para gap de 1 (usa o numero)", () => {
    expect(pageRange(3, 5)).toEqual([1, 2, 3, 4, 5]);
  });
  it("clampa page fora do range", () => {
    expect(pageRange(99, 3)).toEqual([1, 2, 3]);
  });
  it("total 0 -> vazio", () => {
    expect(pageRange(1, 0)).toEqual([]);
  });
});
