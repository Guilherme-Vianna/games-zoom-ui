"use server";

import { revalidatePath } from "next/cache";
import { redirect, unstable_rethrow } from "next/navigation";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { api, ApiError } from "@/lib/api";
import type { WishlistSummary } from "@/lib/types";
import { summarizeAddResult, type SkipReason } from "@/lib/add-game-result";

export type FormState = { error?: string; success?: string; nonce?: number };

async function apiToken(): Promise<string> {
  const session = await auth();
  if (!session?.apiToken) redirect("/login");
  return session.apiToken;
}

const nameSchema = z.string().trim().min(1, "De um nome para a lista").max(80);

export async function createWishlistAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = nameSchema.safeParse(formData.get("name"));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Nome invalido.", nonce: Date.now() };
  }

  let created: WishlistSummary;
  try {
    const data = await api.post<{ wishlist: WishlistSummary }>(
      "/api/wishlists",
      { name: parsed.data },
      { token: await apiToken() },
    );
    created = data.wishlist;
  } catch (err) {
    return {
      error: err instanceof ApiError ? err.message : "Nao foi possivel criar a lista.",
      nonce: Date.now(),
    };
  }

  revalidatePath("/listas");
  redirect(`/listas/${created.id}`);
}

export async function addGameAction(
  wishlistId: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const nonce = Date.now();
  const input = String(formData.get("input") ?? "").trim();
  if (!input) return { error: "Cole o link da Steam, um AppID ou nomes de jogos.", nonce };

  try {
    const data = await api.post<{
      added: { title: string }[];
      skipped: { term: string; reason: SkipReason }[];
    }>(`/api/wishlists/${wishlistId}/items`, { input }, { token: await apiToken() });
    revalidatePath(`/listas/${wishlistId}`);
    return { success: summarizeAddResult(data.added, data.skipped ?? []), nonce };
  } catch (err) {
    return {
      error: err instanceof ApiError ? err.message : "Nao foi possivel adicionar o jogo.",
      nonce,
    };
  }
}

export type ActionResult = { ok: boolean; error?: string };

function fail(err: unknown, fallback: string): ActionResult {
  unstable_rethrow(err);
  return { ok: false, error: err instanceof ApiError ? err.message : fallback };
}

export async function removeGameAction(
  wishlistId: string,
  itemId: string,
): Promise<ActionResult> {
  try {
    await api.del(`/api/wishlists/${wishlistId}/items/${itemId}`, { token: await apiToken() });
  } catch (err) {
    return fail(err, "Nao foi possivel remover o jogo.");
  }
  revalidatePath(`/listas/${wishlistId}`);
  return { ok: true };
}

export async function deleteWishlistAction(wishlistId: string): Promise<ActionResult> {
  try {
    await api.del(`/api/wishlists/${wishlistId}`, { token: await apiToken() });
  } catch (err) {
    return fail(err, "Nao foi possivel apagar a lista.");
  }
  revalidatePath("/listas");
  redirect("/listas");
}

export async function joinWishlistAction(shareToken: string): Promise<ActionResult> {
  let wishlistId: string;
  try {
    const data = await api.post<{ wishlistId: string }>(
      `/api/shared/${shareToken}/join`,
      undefined,
      { token: await apiToken() },
    );
    wishlistId = data.wishlistId;
  } catch (err) {
    return fail(err, "Nao foi possivel entrar na lista.");
  }
  revalidatePath("/listas");
  redirect(`/listas/${wishlistId}`);
}

export async function leaveWishlistAction(wishlistId: string): Promise<ActionResult> {
  try {
    await api.del(`/api/wishlists/${wishlistId}/collaborators/me`, { token: await apiToken() });
  } catch (err) {
    return fail(err, "Nao foi possivel sair da lista.");
  }
  revalidatePath("/listas");
  redirect("/listas");
}

export async function removeCollaboratorAction(
  wishlistId: string,
  userId: string,
): Promise<ActionResult> {
  try {
    await api.del(`/api/wishlists/${wishlistId}/collaborators/${userId}`, {
      token: await apiToken(),
    });
  } catch (err) {
    return fail(err, "Nao foi possivel remover a pessoa.");
  }
  revalidatePath(`/listas/${wishlistId}`);
  return { ok: true };
}

export async function createInviteAction(
  wishlistId: string,
  expiry: "1d" | "7d" | "30d" | "never",
): Promise<ActionResult> {
  try {
    await api.post(`/api/wishlists/${wishlistId}/invites`, { expiry }, { token: await apiToken() });
  } catch (err) {
    return fail(err, "Nao foi possivel gerar o link.");
  }
  revalidatePath(`/listas/${wishlistId}`);
  return { ok: true };
}

export async function revokeInviteAction(
  wishlistId: string,
  inviteId: string,
): Promise<ActionResult> {
  try {
    await api.del(`/api/wishlists/${wishlistId}/invites/${inviteId}`, {
      token: await apiToken(),
    });
  } catch (err) {
    return fail(err, "Nao foi possivel revogar o link.");
  }
  revalidatePath(`/listas/${wishlistId}`);
  return { ok: true };
}
