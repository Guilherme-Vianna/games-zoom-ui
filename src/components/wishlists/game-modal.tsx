"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { refreshGameAction } from "@/actions/wishlists";
import { formatDateTime } from "@/lib/format-date";
import { discountLabel, formatPrice, originalPrice } from "@/lib/price";
import type { GameDetail, WishlistItem } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { RemoveGameButton } from "@/components/wishlists/remove-game-button";

/** Uma linha de preco de chave (menor keyshop / menor retail / menor historico). */
function KeyRow({ label, offer }: { label: string; offer: WishlistItem["keyKeyshop"] }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted">{label}</span>
      <span className="font-medium">{offer ? offer.formatted : "—"}</span>
    </div>
  );
}

export function GameModal({
  item,
  wishlistId,
  canRemove,
  onClose,
}: {
  item: WishlistItem;
  wishlistId: string;
  canRemove: boolean;
  onClose: () => void;
}) {
  const [game, setGame] = useState<GameDetail>(item);
  const [loading, setLoading] = useState(true);

  // Trava o scroll do body + fecha no ESC.
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  // Ao abrir: atualiza o jogo (Steam + chaves) sem esperar o cron.
  useEffect(() => {
    let alive = true;
    refreshGameAction(item.steamAppId)
      .then((res) => {
        if (!alive) return;
        if (res.ok && res.game) setGame(res.game);
        else if (res.error) toast.error(res.error);
      })
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [item.steamAppId]);

  const discount = discountLabel(game.priceOverview);
  const original = originalPrice(game.priceOverview);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} aria-hidden />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={game.title}
        className="relative max-h-[90dvh] w-full max-w-md overflow-y-auto rounded-t-2xl border border-border bg-surface p-4 shadow-xl sm:rounded-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="absolute right-3 top-3 rounded-lg p-1 text-muted hover:bg-surface-2 hover:text-foreground"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {game.imageUrl ? (
          <Image
            src={game.imageUrl}
            alt={game.title}
            width={460}
            height={215}
            className="aspect-[460/215] w-full rounded-lg object-cover"
            unoptimized
          />
        ) : null}

        <h2 className="mt-3 pr-6 text-lg font-semibold">{game.title}</h2>

        <div className="mt-2 flex items-center gap-2 text-sm">
          {game.releaseStatus === "unreleased" ? (
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
              <span className="font-semibold">{formatPrice(game.priceOverview, game.isFree)}</span>
              <span className="text-xs text-muted">na Steam</span>
            </>
          )}
        </div>

        <div className="mt-4 rounded-lg border border-border bg-background p-3">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-semibold">Ofertas de chave</h3>
            {loading ? <span className="text-xs text-muted">atualizando…</span> : null}
          </div>
          <div className="flex flex-col gap-1.5">
            <KeyRow label="Menor em keyshop" offer={game.keyKeyshop} />
            <KeyRow label="Menor em loja oficial" offer={game.keyRetail} />
            <KeyRow label="Menor historico (keyshop)" offer={game.keyHistoricalKeyshop} />
          </div>
          {game.keyDealsUrl ? (
            <a
              href={game.keyDealsUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-block text-sm text-primary underline"
            >
              Ver todas as ofertas no GG.deals →
            </a>
          ) : (
            <p className="mt-3 text-xs text-muted">
              {loading ? "" : "Sem ofertas de chave para este jogo agora."}
            </p>
          )}
          {game.keysLastSyncedAt ? (
            <p className="mt-2 text-xs text-muted">
              Chaves atualizadas em {formatDateTime(game.keysLastSyncedAt)}
            </p>
          ) : null}
        </div>

        <div className="mt-4 flex items-center justify-between gap-2">
          <a
            href={game.storeUrl}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-muted underline hover:text-foreground"
          >
            Abrir na Steam
          </a>
          <div className="flex gap-2">
            {canRemove ? (
              <RemoveGameButton wishlistId={wishlistId} itemId={item.id} title={game.title} />
            ) : null}
            <Button variant="ghost" onClick={onClose}>
              Fechar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
