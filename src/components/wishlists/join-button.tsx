"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { joinWishlistAction } from "@/actions/wishlists";
import { Button } from "@/components/ui/button";

export function JoinButton({ shareToken }: { shareToken: string }) {
  const [pending, start] = useTransition();
  return (
    <Button
      disabled={pending}
      className="w-full"
      onClick={() =>
        start(async () => {
          const res = await joinWishlistAction(shareToken);
          if (!res.ok && res.error) toast.error(res.error);
        })
      }
    >
      {pending ? "Entrando..." : "Entrar nesta lista"}
    </Button>
  );
}
