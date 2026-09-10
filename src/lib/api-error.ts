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
  const fallback =
    status === 502 || status === 503
      ? "Servico indisponivel no momento. Tente de novo em instantes."
      : status >= 500
        ? "Erro no servidor. Tente novamente."
        : "Nao foi possivel completar a acao.";
  const message = typeof b.error === "string" && b.error ? b.error : fallback;
  const code = typeof b.code === "string" ? b.code : undefined;
  return new ApiError(message, status, code);
}
