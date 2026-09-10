"use client";

import { useState } from "react";
import Image from "next/image";
import { keyPriceBadge } from "@/lib/key-price";
import { discountLabel, formatPrice, originalPrice } from "@/lib/price";
import type { WishlistItem } from "@/lib/types";
import { GameModal } from "@/components/wishlists/game-modal";
import { RemoveGameButton } from "@/components/wishlists/remove-game-button";

export function GameCard({
  item,
  wishlistId,
  canRemove,
}: {
  item: WishlistItem;
  wishlistId: string;
  canRemove: boolean;
}) {
  const [open, setOpen] = useState(false);
  const discount = discountLabel(item.priceOverview);
  const original = originalPrice(item.priceOverview);
  const keyBadge = keyPriceBadge(item);

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="block w-full text-left"
        aria-label={`Ver ${item.title}`}
      >
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.title}
            width={460}
            height={215}
            className="aspect-[460/215] w-full object-cover"
            unoptimized
          />
        ) : (
          <div className="aspect-[460/215] w-full bg-surface-2" />
        )}
      </button>
      <div className="flex flex-col gap-2 p-3">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="line-clamp-2 text-left font-medium hover:text-primary"
        >
          {item.title}
        </button>

        <div className="flex items-center gap-2 text-sm">
          {item.releaseStatus === "unreleased" ? (
            <span className="rounded bg-primary/20 px-1.5 py-0.5 text-xs font-semibold text-primary">
              Em breve
            </span>
          ) : (
            <>
              {discount ? (
                <span className="rounded bg-success/20 px-1.5 py-0.5 text-xs font-semibold text-success">
                  {discount}
                </span>
              ) : null}
              {original ? <span className="text-muted line-through">{original}</span> : null}
              <span className="font-semibold">{formatPrice(item.priceOverview, item.isFree)}</span>
            </>
          )}
        </div>

        {keyBadge ? (
          <p className="text-xs font-medium text-primary">🔑 {keyBadge}</p>
        ) : null}

        <div className="mt-1 flex items-center justify-between text-xs text-muted">
          <span>por {item.addedByName}</span>
          {canRemove ? (
            <RemoveGameButton wishlistId={wishlistId} itemId={item.id} title={item.title} />
          ) : null}
        </div>
      </div>

      {open ? (
        <GameModal
          item={item}
          wishlistId={wishlistId}
          canRemove={canRemove}
          onClose={() => setOpen(false)}
        />
      ) : null}
    </div>
  );
}
