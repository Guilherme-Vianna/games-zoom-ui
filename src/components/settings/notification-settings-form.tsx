"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import {
  updateNotificationSettingsAction,
  type FormState,
} from "@/actions/notification-settings";
import { useFormToast } from "@/hooks/use-form-toast";
import { DELIVERY_HOUR_OPTIONS } from "@/lib/delivery-hour";
import type { NotificationSettings } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/input";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Salvando..." : "Salvar"}
    </Button>
  );
}

export function NotificationSettingsForm({
  settings,
}: {
  settings: NotificationSettings;
}) {
  const [state, action] = useActionState<FormState, FormData>(
    updateNotificationSettingsAction,
    {},
  );
  useFormToast(state);

  const [enabled, setEnabled] = useState(settings.saleDigestEnabled);

  return (
    <form action={action} className="flex flex-col gap-4">
      <label className="flex items-start gap-3">
        <input
          type="checkbox"
          name="saleDigestEnabled"
          checked={enabled}
          onChange={(e) => setEnabled(e.target.checked)}
          className="mt-1 h-4 w-4 accent-primary"
        />
        <span className="text-sm">
          <span className="font-medium text-foreground">Resumo de promocoes por e-mail</span>
          <br />
          <span className="text-muted">
            Um e-mail no fim do dia quando um jogo novo das suas listas entra em promocao.
          </span>
        </span>
      </label>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="deliveryHour">Horario de envio (horario de Brasilia)</Label>
        <select
          id="deliveryHour"
          name="deliveryHour"
          defaultValue={settings.deliveryHour}
          disabled={!enabled}
          className="h-10 w-full max-w-[10rem] rounded-lg border border-border bg-surface px-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 disabled:opacity-50"
        >
          {DELIVERY_HOUR_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      {state.error ? <p className="text-sm text-danger">{state.error}</p> : null}
      {state.success ? <p className="text-sm text-success">{state.success}</p> : null}

      <div className="flex justify-end">
        <Submit />
      </div>
    </form>
  );
}
