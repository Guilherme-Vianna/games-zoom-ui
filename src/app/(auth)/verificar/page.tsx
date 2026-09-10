import Link from "next/link";
import { api, ApiError } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { ResendForm } from "@/components/auth/resend-form";

export const dynamic = "force-dynamic";

async function verify(token: string): Promise<{ ok: boolean; message: string }> {
  try {
    await api.get(`/api/auth/verify?token=${encodeURIComponent(token)}`);
    return { ok: true, message: "E-mail confirmado! Agora voce ja pode entrar." };
  } catch (err) {
    return {
      ok: false,
      message: err instanceof ApiError ? err.message : "Nao foi possivel confirmar o e-mail.",
    };
  }
}

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <Card>
        <h2 className="text-lg font-semibold">Confirmar e-mail</h2>
        <p className="mt-1 mb-4 text-sm text-muted">
          Precisa de um novo link? Informe seu e-mail abaixo.
        </p>
        <ResendForm />
      </Card>
    );
  }

  const result = await verify(token);

  return (
    <Card>
      <p className={result.ok ? "text-sm text-success" : "text-sm text-danger"}>{result.message}</p>
      {result.ok ? (
        <Link href="/login" className="mt-4 inline-block text-sm text-primary underline">
          Ir para o login
        </Link>
      ) : (
        <div className="mt-4">
          <ResendForm />
        </div>
      )}
    </Card>
  );
}
