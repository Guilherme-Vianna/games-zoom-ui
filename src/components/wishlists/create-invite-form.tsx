"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { createInviteAction } from "@/actions/wishlists";
import { Button } from "@/components/ui/button";

const EXPIRY_OPTIONS = [
  { value: "7d", label: "7 dias" },
  { value: "1d", label: "1 dia" },
  { value: "30d", label: "30 dias" },
  { value: "never", label: "Nunca expira" },
] as const;

export function CreateInviteForm({ wishlistId }: { wishlistId: string }) {
  const [expiry, setExpiry] = useState<(typeof EXPIRY_OPTIONS)[number]["value"]>("7d");
  const [pending, start] = useTransition();

  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <select
        value={expiry}
        onChange={(e) => setExpiry(e.target.value as typeof expiry)}
        aria-label="Validade do link"
        className="h-10 rounded-lg border border-border bg-surface px-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
      >
        {EXPIRY_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <Button
        type="button"
        disabled={pending}
        onClick={() =>
          start(async () => {
            const res = await createInviteAction(wishlistId, expiry);
            if (res.ok) toast.success("Novo link de convite gerado.");
            else toast.error(res.error ?? "Falhou.");
          })
        }
      >
        {pending ? "Gerando..." : "Gerar link"}
      </Button>
    </div>
  );
}
