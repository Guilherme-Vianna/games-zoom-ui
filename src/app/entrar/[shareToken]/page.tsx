import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { ApiError } from "@/lib/api";
import { getSharedPreview } from "@/lib/wishlists";
import { formatPrice } from "@/lib/price";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { JoinButton } from "@/components/wishlists/join-button";

export const dynamic = "force-dynamic";

export default async function EntrarPage({
  params,
}: {
  params: Promise<{ shareToken: string }>;
}) {
  const { shareToken } = await params;

  let data;
  try {
    data = await getSharedPreview(shareToken);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }

  const { wishlist, alreadyMember, inviteState } = data;
  const session = await auth();

  if (alreadyMember) redirect(`/listas/${wishlist.id}`);

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold tracking-tight">
          Games <span className="text-primary">Zoom</span>
        </h1>
      </div>

      <Card className="flex flex-col gap-4">
        <div>
          <p className="text-sm text-muted">
            {wishlist.ownerName ?? "Alguem"} convidou voce para a lista
          </p>
          <h2 className="text-lg font-semibold">{wishlist.name}</h2>
          <p className="text-sm text-muted">
            {wishlist.items.length} {wishlist.items.length === 1 ? "jogo" : "jogos"}
          </p>
        </div>

        {inviteState !== "active" ? (
          <div className="rounded-lg bg-danger/10 p-3 text-sm text-danger">
            Este link de convite {inviteState === "expired" ? "expirou" : "foi revogado"}. Peca um
            novo link para o dono da lista.
          </div>
        ) : (
          <>
            {wishlist.items.length > 0 ? (
              <ul className="flex flex-col gap-1 text-sm">
                {wishlist.items.slice(0, 5).map((item) => (
                  <li key={item.id} className="flex justify-between gap-3">
                    <span className="truncate">{item.title}</span>
                    <span className="shrink-0 text-muted">
                      {formatPrice(item.priceOverview, item.isFree)}
                    </span>
                  </li>
                ))}
                {wishlist.items.length > 5 ? (
                  <li className="text-muted">e mais {wishlist.items.length - 5}...</li>
                ) : null}
              </ul>
            ) : null}

            {session ? (
              <JoinButton shareToken={shareToken} />
            ) : (
              <div className="flex flex-col gap-2">
                <p className="text-sm text-muted">Entre ou crie uma conta para participar.</p>
                <div className="flex gap-2">
                  <Link href={`/login?next=/entrar/${shareToken}`} className="flex-1">
                    <Button className="w-full">Entrar</Button>
                  </Link>
                  <Link href={`/registro`} className="flex-1">
                    <Button variant="ghost" className="w-full">
                      Criar conta
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
}
