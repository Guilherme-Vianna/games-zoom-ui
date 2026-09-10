import { describe, expect, it } from "vitest";
import { DEFAULT_TAB, parseTab, tabToStatus } from "./status-tabs";

describe("parseTab", () => {
  it("default para valor ausente ou desconhecido", () => {
    expect(parseTab(undefined)).toEqual({ kind: "status", value: DEFAULT_TAB, status: "regular" });
    expect(parseTab("xpto")).toEqual({ kind: "status", value: "normal", status: "regular" });
  });
  it("promocao -> onSale", () => {
    expect(parseTab("promocao")).toEqual({ kind: "status", value: "promocao", status: "onSale" });
  });
  it("em-breve -> unreleased", () => {
    expect(parseTab("em-breve")).toMatchObject({ status: "unreleased" });
  });
  it("acessos", () => {
    expect(parseTab("acessos")).toEqual({ kind: "acessos" });
  });
});

describe("tabToStatus", () => {
  it("retorna o status da aba", () => {
    expect(tabToStatus("promocao")).toBe("onSale");
    expect(tabToStatus(undefined)).toBe("regular");
  });
  it("null para a aba de acessos", () => {
    expect(tabToStatus("acessos")).toBeNull();
  });
});
