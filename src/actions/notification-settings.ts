"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { api, ApiError } from "@/lib/api";
import type { NotificationSettings } from "@/lib/types";

export type FormState = { error?: string; success?: string; nonce?: number };

async function apiToken(): Promise<string> {
  const session = await auth();
  if (!session?.apiToken) redirect("/login");
  return session.apiToken;
}

const schema = z.object({
  saleDigestEnabled: z.boolean(),
  deliveryHour: z.coerce.number().int().min(0).max(23),
});

export async function updateNotificationSettingsAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const nonce = Date.now();
  const parsed = schema.safeParse({
    saleDigestEnabled: formData.get("saleDigestEnabled") === "on",
    deliveryHour: formData.get("deliveryHour"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados invalidos.", nonce };
  }

  try {
    await api.put<{ settings: NotificationSettings }>(
      "/api/me/notification-settings",
      parsed.data,
      { token: await apiToken() },
    );
  } catch (err) {
    return {
      error: err instanceof ApiError ? err.message : "Nao foi possivel salvar as preferencias.",
      nonce,
    };
  }

  revalidatePath("/configuracoes");
  return { success: "Preferencias salvas.", nonce };
}
