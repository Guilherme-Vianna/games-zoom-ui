import { describe, expect, it } from "vitest";
import {
  DELIVERY_HOUR_OPTIONS,
  DEFAULT_DELIVERY_HOUR,
  formatHourLabel,
  parseDeliveryHour,
} from "./delivery-hour";

describe("formatHourLabel", () => {
  it("formata com dois digitos", () => {
    expect(formatHourLabel(0)).toBe("00:00");
    expect(formatHourLabel(9)).toBe("09:00");
    expect(formatHourLabel(21)).toBe("21:00");
  });
});

describe("DELIVERY_HOUR_OPTIONS", () => {
  it("tem 24 opcoes de 0 a 23", () => {
    expect(DELIVERY_HOUR_OPTIONS).toHaveLength(24);
    expect(DELIVERY_HOUR_OPTIONS[0]).toEqual({ value: 0, label: "00:00" });
    expect(DELIVERY_HOUR_OPTIONS[23]).toEqual({ value: 23, label: "23:00" });
  });
});

describe("parseDeliveryHour", () => {
  it("aceita string e numero", () => {
    expect(parseDeliveryHour("21")).toBe(21);
    expect(parseDeliveryHour(7)).toBe(7);
  });
  it("clampa 0-23", () => {
    expect(parseDeliveryHour(-3)).toBe(0);
    expect(parseDeliveryHour(99)).toBe(23);
  });
  it("default para lixo", () => {
    expect(parseDeliveryHour("abc")).toBe(DEFAULT_DELIVERY_HOUR);
    expect(parseDeliveryHour(null)).toBe(DEFAULT_DELIVERY_HOUR);
  });
});
