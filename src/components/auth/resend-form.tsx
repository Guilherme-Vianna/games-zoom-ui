"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { resendAction, type FormState } from "@/actions/auth";
import { useFormToast } from "@/hooks/use-form-toast";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";

function Submit({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Enviando..." : label}
    </Button>
  );
}

export function ResendForm({
  defaultEmail = "",
  label = "Reenviar link de confirmacao",
  compact = false,
}: {
  defaultEmail?: string;
  label?: string;
  compact?: boolean;
}) {
  const [state, action] = useActionState<FormState, FormData>(resendAction, {});
  useFormToast(state);

  return (
    <form action={action} className="flex flex-col gap-3">
      {compact ? (
        <input type="hidden" name="email" value={defaultEmail} />
      ) : (
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="resend-email">E-mail</Label>
          <Input id="resend-email" name="email" type="email" defaultValue={defaultEmail} required />
        </div>
      )}
      {!compact && state.error ? <p className="text-sm text-danger">{state.error}</p> : null}
      {!compact && state.success ? <p className="text-sm text-success">{state.success}</p> : null}
      <Submit label={label} />
    </form>
  );
}
