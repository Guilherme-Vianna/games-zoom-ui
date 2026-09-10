import Image from "next/image";
import { discountLabel, formatPrice, originalPrice } from "@/lib/price";
import type { WishlistItem } from "@/lib/types";
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
  const discount = discountLabel(item.priceOverview);
  const original = originalPrice(item.priceOverview);

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface">
      <a href={item.storeUrl} target="_blank" rel="noreferrer" className="block">
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
      </a>
      <div className="flex flex-col gap-2 p-3">
        <a
          href={item.storeUrl}
          target="_blank"
          rel="noreferrer"
          className="line-clamp-2 font-medium hover:text-primary"
        >
          {item.title}
        </a>

        <div className="flex items-center gap-2 text-sm">
          {discount ? (
            <span className="rounded bg-success/20 px-1.5 py-0.5 text-xs font-semibold text-success">
              {discount}
            </span>
          ) : null}
          {original ? <span className="text-muted line-through">{original}</span> : null}
          <span className="font-semibold">{formatPrice(item.priceOverview, item.isFree)}</span>
        </div>

        <div className="mt-1 flex items-center justify-between text-xs text-muted">
          <span>por {item.addedByName}</span>
          {canRemove ? (
            <RemoveGameButton wishlistId={wishlistId} itemId={item.id} title={item.title} />
          ) : null}
        </div>
      </div>
    </div>
  );
}
