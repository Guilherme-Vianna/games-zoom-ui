"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import type { ActionResult } from "@/actions/wishlists";
import { cn } from "@/lib/utils";

/**
 * Botao generico que dispara uma server action que retorna `ActionResult`,
 * mostra toast de erro e (opcional) pede confirmacao antes.
 */
export function ActionButton({
  action,
  confirm: confirmText,
  successToast,
  children,
  className,
  variant = "ghost",
}: {
  action: () => Promise<ActionResult>;
  confirm?: string;
  successToast?: string;
  children: React.ReactNode;
  className?: string;
  variant?: "ghost" | "danger" | "link";
}) {
  const [pending, start] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (confirmText && !window.confirm(confirmText)) return;
        start(async () => {
          const res = await action();
          if (!res.ok && res.error) toast.error(res.error);
          else if (res.ok && successToast) toast.success(successToast);
        });
      }}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50",
        variant === "ghost" && "bg-surface-2 px-3 py-1.5 hover:bg-border",
        variant === "danger" && "bg-danger/15 px-3 py-1.5 text-danger hover:bg-danger/25",
        variant === "link" && "text-xs text-muted underline hover:text-danger",
        className,
      )}
    >
      {pending ? "..." : children}
    </button>
  );
}
