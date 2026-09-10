"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { registerAction, type FormState } from "@/actions/auth";
import { useFormToast } from "@/hooks/use-form-toast";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ResendForm } from "@/components/auth/resend-form";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Criando..." : "Criar conta"}
    </Button>
  );
}

export function RegisterForm() {
  const [state, action] = useActionState<FormState, FormData>(registerAction, {});
  useFormToast(state);

  if (state.success) {
    return (
      <Card className="flex flex-col gap-4">
        <div>
          <p className={state.emailSent === false ? "text-sm text-danger" : "text-sm text-success"}>
            {state.success}
          </p>
          <p className="mt-1 text-xs text-muted">
            Enviado para <strong>{state.email}</strong>. Verifique tambem o spam.
          </p>
        </div>

        <div className="border-t border-border pt-4">
          <p className="mb-2 text-sm text-muted">Nao chegou?</p>
          <ResendForm defaultEmail={state.email} compact label="Reenviar e-mail" />
        </div>

        <Link href="/login" className="text-center text-sm text-primary underline">
          Ir para o login
        </Link>
      </Card>
    );
  }

  return (
    <Card>
      <form action={action} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="name">Nome</Label>
          <Input id="name" name="name" autoComplete="name" required />
        </div>
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
            autoComplete="new-password"
            minLength={8}
            required
          />
          <span className="text-xs text-muted">Ao menos 8 caracteres.</span>
        </div>

        {state.error ? <p className="text-sm text-danger">{state.error}</p> : null}
        <Submit />
      </form>

      <p className="mt-4 text-center text-sm text-muted">
        Ja tem conta?{" "}
        <Link href="/login" className="text-primary underline">
          Entrar
        </Link>
      </p>
    </Card>
  );
}
