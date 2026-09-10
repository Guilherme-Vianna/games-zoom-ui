"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { addGameAction, type FormState } from "@/actions/wishlists";
import { useFormToast } from "@/hooks/use-form-toast";
import { looksLikeSteamInput } from "@/lib/steam-url";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function Submit({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending || disabled}>
      {pending ? "Buscando na Steam..." : "Adicionar jogo"}
    </Button>
  );
}

export function AddGameForm({ wishlistId }: { wishlistId: string }) {
  const action = addGameAction.bind(null, wishlistId);
  const [state, formAction] = useActionState<FormState, FormData>(action, {});
  useFormToast(state);
  const [value, setValue] = useState("");

  const touched = value.trim().length > 0;
  const invalid = touched && !looksLikeSteamInput(value);

  return (
    <form
      action={formAction}
      className="flex flex-col gap-2"
      onSubmit={(e) => {
        if (invalid) e.preventDefault();
      }}
    >
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          name="input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Cole o link da loja Steam ou o AppID (ex.: 730)"
          aria-label="Link ou AppID do jogo na Steam"
          className="sm:flex-1"
        />
        <Submit disabled={invalid || !touched} />
      </div>
      {invalid ? (
        <p className="text-sm text-danger">
          Isso nao parece um link da Steam nem um AppID. Ex.:{" "}
          <code>https://store.steampowered.com/app/730/</code>
        </p>
      ) : null}
      {state.error ? <p className="text-sm text-danger">{state.error}</p> : null}
      {state.success ? <p className="text-sm text-success">{state.success}</p> : null}
    </form>
  );
}
