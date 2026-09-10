import type { NextAuthConfig } from "next-auth";

/**
 * Config edge-safe (sem fetch/Node). Usada pelo middleware (`src/proxy.ts`).
 * O provider Credentials completo fica em `src/lib/auth.ts`.
 */
export const authConfig = {
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.apiToken = user.apiToken;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id;
      session.apiToken = token.apiToken;
      return session;
    },
  },
} satisfies NextAuthConfig;
