"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createWishlistAction, type FormState } from "@/actions/wishlists";
import { useFormToast } from "@/hooks/use-form-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Criando..." : "Nova lista"}
    </Button>
  );
}

export function CreateWishlistForm() {
  const [state, action] = useActionState<FormState, FormData>(createWishlistAction, {});
  useFormToast(state);
  return (
    <form action={action} className="flex flex-col gap-2 sm:flex-row">
      <Input
        name="name"
        placeholder="Ex.: Jogos pra jogar com a galera"
        aria-label="Nome da lista"
        maxLength={80}
        required
        className="sm:flex-1"
      />
      <Submit />
      {state.error ? (
        <p className="text-sm text-danger sm:w-full sm:basis-full">{state.error}</p>
      ) : null}
    </form>
  );
}
