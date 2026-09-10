import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-3 px-4 text-center">
      <h1 className="text-xl font-semibold">Pagina nao encontrada</h1>
      <p className="text-sm text-muted">
        O link pode estar errado ou voce nao tem acesso a esta lista.
      </p>
      <Link href="/listas" className="text-sm text-primary underline">
        Voltar para minhas listas
      </Link>
    </div>
  );
}
