import "server-only";
import { auth } from "@/lib/auth";
import { api } from "@/lib/api";
import type { NotificationSettings } from "@/lib/types";

async function token(): Promise<string> {
  const session = await auth();
  if (!session?.apiToken) throw new Error("SEM_SESSAO");
  return session.apiToken;
}

export async function getNotificationSettings(): Promise<NotificationSettings> {
  const data = await api.get<{ settings: NotificationSettings }>(
    "/api/me/notification-settings",
    { token: await token() },
  );
  return data.settings;
}
