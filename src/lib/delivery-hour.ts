/**
 * Hora de envio do resumo de promocoes. Interpretada no fuso de Brasilia
 * (America/Sao_Paulo) — o backend faz o match com a hora local.
 */

export const DEFAULT_DELIVERY_HOUR = 9;

export function formatHourLabel(hour: number): string {
  return `${String(hour).padStart(2, "0")}:00`;
}

export const DELIVERY_HOUR_OPTIONS = Array.from({ length: 24 }, (_, h) => ({
  value: h,
  label: formatHourLabel(h),
}));

/** Normaliza um valor de formulario para uma hora valida (0-23). */
export function parseDeliveryHour(value: unknown): number {
  const n =
    typeof value === "number"
      ? value
      : typeof value === "string" && value.trim() !== ""
        ? Number(value)
        : NaN;
  if (!Number.isFinite(n)) return DEFAULT_DELIVERY_HOUR;
  return Math.min(23, Math.max(0, Math.trunc(n)));
}
