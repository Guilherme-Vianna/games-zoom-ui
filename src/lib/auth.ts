import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "@/lib/auth.config";
import { api, ApiError } from "@/lib/api";

class LoginError extends CredentialsSignin {
  constructor(message: string) {
    super(message);
    this.code = message;
  }
}

type LoginResponse = {
  token: string;
  user: { id: string; name: string; email: string };
};

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      authorize: async (credentials) => {
        const email = String(credentials?.email ?? "");
        const password = String(credentials?.password ?? "");
        if (!email || !password) throw new LoginError("Informe e-mail e senha.");

        try {
          const data = await api.post<LoginResponse>("/api/auth/login", { email, password });
          return { ...data.user, apiToken: data.token };
        } catch (err) {
          if (err instanceof ApiError) {
            throw new LoginError(err.message);
          }
          throw new LoginError("Nao foi possivel entrar agora.");
        }
      },
    }),
  ],
});
