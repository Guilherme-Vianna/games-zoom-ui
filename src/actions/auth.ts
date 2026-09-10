"use server";

import { unstable_rethrow } from "next/navigation";
import { z } from "zod";
import { signIn } from "@/lib/auth";
import { api, ApiError } from "@/lib/api";

export type FormState = {
  error?: string;
  success?: string;
  code?: string;
  /** e-mail usado, para pre-preencher o reenvio */
  email?: string;
  /** true = e-mail despachado; false = precisa reenviar */
  emailSent?: boolean;
  /** muda a cada submit, para o cliente reagir mesmo com mensagem igual */
  nonce?: number;
};

const registerSchema = z.object({
  name: z.string().trim().min(2, "Nome deve ter ao menos 2 caracteres"),
  email: z.string().trim().email("E-mail invalido"),
  password: z.string().min(8, "Senha deve ter ao menos 8 caracteres"),
});

export async function registerAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const nonce = Date.now();
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados invalidos.", nonce };
  }

  try {
    const res = await api.post<{ message: string; emailSent: boolean; email: string }>(
      "/api/auth/register",
      parsed.data,
    );
    return {
      success: res.message,
      email: res.email ?? parsed.data.email,
      emailSent: res.emailSent,
      nonce,
    };
  } catch (err) {
    console.error("[registerAction]", err);
    return {
      error: err instanceof ApiError ? err.message : "Nao foi possivel criar a conta.",
      nonce,
    };
  }
}

export async function loginAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const nonce = Date.now();
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "") || "/listas";

  try {
    await api.post("/api/auth/login", { email, password });
  } catch (err) {
    if (err instanceof ApiError) return { error: err.message, code: err.code, email, nonce };
    return { error: "Nao foi possivel entrar agora.", nonce };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: next.startsWith("/") ? next : "/listas",
    });
  } catch (err) {
    unstable_rethrow(err);
    return { error: "Nao foi possivel iniciar a sessao.", nonce };
  }
  return {};
}

export async function resendAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const nonce = Date.now();
  const email = String(formData.get("email") ?? "");
  try {
    const res = await api.post<{ sent: boolean; message: string }>("/api/auth/resend", { email });
    return {
      success: res.sent
        ? "Link reenviado! Verifique sua caixa de entrada (e o spam)."
        : res.message,
      email,
      emailSent: res.sent,
      nonce,
    };
  } catch (err) {
    return {
      error: err instanceof ApiError ? err.message : "Nao foi possivel reenviar agora.",
      email,
      emailSent: false,
      nonce,
    };
  }
}
