/** Mensagens do resultado de "adicionar jogo(s)" — puro, testavel. */

export type SkipReason = "duplicate" | "not_found" | "steam_error";

const SKIP_LABEL: Record<SkipReason, string> = {
  duplicate: "ja estava na lista",
  not_found: "nao encontrado na Steam",
  steam_error: "a Steam nao respondeu",
};

/** Sucesso quando 1+ jogos entraram, citando os que ficaram de fora. */
export function summarizeAddResult(
  added: { title: string }[],
  skipped: { term: string; reason: SkipReason }[],
): string {
  const head =
    added.length === 1
      ? `"${added[0].title}" adicionado a lista.`
      : `${added.length} jogos adicionados a lista.`;
  if (skipped.length === 0) return head;
  const tail = skipped
    .map((s) => `"${s.term}" (${SKIP_LABEL[s.reason] ?? "nao adicionado"})`)
    .join(", ");
  return `${head} Nao entraram: ${tail}.`;
}
