"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { loginAction, type FormState } from "@/actions/auth";
import { useFormToast } from "@/hooks/use-form-toast";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Entrando..." : "Entrar"}
    </Button>
  );
}

export function LoginForm({ next }: { next?: string }) {
  const [state, action] = useActionState<FormState, FormData>(loginAction, {});
  useFormToast(state);

  return (
    <Card>
      <form action={action} className="flex flex-col gap-4">
        {next ? <input type="hidden" name="next" value={next} /> : null}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" name="email" type="email" autoComplete="email" required />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password">Senha</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />
        </div>

        {state.error ? <p className="text-sm text-danger">{state.error}</p> : null}
        {state.code === "EMAIL_NOT_VERIFIED" ? (
          <Link href="/verificar" className="text-sm text-primary underline">
            Reenviar e-mail de confirmacao
          </Link>
        ) : null}

        <Submit />
      </form>

      <p className="mt-4 text-center text-sm text-muted">
        Nao tem conta?{" "}
        <Link href="/registro" className="text-primary underline">
          Criar conta
        </Link>
      </p>
    </Card>
  );
}
