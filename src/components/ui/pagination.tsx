"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { pageRange } from "@/lib/pagination-range";
import { cn } from "@/lib/utils";

/**
 * Controle de paginacao por numero de pagina. `?<paramName>=` na URL e a fonte
 * da verdade; a pagina 1 nao coloca o param.
 */
export function Pagination({
  page,
  totalPages,
  paramName = "page",
}: {
  page: number;
  totalPages: number;
  paramName?: string;
}) {
  const pathname = usePathname();
  const params = useSearchParams();

  if (totalPages <= 1) return null;

  const href = (target: number) => {
    const next = new URLSearchParams(params.toString());
    if (target <= 1) next.delete(paramName);
    else next.set(paramName, String(target));
    const qs = next.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  };

  const items = pageRange(page, totalPages);
  const base =
    "inline-flex h-9 min-w-9 items-center justify-center rounded-md border border-border px-2 text-sm transition-colors";

  return (
    <nav
      className="flex flex-wrap items-center justify-center gap-1"
      aria-label="Paginacao"
    >
      <Link
        href={href(page - 1)}
        scroll={false}
        aria-disabled={page <= 1}
        className={cn(
          base,
          page <= 1
            ? "pointer-events-none opacity-40"
            : "text-muted hover:border-primary hover:text-foreground",
        )}
      >
        Anterior
      </Link>

      {items.map((it, i) =>
        it === "ellipsis" ? (
          <span key={`e${i}`} className="px-1 text-sm text-muted">
            &hellip;
          </span>
        ) : (
          <Link
            key={it}
            href={href(it)}
            scroll={false}
            aria-current={it === page ? "page" : undefined}
            className={cn(
              base,
              it === page
                ? "border-primary bg-primary text-primary-foreground"
                : "text-muted hover:border-primary hover:text-foreground",
            )}
          >
            {it}
          </Link>
        ),
      )}

      <Link
        href={href(page + 1)}
        scroll={false}
        aria-disabled={page >= totalPages}
        className={cn(
          base,
          page >= totalPages
            ? "pointer-events-none opacity-40"
            : "text-muted hover:border-primary hover:text-foreground",
        )}
      >
        Proxima
      </Link>
    </nav>
  );
}
