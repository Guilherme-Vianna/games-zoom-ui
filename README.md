# Games Zoom — UI

Frontend (Next.js 16 RSC + NextAuth v5) do Games Zoom: uma wishlist da Steam
compartilhavel entre amigos. Consome a API do repo `games-zoom-api`.

## Rodando local

```bash
pnpm install
cp .env.example .env    # API_BASE_URL=http://localhost:3001, AUTH_SECRET, NEXT_PUBLIC_APP_URL
pnpm dev             # http://localhost:3000
pnpm test                # testes unitarios
```

Suba o `games-zoom-api` antes (porta 3001).

## Fluxo

1. `/registro` cria a conta -> e-mail de confirmacao (a API envia; em dev o link vai
   para o console do `games-zoom-api`).
2. Link do e-mail -> `/verificar?token=` -> conta confirmada.
3. `/login` -> `/listas`. Criar lista, abrir, copiar o link de convite.
4. Amigo abre `/entrar/[token]`, faz login/cadastro, entra na lista e passa a poder
   adicionar jogos colando o link da Steam.

## Deploy na Vercel

1. Importe este repo. Configure `API_BASE_URL` (URL do games-zoom-api),
   `AUTH_SECRET`, `NEXT_PUBLIC_APP_URL` (a URL final desta UI).
2. No `games-zoom-api`, aponte `CORS_ORIGIN` e `APP_URL` para esta URL.

Veja `CLAUDE.md` para arquitetura e convencoes.
