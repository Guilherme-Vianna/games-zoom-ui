"use client";

import { removeGameAction } from "@/actions/wishlists";
import { ActionButton } from "@/components/wishlists/action-button";

export function RemoveGameButton({
  wishlistId,
  itemId,
  title,
}: {
  wishlistId: string;
  itemId: string;
  title: string;
}) {
  return (
    <ActionButton
      variant="link"
      confirm={`Remover "${title}" da lista?`}
      action={removeGameAction.bind(null, wishlistId, itemId)}
    >
      Remover
    </ActionButton>
  );
}
