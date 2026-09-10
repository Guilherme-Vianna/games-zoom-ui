import "server-only";
import { cache } from "react";
import { auth } from "@/lib/auth";
import { api } from "@/lib/api";
import type {
  InviteState,
  WishlistAccess,
  WishlistDetail,
  WishlistSummary,
} from "@/lib/types";

async function token(): Promise<string> {
  const session = await auth();
  if (!session?.apiToken) throw new Error("SEM_SESSAO");
  return session.apiToken;
}

export const getMyWishlists = cache(async (): Promise<WishlistSummary[]> => {
  const data = await api.get<{ wishlists: WishlistSummary[] }>("/api/wishlists", {
    token: await token(),
  });
  return data.wishlists;
});

export const getWishlist = cache(
  async (id: string): Promise<{ wishlist: WishlistDetail; access: WishlistAccess }> => {
    return api.get<{ wishlist: WishlistDetail; access: WishlistAccess }>(
      `/api/wishlists/${id}`,
      { token: await token() },
    );
  },
);

export async function getSharedPreview(shareToken: string): Promise<{
  wishlist: WishlistDetail;
  alreadyMember: boolean;
  inviteState: InviteState;
}> {
  const session = await auth();
  return api.get(`/api/shared/${shareToken}`, { token: session?.apiToken ?? null });
}

export { appUrl, inviteUrl } from "@/lib/invite-url";
