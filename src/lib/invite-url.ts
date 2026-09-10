/** Base publica desta UI (client-safe: NEXT_PUBLIC_ e inlined no bundle). */
export function appUrl(): string {
  return (process.env.NEXT_PUBLIC_APP_URL ?? "").replace(/\/$/, "");
}

export function inviteUrl(inviteToken: string): string {
  return `${appUrl()}/entrar/${inviteToken}`;
}
