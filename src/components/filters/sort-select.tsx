"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SORT_OPTIONS, DEFAULT_SORT } from "@/lib/sort-items";

export function SortSelect() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const current = params.get("sort") ?? DEFAULT_SORT;

  return (
    <label className="flex items-center gap-2 text-sm text-muted">
      <span className="hidden sm:inline">Ordenar</span>
      <select
        value={current}
        onChange={(e) => {
          const next = new URLSearchParams(params.toString());
          if (e.target.value === DEFAULT_SORT) next.delete("sort");
          else next.set("sort", e.target.value);
          router.replace(`${pathname}?${next.toString()}`, { scroll: false });
        }}
        className="h-9 rounded-lg border border-border bg-surface px-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
      >
        {SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
