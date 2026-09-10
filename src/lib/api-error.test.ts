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

  it("401/403 sem corpo -> aponta para API_BASE_URL / protecao de deploy", () => {
    expect(toApiError(401, {}).message).toMatch(/API_BASE_URL/);
    expect(toApiError(403, null).message).toMatch(/recusou a conexao/i);
  });

  it("404 sem corpo -> rota nao encontrada", () => {
    expect(toApiError(404, {}).message).toMatch(/Rota nao encontrada/i);
  });

  it("502/503 -> indisponivel", () => {
    expect(toApiError(502, {}).message).toMatch(/indispon/i);
  });

  it("500 sem corpo -> erro no servidor com status", () => {
    expect(toApiError(500, null).message).toMatch(/HTTP 500/);
  });

  it("4xx generico inclui o status", () => {
    expect(toApiError(422, {}).message).toBe("Nao foi possivel completar a acao (HTTP 422).");
  });

  it("ignora error nao-string", () => {
    expect(toApiError(400, { error: 123 }).message).toContain("HTTP 400");
  });
});
