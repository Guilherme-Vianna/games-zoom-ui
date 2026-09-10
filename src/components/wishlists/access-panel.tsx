import { removeCollaboratorAction } from "@/actions/wishlists";
import { formatDate } from "@/lib/format-date";
import type { Collaborator } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { ActionButton } from "@/components/wishlists/action-button";

function initials(name: string | null, email: string | null): string {
  const base = name || email || "?";
  return base
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

export function AccessPanel({
  wishlistId,
  ownerName,
  collaborators,
}: {
  wishlistId: string;
  ownerName: string | null;
  collaborators: Collaborator[];
}) {
  return (
    <Card className="flex flex-col gap-3">
      <div>
        <h2 className="text-sm font-semibold">Quem tem acesso</h2>
        <p className="text-sm text-muted">
          O dono e quem entrou pelo link podem ver e adicionar jogos.
        </p>
      </div>

      <ul className="flex flex-col divide-y divide-border">
        <li className="flex items-center gap-3 py-2.5">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-semibold text-primary">
            {initials(ownerName, null)}
          </span>
          <span className="min-w-0 flex-1 truncate text-sm">{ownerName ?? "Dono"}</span>
          <span className="shrink-0 text-xs text-muted">dono</span>
        </li>

        {collaborators.map((c) => (
          <li key={c.userId} className="flex items-center gap-3 py-2.5">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-surface-2 text-xs font-semibold text-muted">
              {initials(c.name, c.email)}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm">{c.name ?? c.email}</span>
              <span className="block truncate text-xs text-muted">
                entrou em {formatDate(c.joinedAt)}
              </span>
            </span>
            <ActionButton
              variant="link"
              confirm={`Remover ${c.name ?? c.email} da lista?`}
              action={removeCollaboratorAction.bind(null, wishlistId, c.userId)}
              successToast="Pessoa removida da lista."
            >
              Remover
            </ActionButton>
          </li>
        ))}
      </ul>

      {collaborators.length === 0 ? (
        <p className="text-sm text-muted">
          Ninguem entrou ainda. Gere um link de convite abaixo.
        </p>
      ) : null}
    </Card>
  );
}
