# Games Zoom — UI

Frontend do Games Zoom: wishlist da Steam compartilhavel entre amigos. Next.js 16
App Router com **React Server Components**. Deploy na Vercel. Consome o repo
`games-zoom-api` (REST) — este repo **nao** tem banco nem Prisma.

## Instrucoes para o Claude

Sempre que o usuario passar uma diretriz importante (regra de negocio, padrao de
UI/UX, convencao de codigo que vale daqui pra frente), registrar neste arquivo na
secao mais relevante — nao so aplicar na tarefa da vez.

## Testes unitarios (OBRIGATORIO para logica pura)

Toda funcao com logica nao-trivial (parsing/validacao de input, formatacao de
preco/moeda, mapeamento de erro de API, ordenacao) **precisa** de teste `vitest`
junto com a implementacao.

- Logica pura em `src/lib/<x>.ts`, teste em `src/lib/<x>.test.ts`. Referencias:
  `steam-url.test.ts`, `price.test.ts`, `api-error.test.ts`.
- **Nao** importar de modulos com `import "server-only"` num arquivo `.test.ts` —
  o pacote `server-only` lanca fora do contexto RSC. Por isso `toApiError`/`ApiError`
  moram em `src/lib/api-error.ts` (puro) e o `api.ts` (com `server-only`) so re-exporta.
- Componentes e server actions sao verificados por smoke manual (rodar a app).
- **Rodar `pnpm test` antes de considerar a tarefa pronta**, junto com `pnpm exec tsc --noEmit`
  e `pnpm build`.
- Cobrir sempre: entrada vazia, formato inesperado, ausencia de dados (preco null,
  jogo gratuito), e o cenario de regressao que motivou a mudanca.

## Stack

- **Next.js 16** (App Router, RSC). Middleware em `src/proxy.ts` (nome novo do
  `middleware.ts` no Next 16).
- **NextAuth v5** (Credentials + JWT). Config edge-safe em `src/lib/auth.config.ts`
  (usada pelo `proxy.ts`); provider completo em `src/lib/auth.ts` — **nunca importar
  `auth.ts` no proxy**, quebra o Edge Runtime.
- **Tailwind v4** (sem shadcn — primitivos proprios em `src/components/ui/`).
- **sonner** para notificacoes (toast). `<Toaster>` fica no `src/app/layout.tsx`.
- **zod 4** para validar formularios nas server actions.

## Feedback ao usuario (toasts)

- Toda server action de formulario retorna `{ error?, success?, nonce, emailSent? }`.
  `nonce` = timestamp do submit (obrigatorio) — deixa o cliente reagir mesmo quando
  a mensagem se repete.
- No client component, `useFormToast(state)` (`src/hooks/use-form-toast.ts`) dispara
  o toast: `error` -> vermelho, `success` -> verde, `success` com `emailSent === false`
  -> amarelo (aviso). Manter tambem a mensagem inline no form (acessibilidade / quem
  perdeu o toast).
- Fluxo de e-mail: `registerAction`/`resendAction` propagam `emailSent`/`sent` da API.
  A tela de "conta criada" mostra um `<ResendForm compact>` ja preenchido para retry.

## Como a autenticacao funciona

1. `loginAction` (`src/actions/auth.ts`) chama `POST {API}/api/auth/login` **primeiro**
   para ter a mensagem de erro exata (ex.: `EMAIL_NOT_VERIFIED`).
2. Se passou, chama `signIn("credentials", ...)`, que refaz o login pela API e guarda
   `{ user, apiToken }`.
3. O JWT do next-auth carrega `apiToken` (token que a API emitiu). `session.apiToken`
   e reapresentado em `Authorization: Bearer` em toda chamada server-side (`src/lib/api.ts`).
4. Registro (`registerAction`) so cria a conta na API e mostra "confirme seu e-mail" —
   nao loga. O usuario clica no link do e-mail -> `/verificar?token=` -> chama a API.

## Camada de acesso a API

- `src/lib/api.ts` — wrapper `fetch` server-only. `api.get/post/del`, injeta o Bearer,
  converte erro em `ApiError` (via `toApiError`, puro). **So use no servidor**
  (server components, server actions, route handlers).
- `src/lib/wishlists.ts` — funcoes de leitura (`getMyWishlists`, `getWishlist`,
  `getSharedPreview`) que pegam o token da sessao e chamam a API.
- Server actions em `src/actions/` fazem as escritas e `revalidatePath`.
- `API_BASE_URL` (env, server-only) aponta para o `games-zoom-api`.

## Rotas

| Rota | Grupo | Auth | O que e |
|---|---|---|---|
| `/` | — | sim | redireciona para `/listas` |
| `/login`, `/registro`, `/verificar` | `(auth)` | nao | fluxo de conta |
| `/listas` | `(app)` | sim | minhas listas + criar + busca (`?q=`) |
| `/listas/[id]` | `(app)` | sim | `?tab=jogos` (busca `?q=` + ordenacao `?sort=`) / `?tab=acessos` (so dono) |
| `/entrar/[token]` | — | opcional | previa via convite + entrar na lista |

