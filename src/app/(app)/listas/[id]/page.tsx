import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { ApiError } from "@/lib/api";
import { getWishlist } from "@/lib/wishlists";
import { matchesQuery } from "@/lib/text";
import { parseSort, sortItems } from "@/lib/sort-items";
import { Card } from "@/components/ui/card";
import { AddGameForm } from "@/components/wishlists/add-game-form";
import { GameCard } from "@/components/wishlists/game-card";
import { DeleteWishlistButton } from "@/components/wishlists/delete-wishlist-button";
import { LeaveWishlistButton } from "@/components/wishlists/leave-wishlist-button";
import { TabNav } from "@/components/wishlists/tab-nav";
import { SearchField } from "@/components/filters/search-field";
import { SortSelect } from "@/components/filters/sort-select";
import { AccessPanel } from "@/components/wishlists/access-panel";
import { InvitesPanel } from "@/components/wishlists/invites-panel";

export const dynamic = "force-dynamic";

export default async function WishlistPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string; q?: string; sort?: string }>;
}) {
  const { id } = await params;
  const { tab = "jogos", q = "", sort } = await searchParams;

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
  const showAccess = isOwner && tab === "acessos";

  const filtered = wishlist.items.filter((i) => matchesQuery(i.title, q));
  const items = sortItems(filtered, parseSort(sort));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold">{wishlist.name}</h1>
          <p className="text-sm text-muted">
            {isOwner ? "Sua lista" : `Lista de ${wishlist.ownerName ?? "outro"}`} ·{" "}
            {wishlist.items.length} {wishlist.items.length === 1 ? "jogo" : "jogos"}
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

      {isOwner ? (
        <TabNav
          tabs={[
            { value: "jogos", label: "Jogos", badge: wishlist.items.length },
            {
              value: "acessos",
              label: "Acessos",
              badge: wishlist.collaborators.length,
            },
          ]}
        />
      ) : null}

      {showAccess ? (
        <>
          <AccessPanel
            wishlistId={wishlist.id}
            ownerName={wishlist.ownerName}
            collaborators={wishlist.collaborators}
          />
          <InvitesPanel wishlistId={wishlist.id} invites={wishlist.invites} />
        </>
      ) : (
        <>
          {access.canAddItems ? (
            <Card className="flex flex-col gap-3">
              <h2 className="text-sm font-semibold text-muted">Adicionar um jogo</h2>
              <AddGameForm wishlistId={wishlist.id} />
            </Card>
          ) : null}

          {wishlist.items.length > 0 ? (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <SearchField placeholder="Buscar jogo na lista..." />
              <SortSelect />
            </div>
          ) : null}

          {wishlist.items.length === 0 ? (
            <Card className="text-center text-sm text-muted">
              Nenhum jogo ainda. Cole o link da Steam de um jogo acima.
            </Card>
          ) : items.length === 0 ? (
            <Card className="text-center text-sm text-muted">
              Nenhum jogo encontrado para &ldquo;{q}&rdquo;.
            </Card>
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <li key={item.id}>
                  <GameCard
                    item={item}
                    wishlistId={wishlist.id}
                    canRemove={isOwner || item.addedById === viewerId}
                  />
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
