"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOutAction } from "@/actions/session";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type ListLink = { id: string; name: string; itemCount: number; isOwner?: boolean };

export function SidebarContent({
  lists,
  userName,
  onNavigate,
}: {
  lists: ListLink[];
  userName?: string | null;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col gap-1 p-3">
      <Link
        href="/listas"
        onClick={onNavigate}
        className="mb-2 px-2 py-1 text-lg font-bold tracking-tight"
      >
        Games <span className="text-primary">Zoom</span>
      </Link>

      <NavItem
        href="/listas"
        active={pathname === "/listas"}
        onNavigate={onNavigate}
        label="Minhas listas"
      />

      {lists.length > 0 ? (
        <>
          <p className="mt-4 px-2 pb-1 text-xs font-semibold uppercase tracking-wide text-muted">
            Listas
          </p>
          <div className="flex flex-col gap-0.5 overflow-y-auto">
            {lists.map((l) => (
              <NavItem
                key={l.id}
                href={`/listas/${l.id}`}
                active={pathname === `/listas/${l.id}`}
                onNavigate={onNavigate}
                label={l.name}
                badge={l.itemCount}
                dim={!l.isOwner}
              />
            ))}
          </div>
        </>
      ) : null}

      <div className="mt-auto border-t border-border pt-3">
        <NavItem
          href="/configuracoes"
          active={pathname === "/configuracoes"}
          onNavigate={onNavigate}
          label="Configuracoes"
        />
        <p className="mt-2 truncate px-2 pb-2 text-sm text-muted">{userName}</p>
        <form action={signOutAction}>
          <Button variant="ghost" className="w-full justify-start text-sm">
            Sair
          </Button>
        </form>
      </div>
    </div>
  );
}

function NavItem({
  href,
  active,
  label,
  badge,
  dim,
  onNavigate,
}: {
  href: string;
  active: boolean;
  label: string;
  badge?: number;
  dim?: boolean;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        "flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors",
        active
          ? "bg-surface-2 font-medium text-foreground shadow-sm"
          : "text-muted hover:bg-surface-2 hover:text-foreground",
      )}
    >
      <span className={cn("truncate", dim && !active && "opacity-80")}>{label}</span>
      {typeof badge === "number" ? (
        <span className="shrink-0 rounded bg-background px-1.5 text-xs text-muted">{badge}</span>
      ) : null}
    </Link>
  );
}