Rotas publicas estao em `PUBLIC_PREFIXES` no `proxy.ts`. Rota protegida sem sessao
redireciona para `/login?next=<rota>`.

## Layout (sidebar)

- `(app)/layout.tsx` (server): grid `[260px_1fr]` no desktop; `<MobileHeader>` (client,
  drawer) no mobile (`lg:hidden`). Ambos renderizam `<SidebarContent>` (client,
  `usePathname` p/ item ativo) — logo, "Minhas listas", a lista das wishlists do
  usuario (nome + contagem), e no rodape nome + "Sair".
- O layout busca `getMyWishlists()` (envolto em `cache()` do React — dedupe com a page).
  Se a API cair, a sidebar renderiza sem as listas (nao quebra).

## Busca, filtro e ordenacao (URL e a fonte da verdade)

- `src/components/filters/search-field.tsx` — input com debounce que so le/escreve
  `?<paramName>=` (`router.replace`, `scroll:false`). Nunca guarda o resultado.
- `src/components/filters/sort-select.tsx` — `<select>` que escreve `?sort=`.
- A **page (RSC)** le `searchParams`, filtra/ordena o array de itens e renderiza —
  nenhum estado de filtro no client.
- `src/lib/text.ts` — `normalize` (sem acento/caixa) + `matchesQuery` (AND de termos).
- `src/lib/sort-items.ts` — `SORT_OPTIONS`, `parseSort`, `sortItems` (copia, estavel,
  empate -> mais recente). Ordens: recent/oldest/price_asc/price_desc/discount/title/author.
- `src/lib/format-date.ts` — `formatDate`/`formatDateTime` (fuso Brasilia) + `expiryLabel`
  (puro, recebe `now`).
- Todos com teste `vitest`.

## Acessos e convites (so dono, aba "Acessos")

- `AccessPanel` — lista dono + colaboradores (com data de entrada), botao "Remover"
  por colaborador (`removeCollaboratorAction`). Colaborador se remove pelo botao
  "Sair da lista" no header (`LeaveWishlistButton` / `leaveWishlistAction`).
- `InvitesPanel` + `CreateInviteForm` (select de validade: 7d/1d/30d/never) +
  `InviteRow` (badge de estado, copiar, revogar). Links inativos ficam num `<details>`.
- Mutations de wishlist retornam `ActionResult = { ok, error? }` — o `<ActionButton>`
  (client generico) dispara toast de erro e confirma antes quando `confirm` e passado.
- URL do convite: `inviteUrl(token)` em `src/lib/invite-url.ts` (client-safe,
  usa `NEXT_PUBLIC_APP_URL`).

## Steam

- `src/lib/steam-url.ts` — `extractSteamAppId` faz a validacao **client-side** do que
  o usuario cola (feedback imediato). A validacao que vale e a da API. Mantido em
  sincronia com `parseSteamAppId` do `games-zoom-api` (mesmos casos de teste).
- `src/lib/price.ts` — formatacao do `priceOverview` (snapshot vindo da API):
  `formatPrice` (gratuito / indisponivel / com desconto), `discountLabel`, `originalPrice`.
- Banners de jogos vem da CDN da Steam — hosts liberados em `next.config.ts`
  (`images.remotePatterns`). `<Image unoptimized>` no `GameCard` (a CDN ja serve
  tamanhos ok e evita custo de otimizacao na Vercel).

## Design / UI

- Tema escuro unico (tokens em `src/app/globals.css` sob `:root` + `@theme inline`).
  Cores: `background` (fundo), `surface`/`surface-2` (cards), `primary` (azul, acoes),
  `danger`, `success`. Sempre usar os tokens, nunca hex solto.
- Primitivos em `src/components/ui/` (`Button`, `Input`/`Label`, `Card`). Botao que
  confirma/avanca fica a direita; cancelar a esquerda.
- Todo input de formulario precisa de `<Label>` ou `aria-label` — nunca so `placeholder`.
- Responsivo: campos empilham em mobile (`flex-col sm:flex-row`), grid de jogos
  `sm:grid-cols-2 lg:grid-cols-3`. Testar em ~375px.
- Feedback de acao: server actions retornam `{ error?, success? }` e o form mostra
  em `text-danger` / `text-success`.

## Deploy na Vercel

- Env vars: `API_BASE_URL` (URL do games-zoom-api), `AUTH_SECRET`, `NEXT_PUBLIC_APP_URL`
  (a propria URL desta UI — usada no link de convite).
- No `games-zoom-api`, setar `CORS_ORIGIN` e `APP_URL` = esta URL.
