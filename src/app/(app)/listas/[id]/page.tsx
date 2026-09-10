import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { ApiError } from "@/lib/api";
import { getWishlist, getWishlistItems } from "@/lib/wishlists";
import { DEFAULT_TAB, parseTab, STATUS_TABS } from "@/lib/status-tabs";
import { Card } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import { AddGameForm } from "@/components/wishlists/add-game-form";
import { GameCard } from "@/components/wishlists/game-card";
import { DeleteWishlistButton } from "@/components/wishlists/delete-wishlist-button";
import { LeaveWishlistButton } from "@/components/wishlists/leave-wishlist-button";
import { TabNav } from "@/components/wishlists/tab-nav";
import { SearchField } from "@/components/filters/search-field";
import { SortSelect } from "@/components/filters/sort-select";
import { RefreshListButton } from "@/components/wishlists/refresh-list-button";
import { AccessPanel } from "@/components/wishlists/access-panel";
import { InvitesPanel } from "@/components/wishlists/invites-panel";

export const dynamic = "force-dynamic";

const EMPTY_LABELS: Record<string, string> = {
  normal: "Nenhum jogo a preco normal por aqui.",
  promocao: "Nenhum jogo em promocao agora.",
  "em-breve": "Nenhum jogo nao lancado na lista.",
};

export default async function WishlistPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string; q?: string; sort?: string; page?: string }>;
}) {
  const { id } = await params;
  const { tab = DEFAULT_TAB, q = "", sort, page } = await searchParams;

  let data;
  try {
    data = await getWishlist(id);
  } catch (err) {
    if (err instanceof ApiError && (err.status === 404 || err.status === 403)) notFound();
    throw err;
  }

  const { wishlist, access } = data;
  const session = await auth();
  const viewerId = session?.user?.id;
  const isOwner = access.role === "owner";
  const counts = wishlist.counts ?? { onSale: 0, unreleased: 0, regular: 0 };

  const parsed = parseTab(tab);
  const showAccess = isOwner && parsed.kind === "acessos";
  const tabValue = parsed.kind === "status" ? parsed.value : "acessos";

  const tabs = [
    ...STATUS_TABS.map((t) => ({
      value: t.value,
      label: t.label,
      badge:
        t.status === "onSale"
          ? counts.onSale
          : t.status === "unreleased"
            ? counts.unreleased
            : counts.regular,
    })),
    ...(isOwner
      ? [{ value: "acessos", label: "Acessos", badge: wishlist.collaborators.length }]
      : []),
  ];

  const pageNum = Math.max(1, Number(page) || 1);
  let itemsPage: Awaited<ReturnType<typeof getWishlistItems>> | null = null;
  let itemsError = false;
  if (parsed.kind === "status") {
    try {
      itemsPage = await getWishlistItems(id, {
        status: parsed.status,
        q: q || undefined,
        sort: sort || undefined,
        page: pageNum,
      });
    } catch (err) {
      if (err instanceof ApiError && err.status === 403) notFound();
      console.error("[listas/[id]] falha ao carregar itens", err);
      itemsError = true;
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold">{wishlist.name}</h1>
          <p className="text-sm text-muted">
            {isOwner ? "Sua lista" : `Lista de ${wishlist.ownerName ?? "outro"}`} ·{" "}
            {wishlist.itemCount} {wishlist.itemCount === 1 ? "jogo" : "jogos"}
            {wishlist.collaborators.length > 0
              ? ` · ${wishlist.collaborators.length + 1} pessoas`
              : ""}
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          {isOwner ? <DeleteWishlistButton wishlistId={wishlist.id} name={wishlist.name} /> : null}
          {access.role === "collaborator" ? <LeaveWishlistButton wishlistId={wishlist.id} /> : null}
        </div>
      </div>

      <TabNav tabs={tabs} />

      {showAccess ? (
        <>
          <AccessPanel
            wishlistId={wishlist.id}
            ownerName={wishlist.ownerName}
            collaborators={wishlist.collaborators}
          />
          <InvitesPanel wishlistId={wishlist.id} invites={wishlist.invites} />
        </>
      ) : itemsError ? (
        <Card className="text-center text-sm text-muted">
          Nao consegui carregar os jogos agora. Recarregue a pagina em instantes.
        </Card>
      ) : itemsPage ? (
        <>
          {access.canAddItems ? (
            <Card className="flex flex-col gap-3">
              <h2 className="text-sm font-semibold text-muted">Adicionar um jogo</h2>
              <AddGameForm wishlistId={wishlist.id} />
            </Card>
          ) : null}

          {wishlist.itemCount > 0 ? (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <SearchField placeholder="Buscar jogo na lista..." />
              <div className="flex items-center gap-2">
                <RefreshListButton wishlistId={wishlist.id} />
                <SortSelect />
              </div>
            </div>
          ) : null}

          {itemsPage.items.length === 0 ? (
            <Card className="text-center text-sm text-muted">
              {q
                ? `Nenhum jogo encontrado para "${q}".`
                : (EMPTY_LABELS[tabValue] ?? "Nenhum jogo ainda.")}
            </Card>
          ) : (
            <>
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {itemsPage.items.map((item) => (
                  <li key={item.id}>
                    <GameCard
                      item={item}
                      wishlistId={wishlist.id}
                      canRemove={isOwner || item.addedById === viewerId}
                    />
                  </li>
                ))}
              </ul>
              <Pagination page={itemsPage.page} totalPages={itemsPage.totalPages} />
            </>
          )}
        </>
      ) : null}
    </div>
  );
}
