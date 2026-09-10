import Link from "next/link";
import { getMyWishlists } from "@/lib/wishlists";
import { Card } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import { CreateWishlistForm } from "@/components/wishlists/create-wishlist-form";
import { SearchField } from "@/components/filters/search-field";

export const dynamic = "force-dynamic";

export default async function ListasPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q = "", page } = await searchParams;
  const pageNum = Math.max(1, Number(page) || 1);
  const data = await getMyWishlists({ page: pageNum, q: q || undefined });
  const wishlists = data.wishlists;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold">Minhas listas</h1>
        <p className="text-sm text-muted">Crie uma lista e compartilhe o link com os amigos.</p>
      </div>

      <CreateWishlistForm />

      {data.total > 3 || q ? <SearchField placeholder="Buscar lista..." /> : null}

      {data.total === 0 && !q ? (
        <Card className="text-center text-sm text-muted">
          Voce ainda nao tem listas. Crie a primeira acima.
        </Card>
      ) : wishlists.length === 0 ? (
        <Card className="text-center text-sm text-muted">
          Nenhuma lista encontrada para &ldquo;{q}&rdquo;.
        </Card>
      ) : (
        <>
          <ul className="grid gap-3 sm:grid-cols-2">
            {wishlists.map((w) => (
              <li key={w.id}>
                <Link href={`/listas/${w.id}`}>
                  <Card className="h-full transition-colors hover:border-primary">
                    <div className="flex items-start justify-between gap-2">
                      <h2 className="font-medium">{w.name}</h2>
                      <span className="shrink-0 rounded bg-surface-2 px-1.5 py-0.5 text-xs text-muted">
                        {w.isOwner ? "dono" : `de ${w.ownerName ?? "outro"}`}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-muted">
                      {w.itemCount} {w.itemCount === 1 ? "jogo" : "jogos"}
                      {w.collaborators.length > 0
                        ? ` · ${w.collaborators.length + 1} pessoas`
                        : ""}
                    </p>
                  </Card>
                </Link>
              </li>
            ))}
          </ul>
          <Pagination page={data.page} totalPages={data.totalPages} />
        </>
      )}
    </div>
  );
}
