"use client";

import { useState } from "react";
import { toast } from "sonner";
import { revokeInviteAction } from "@/actions/wishlists";
import { expiryLabel } from "@/lib/format-date";
import { inviteUrl } from "@/lib/invite-url";
import type { WishlistInvite } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ActionButton } from "@/components/wishlists/action-button";

const STATE_STYLE: Record<WishlistInvite["state"], string> = {
  active: "bg-success/20 text-success",
  expired: "bg-surface-2 text-muted",
  revoked: "bg-danger/15 text-danger",
};
const STATE_LABEL: Record<WishlistInvite["state"], string> = {
  active: "ativo",
  expired: "expirado",
  revoked: "revogado",
};

export function InviteRow({
  wishlistId,
  invite,
}: {
  wishlistId: string;
  invite: WishlistInvite;
}) {
  const [copied, setCopied] = useState(false);
  const url = inviteUrl(invite.token);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copiado.");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Nao consegui copiar. Selecione e copie manualmente.");
    }
  }

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-border bg-surface p-3">
      <div className="flex items-center gap-2 text-xs">
        <span className={cn("rounded px-1.5 py-0.5 font-semibold", STATE_STYLE[invite.state])}>
          {STATE_LABEL[invite.state]}
        </span>
        <span className="text-muted">
          {invite.state === "active" ? expiryLabel(invite.expiresAt) : null}
          {invite.useCount > 0 ? ` · ${invite.useCount} usaram` : ""}
        </span>
      </div>

      <code className="block truncate rounded bg-background px-2 py-1.5 text-xs text-muted">
        {url}
      </code>

      <div className="flex gap-2">
        {invite.state === "active" ? (
          <>
            <button
              type="button"
              onClick={copy}
              className="rounded-lg bg-surface-2 px-3 py-1.5 text-sm font-medium hover:bg-border"
            >
              {copied ? "Copiado!" : "Copiar"}
            </button>
            <ActionButton
              variant="danger"
              confirm="Revogar este link? Quem ainda nao entrou perde o acesso."
              action={revokeInviteAction.bind(null, wishlistId, invite.id)}
              successToast="Link revogado."
            >
              Revogar
            </ActionButton>
          </>
        ) : (
          <ActionButton
            variant="link"
            action={revokeInviteAction.bind(null, wishlistId, invite.id)}
          >
            Remover da lista
          </ActionButton>
        )}
      </div>
    </div>
  );
}
