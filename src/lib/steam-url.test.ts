import { describe, expect, it } from "vitest";
import { extractSteamAppId, looksLikeSteamInput, splitGameInput } from "./steam-url";

describe("extractSteamAppId", () => {
  it("aceita AppID puro", () => {
    expect(extractSteamAppId("730")).toBe(730);
  });
  it("aceita link da loja com querystring", () => {
    expect(
      extractSteamAppId("https://store.steampowered.com/app/1086940/Baldurs_Gate_3/?snr=1_7"),
    ).toBe(1086940);
  });
  it("aceita link da comunidade", () => {
    expect(extractSteamAppId("steamcommunity.com/app/440")).toBe(440);
  });
  it("faz trim", () => {
    expect(extractSteamAppId("  570  ")).toBe(570);
  });
  it("rejeita texto solto", () => {
    expect(extractSteamAppId("baldurs gate")).toBeNull();
  });
  it("rejeita dominio nao-Steam com /app/", () => {
    expect(extractSteamAppId("https://x.com/app/730")).toBeNull();
  });
  it("rejeita vazio/nulo", () => {
    expect(extractSteamAppId("")).toBeNull();
    expect(extractSteamAppId(null)).toBeNull();
  });
});

describe("looksLikeSteamInput", () => {
  it("true para entrada valida", () => {
    expect(looksLikeSteamInput("https://store.steampowered.com/app/730/")).toBe(true);
  });
  it("false para entrada invalida", () => {
    expect(looksLikeSteamInput("nao")).toBe(false);
  });
});

describe("splitGameInput", () => {
  it("vazio -> []", () => {
    expect(splitGameInput("   ")).toEqual([]);
  });
  it("sem separador -> 1 entrada (link com querystring intacto)", () => {
    expect(splitGameInput("https://store.steampowered.com/app/570/?snr=1_7_7")).toEqual([
      "https://store.steampowered.com/app/570/?snr=1_7_7",
    ]);
  });
  it("quebra por virgula, ; e quebra de linha, com trim", () => {
    expect(splitGameInput("Hades, Celeste\n Katana ZERO ; 730")).toEqual([
      "Hades",
      "Celeste",
      "Katana ZERO",
      "730",
    ]);
  });
});
