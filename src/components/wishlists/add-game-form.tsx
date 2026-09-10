"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { addGameAction, type FormState } from "@/actions/wishlists";
import { useFormToast } from "@/hooks/use-form-toast";
import { splitGameInput } from "@/lib/steam-url";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function Submit({ disabled, count }: { disabled: boolean; count: number }) {
  const { pending } = useFormStatus();
  const label = count > 1 ? `Adicionar ${count} jogos` : "Adicionar jogo";
  return (
    <Button type="submit" disabled={pending || disabled}>
      {pending ? "Buscando na Steam..." : label}
    </Button>
  );
}

export function AddGameForm({ wishlistId }: { wishlistId: string }) {
  const action = addGameAction.bind(null, wishlistId);
  const [state, formAction] = useActionState<FormState, FormData>(action, {});
  useFormToast(state);
  const [value, setValue] = useState("");

  const entries = splitGameInput(value);
  const touched = value.trim().length > 0;

  return (
    <form action={formAction} className="flex flex-col gap-2">
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          name="input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Link/AppID da Steam ou nomes separados por virgula (ex.: Hades, Celeste, 730)"
          aria-label="Link, AppID ou nomes de jogos na Steam"
          className="sm:flex-1"
        />
        <Submit disabled={!touched} count={entries.length} />
      </div>
      <p className="text-sm text-muted">
        Cole o link da loja Steam, um AppID, ou digite nomes de jogos separados por
        virgula — a gente acha o link na Steam.
      </p>
      {state.error ? <p className="text-sm text-danger">{state.error}</p> : null}
      {state.success ? <p className="text-sm text-success">{state.success}</p> : null}
    </form>
  );
}
