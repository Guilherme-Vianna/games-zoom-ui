"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { refreshListAction } from "@/actions/wishlists";
import { cn } from "@/lib/utils";

export function RefreshListButton({ wishlistId }: { wishlistId: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        start(async () => {
          const res = await refreshListAction(wishlistId);
          if (!res.ok) toast.error(res.error ?? "Falhou.");
          else {
            toast.success(res.summary ?? "Lista atualizada.");
            router.refresh();
          }
        })
      }
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg bg-surface-2 px-3 py-1.5 text-sm font-medium transition-colors hover:bg-border disabled:opacity-50",
      )}
    >
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className={pending ? "animate-spin" : ""}
      >
        <path d="M21 12a9 9 0 1 1-2.64-6.36" />
        <path d="M21 3v6h-6" />
      </svg>
      {pending ? "Atualizando..." : "Atualizar lista"}
    </button>
  );
}
