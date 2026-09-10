import { describe, expect, it } from "vitest";
import { expiryLabel, formatDate } from "./format-date";

describe("formatDate", () => {
  it("formata em pt-BR / Brasilia", () => {
    // 2026-01-01T02:00:00Z = 2025-12-31 23:00 em Brasilia (UTC-3)
    expect(formatDate("2026-01-01T02:00:00.000Z")).toBe("31/12/2025");
  });
});

describe("expiryLabel", () => {
  const now = new Date("2026-01-10T12:00:00.000Z");

  it("null = nunca expira", () => {
    expect(expiryLabel(null, now)).toBe("nunca expira");
  });
  it("data no passado = expirado", () => {
    expect(expiryLabel("2026-01-09T12:00:00Z", now)).toBe("expirado");
  });
  it("dias", () => {
    expect(expiryLabel("2026-01-13T12:00:00Z", now)).toBe("expira em 3 dias");
    expect(expiryLabel("2026-01-11T13:00:00Z", now)).toBe("expira em 1 dia");
  });
  it("horas", () => {
    expect(expiryLabel("2026-01-10T18:00:00Z", now)).toBe("expira em 6h");
  });
  it("minutos", () => {
    expect(expiryLabel("2026-01-10T12:30:00Z", now)).toBe("expira em 30 min");
  });
});
