"use client";

import { useEffect, useState } from "react";
import { SidebarContent } from "@/components/layout/sidebar-content";

type ListLink = { id: string; name: string; itemCount: number; isOwner?: boolean };

export function MobileHeader({
  lists,
  userName,
}: {
  lists: ListLink[];
  userName?: string | null;
}) {
  const [open, setOpen] = useState(false);

  // Trava o scroll do body enquanto o menu esta aberto.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background/90 px-4 py-3 backdrop-blur lg:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Abrir menu"
          className="rounded-lg p-1.5 text-muted hover:bg-surface-2 hover:text-foreground"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <span className="font-bold tracking-tight">
          Games <span className="text-primary">Zoom</span>
        </span>
      </header>

      {open ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div className="absolute inset-y-0 left-0 w-[80%] max-w-[300px] border-r border-border bg-surface">
            <SidebarContent lists={lists} userName={userName} onNavigate={() => setOpen(false)} />
          </div>
        </div>
      ) : null}
    </>
  );
}
