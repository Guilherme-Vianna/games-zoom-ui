import "server-only";
import { cache } from "react";
import { auth } from "@/lib/auth";
import { api } from "@/lib/api";
import type {
  GameDetail,
  InviteState,
  ItemsPage,
  WishlistAccess,
  WishlistDetail,
  WishlistSummary,
  WishlistsPage,
} from "@/lib/types";

export type WishlistRefreshSummary = {
  keysRefreshed: number;
  keysFailed: number;
  steamRefreshed: number;
  steamFailed: number;
  steamPending: number;
};

async function token(): Promise<string> {
  const session = await auth();
  if (!session?.apiToken) throw new Error("SEM_SESSAO");
  return session.apiToken;
}

function qs(params: Record<string, string | number | undefined | null>): string {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && `${v}` !== "") sp.set(k, `${v}`);
  }
  const s = sp.toString();
  return s ? `?${s}` : "";
}

/** Listas do usuario, paginadas (busca por nome via `q`). */
export async function getMyWishlists(
  opts: { page?: number; q?: string } = {},
): Promise<WishlistsPage> {
  return api.get<WishlistsPage>(`/api/wishlists${qs({ page: opts.page, q: opts.q })}`, {
    token: await token(),
  });
}

/** Primeira pagina (ate 100) para a sidebar/layout — dedup por request. */
export const getSidebarWishlists = cache(async (): Promise<WishlistSummary[]> => {
  const data = await api.get<WishlistsPage>("/api/wishlists?page=1&pageSize=100", {
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

/** Itens de uma lista, paginados e filtrados por aba/busca/ordenacao (no servidor). */
export async function getWishlistItems(
  id: string,
  opts: {
    status?: "onSale" | "unreleased" | "regular";
    page?: number;
    pageSize?: number;
    q?: string;
    sort?: string;
  } = {},
): Promise<ItemsPage> {
  const path = `/api/wishlists/${id}/items${qs({
    status: opts.status,
    page: opts.page,
    pageSize: opts.pageSize,
    q: opts.q,
    sort: opts.sort,
  })}`;
  return api.get<ItemsPage>(path, { token: await token() });
}

/** Atualiza um jogo agora (Steam + ofertas de chave). Devolve o jogo fresco. */
export async function refreshGame(steamAppId: number): Promise<GameDetail> {
  const data = await api.post<{ game: GameDetail }>(
    `/api/games/${steamAppId}/refresh`,
    undefined,
    { token: await token() },
  );
  return data.game;
}

/** Atualiza todos os jogos da lista (chaves + fatia da Steam). */
export async function refreshWishlist(id: string): Promise<WishlistRefreshSummary> {
  return api.post<WishlistRefreshSummary>(`/api/wishlists/${id}/refresh`, undefined, {
    token: await token(),
  });
}

export async function getSharedPreview(shareToken: string): Promise<{
  wishlist: WishlistDetail;
  alreadyMember: boolean;
  inviteState: InviteState;
}> {
  const session = await auth();
  return api.get(`/api/shared/${shareToken}`, { token: session?.apiToken ?? null });
}

export { appUrl, inviteUrl } from "@/lib/invite-url";
