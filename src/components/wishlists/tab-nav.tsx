"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

export function TabNav({
  tabs,
  param = "tab",
  clearParams = ["page"],
}: {
  tabs: { value: string; label: string; badge?: number }[];
  param?: string;
  /** params removidos ao trocar de aba (default: zera a paginacao) */
  clearParams?: string[];
}) {
  const pathname = usePathname();
  const params = useSearchParams();
  const active = params.get(param) ?? tabs[0]?.value;

  return (
    <div className="flex flex-wrap gap-1 rounded-lg bg-surface-2 p-1">
      {tabs.map((t) => {
        const isActive = active === t.value;
        const next = new URLSearchParams(params.toString());
        for (const c of clearParams) next.delete(c);
        if (t.value === tabs[0]?.value) next.delete(param);
        else next.set(param, t.value);
        const qs = next.toString();
        return (
          <Link
            key={t.value}
            href={qs ? `${pathname}?${qs}` : pathname}
            scroll={false}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors",
              isActive
                ? "bg-background font-medium text-foreground shadow-sm"
                : "text-muted hover:text-foreground",
            )}
          >
            {t.label}
            {typeof t.badge === "number" ? (
              <span className="rounded bg-surface-2 px-1 text-xs text-muted">{t.badge}</span>
            ) : null}
          </Link>
        );
      })}
    </div>
  );
}
