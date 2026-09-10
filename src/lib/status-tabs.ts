import type { ItemStatus } from "@/lib/types";

/**
 * Abas da pagina de uma lista. `?tab=` na URL e a fonte da verdade.
 * A aba padrao ("normal") nao coloca o param.
 */
export const STATUS_TABS = [
  { value: "normal", label: "Preco normal", status: "regular" as ItemStatus },
  { value: "promocao", label: "Em promocao", status: "onSale" as ItemStatus },
  { value: "em-breve", label: "Em breve", status: "unreleased" as ItemStatus },
] as const;

export type TabValue = (typeof STATUS_TABS)[number]["value"];

export const DEFAULT_TAB: TabValue = "normal";

export type ParsedTab =
  | { kind: "status"; value: TabValue; status: ItemStatus }
  | { kind: "acessos" };

/** Interpreta `?tab=`. Valores desconhecidos caem na aba padrao. */
export function parseTab(tab: string | null | undefined): ParsedTab {
  if (tab === "acessos") return { kind: "acessos" };
  const found = STATUS_TABS.find((t) => t.value === tab) ?? STATUS_TABS[0];
  return { kind: "status", value: found.value, status: found.status };
}

/** Status da API para uma aba (null quando nao e aba de status). */
export function tabToStatus(tab: string | null | undefined): ItemStatus | null {
  const parsed = parseTab(tab);
  return parsed.kind === "status" ? parsed.status : null;
}
