"use client";

import { leaveWishlistAction } from "@/actions/wishlists";
import { ActionButton } from "@/components/wishlists/action-button";

export function LeaveWishlistButton({ wishlistId }: { wishlistId: string }) {
  return (
    <ActionButton
      variant="danger"
      confirm="Sair desta lista? Voce perde o acesso ate receber um novo convite."
      action={leaveWishlistAction.bind(null, wishlistId)}
    >
      Sair da lista
    </ActionButton>
  );
}
