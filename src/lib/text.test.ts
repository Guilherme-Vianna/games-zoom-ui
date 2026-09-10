import { describe, expect, it } from "vitest";
import { matchesQuery, normalize } from "./text";

describe("normalize", () => {
  it("remove acentos e caixa", () => {
    expect(normalize("Ação  ")).toBe("acao");
    expect(normalize("BALDUR'S GATE")).toBe("baldur's gate");
  });
});

describe("matchesQuery", () => {
  it("query vazia casa com tudo", () => {
    expect(matchesQuery("qualquer coisa", "")).toBe(true);
    expect(matchesQuery("x", "   ")).toBe(true);
  });
  it("casa ignorando acento e caixa", () => {
    expect(matchesQuery("Counter-Strike 2", "counter")).toBe(true);
    expect(matchesQuery("Elden Ring", "eldén")).toBe(true);
  });
  it("todos os termos precisam casar (AND)", () => {
    expect(matchesQuery("The Witcher 3: Wild Hunt", "witcher hunt")).toBe(true);
    expect(matchesQuery("The Witcher 3", "witcher zelda")).toBe(false);
  });
  it("nao casa quando o termo nao aparece", () => {
    expect(matchesQuery("Hades", "hollow")).toBe(false);
  });
});
