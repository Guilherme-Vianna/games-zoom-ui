"use client";

import { deleteWishlistAction } from "@/actions/wishlists";
import { ActionButton } from "@/components/wishlists/action-button";

export function DeleteWishlistButton({ wishlistId, name }: { wishlistId: string; name: string }) {
  return (
    <ActionButton
      variant="danger"
      confirm={`Apagar a lista "${name}"? Isso remove todos os jogos dela.`}
      action={deleteWishlistAction.bind(null, wishlistId)}
    >
      Apagar lista
    </ActionButton>
  );
}
