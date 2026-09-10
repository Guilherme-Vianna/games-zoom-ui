import type { WishlistInvite } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { CreateInviteForm } from "@/components/wishlists/create-invite-form";
import { InviteRow } from "@/components/wishlists/invite-row";

export function InvitesPanel({
  wishlistId,
  invites,
}: {
  wishlistId: string;
  invites: WishlistInvite[];
}) {
  const active = invites.filter((i) => i.state === "active");
  const inactive = invites.filter((i) => i.state !== "active");

  return (
    <Card className="flex flex-col gap-4">
      <div>
        <h2 className="text-sm font-semibold">Links de convite</h2>
        <p className="text-sm text-muted">
          Gere um link, escolha a validade e mande para quem voce quiser. Pode revogar quando
          quiser.
        </p>
      </div>

      <CreateInviteForm wishlistId={wishlistId} />

      {active.length > 0 ? (
        <div className="flex flex-col gap-2">
          {active.map((i) => (
            <InviteRow key={i.id} wishlistId={wishlistId} invite={i} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted">Nenhum link ativo.</p>
      )}

      {inactive.length > 0 ? (
        <details className="text-sm">
          <summary className="cursor-pointer text-muted">
            Links inativos ({inactive.length})
          </summary>
          <div className="mt-2 flex flex-col gap-2">
            {inactive.map((i) => (
              <InviteRow key={i.id} wishlistId={wishlistId} invite={i} />
            ))}
          </div>
        </details>
      ) : null}
    </Card>
  );
}
