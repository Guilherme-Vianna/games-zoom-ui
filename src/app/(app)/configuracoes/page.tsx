import { getNotificationSettings } from "@/lib/notification-settings";
import { Card } from "@/components/ui/card";
import { NotificationSettingsForm } from "@/components/settings/notification-settings-form";

export const dynamic = "force-dynamic";

export default async function ConfiguracoesPage() {
  const settings = await getNotificationSettings();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold">Configuracoes</h1>
        <p className="text-sm text-muted">Preferencias de notificacao da sua conta.</p>
      </div>

      <Card>
        <h2 className="mb-4 text-sm font-semibold text-muted">Notificacoes</h2>
        <NotificationSettingsForm settings={settings} />
      </Card>
    </div>
  );
}
