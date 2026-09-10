import { describe, expect, it } from "vitest";
import { ApiError, toApiError } from "./api-error";

describe("toApiError", () => {
  it("usa a mensagem da API quando presente", () => {
    const err = toApiError(409, { error: "Esse jogo ja esta na lista." });
    expect(err).toBeInstanceOf(ApiError);
    expect(err.message).toBe("Esse jogo ja esta na lista.");
    expect(err.status).toBe(409);
  });

  it("propaga o code quando presente", () => {
    expect(toApiError(403, { error: "x", code: "EMAIL_NOT_VERIFIED" }).code).toBe(
      "EMAIL_NOT_VERIFIED",
    );
  });

  it("fallback para 502/503", () => {
    expect(toApiError(502, {}).message).toMatch(/indispon/i);
  });

  it("fallback generico para 500", () => {
    expect(toApiError(500, null).message).toMatch(/servidor/i);
  });

  it("fallback generico para 4xx sem corpo", () => {
    expect(toApiError(400, {}).message).toBe("Nao foi possivel completar a acao.");
  });

  it("ignora error nao-string", () => {
    expect(toApiError(400, { error: 123 }).message).toBe("Nao foi possivel completar a acao.");
  });
});
