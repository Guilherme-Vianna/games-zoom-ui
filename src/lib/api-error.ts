export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/** Constroi um ApiError a partir do corpo de erro da API. Puro — testavel. */
export function toApiError(status: number, body: unknown): ApiError {
  const b = (body ?? {}) as { error?: unknown; code?: unknown };
  const code = typeof b.code === "string" ? b.code : undefined;

  // A API sempre responde `{ error }` em pt-BR. Se veio uma mensagem, usa ela.
  if (typeof b.error === "string" && b.error) {
    return new ApiError(b.error, status, code);
  }

  // Sem corpo util: provavelmente a request nem chegou no handler
  // (proxy/protecao de deploy/rota errada). Inclui o status pra facilitar o debug.
  const fallback =
    status === 401 || status === 403
      ? `A API recusou a conexao (HTTP ${status}). Verifique API_BASE_URL e a protecao de deploy da API.`
      : status === 404
        ? `Rota nao encontrada na API (HTTP 404). Verifique API_BASE_URL.`
        : status === 502 || status === 503
          ? "Servico indisponivel no momento. Tente de novo em instantes."
          : status >= 500
            ? `Erro no servidor da API (HTTP ${status}).`
            : `Nao foi possivel completar a acao (HTTP ${status}).`;
  return new ApiError(fallback, status, code);
}
