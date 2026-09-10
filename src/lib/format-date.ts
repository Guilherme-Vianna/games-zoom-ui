const TZ = "America/Sao_Paulo";

/** "10/09/2026" no fuso de Brasilia. */
export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("pt-BR", { timeZone: TZ, dateStyle: "short" }).format(
    new Date(iso),
  );
}

/** "10/09/2026 14:30". */
export function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: TZ,
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(iso));
}

/**
 * Texto curto do prazo de um link. `null` = nunca expira.
 * Puro (recebe `now`), testavel.
 */
export function expiryLabel(
  expiresAtIso: string | null,
  now: Date = new Date(),
): string {
  if (!expiresAtIso) return "nunca expira";
  const diffMs = new Date(expiresAtIso).getTime() - now.getTime();
  if (diffMs <= 0) return "expirado";

  const minutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days >= 1) return `expira em ${days} ${days === 1 ? "dia" : "dias"}`;
  if (hours >= 1) return `expira em ${hours}h`;
  return `expira em ${Math.max(1, minutes)} min`;
}
