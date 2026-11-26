# Sistema de Gestão de Chamados

Sistema full-stack para abrir, acompanhar e resolver chamados de suporte.

| Parte | Tecnologias | Pasta |
| --- | --- | --- |
| Back-end (Etapa 1) | Node.js, Express, TypeScript, Prisma, PostgreSQL (Supabase), Zod, JWT, Jest | `backend/` |
| Front-end (Etapa 2) | Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS | `frontend/` |

## Deploy

- Front-end: _adicionar URL da Vercel_
- API: _adicionar URL do Render_

## Arquitetura

```
Navegador ──> Next.js (frontend/) ──> API Express (backend/) ──> PostgreSQL
              Server Components        rotas -> controllers
              Server Actions           -> services -> repositories
              middleware.ts            -> Prisma
```

O navegador nunca chama a API diretamente. Toda chamada sai do servidor do Next.js
(Server Components e Server Actions), que envia o JWT guardado em cookie `httpOnly`.
Assim o token não fica acessível para JavaScript no navegador.

## Como rodar localmente

### 1. Back-end

```bash
cd backend
npm install
cp .env.example .env      # preencha DATABASE_URL, DIRECT_URL e JWT_SECRET
npx prisma migrate deploy
npx prisma db seed        # categorias iniciais
npm run dev               # http://localhost:3333
```

Testes: `npm test`

### 2. Front-end

```bash
cd frontend
npm install
cp .env.example .env.local   # API_URL=http://localhost:3333
npm run dev                  # http://localhost:3000
```

## Endpoints da API

| Método | Rota | Auth |
| --- | --- | --- |
| POST | /auth/register | não |
| POST | /auth/login | não |
| GET | /users/:id | sim |
| GET | /categories | não |
| GET | /categories/:id | não |
| POST | /categories | sim |
| GET | /tickets | sim |
| GET | /tickets/:id | sim |
| POST | /tickets | sim |
| PUT | /tickets/:id | sim |
| DELETE | /tickets/:id | sim |

Rotas com auth: `Authorization: Bearer TOKEN` (token do login).

Coleção do Postman: `backend/docs/postman_collection.json`

## Front-end

### Páginas (App Router)

| Rota | Tipo | O que faz |
| --- | --- | --- |
| `/` | Server Component | Página inicial, lista as categorias vindas da API |
| `/login`, `/cadastro` | Route group `(auth)` | Formulários com Server Actions; guardam o JWT em cookie |
| `/chamados` | Server Component, protegida | Busca `GET /tickets`, mostra resumo por status e lista com filtro |
| `/chamados/novo` | Protegida | Cria chamado (`POST /tickets`) |
| `/chamados/[id]` | Protegida | Detalhes do chamado, excluir (`DELETE /tickets/:id`) |
| `/chamados/[id]/editar` | Protegida | Edita título, descrição, categoria, prioridade e status (`PUT`) |
| `/categorias` | Server Component | Lista categorias; usuário logado cria nova (`POST /categories`) |
| `/sair` | Route Handler | Limpa a sessão quando a API responde 401 |

### Onde está cada requisito

- **Server Components com dados reais:** `app/page.tsx`, `app/chamados/page.tsx`, `app/chamados/[id]/page.tsx` (funções em `lib/data.ts`).
- **Client Components com estado e eventos:** `components/FiltroChamados.tsx` (busca e filtros com `useState`), `components/BotaoExcluir.tsx` (confirmação), `components/LinkNavegacao.tsx` (link ativo com `usePathname`), formulários com `useActionState`.
- **Server Actions (criar, editar, remover):** `lib/actions.ts`.
- **Autenticação:** login e cadastro em `lib/actions.ts`, cookie `httpOnly` em `lib/sessao.ts`, rotas protegidas em `middleware.ts` (redireciona para `/login?redirect=...`).
- **Otimizações do Next.js:** `next/link` na navegação, `next/image` no logo, `next/font` (Geist).
- **SEO:** `metadata` no layout com template de título, `metadata` por página e `generateMetadata` no detalhe do chamado.
- **Estados de carregamento e erro:** `app/chamados/loading.tsx`, `app/chamados/error.tsx`, `app/not-found.tsx`.

### Decisões de design

- **JWT em cookie `httpOnly`**, não em `localStorage`: protege o token contra scripts injetados (XSS).
- **Chamadas à API só no servidor:** a URL da API fica em `API_URL` (sem `NEXT_PUBLIC_`), e o token vai no header `Authorization` montado em `lib/api.ts`.
- **Middleware lê o `exp` do JWT:** token vencido nem chega a renderizar a página. A assinatura continua sendo verificada pela API.
- **Erros da API aparecem no formulário:** a resposta `{ erro, detalhes }` do back-end (validação Zod) vira o estado do `useActionState`.

## Deploy (passo a passo)

### API no Render

1. New > Web Service, conecte o repositório, Root Directory: `backend`.
2. Build Command: `npm install && npx prisma generate && npm run build`
3. Start Command: `npx prisma migrate deploy && npm start`
4. Variáveis: `DATABASE_URL`, `DIRECT_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN=1d`, `NODE_ENV=production`, `CORS_ORIGIN` (URL da Vercel).

### Front-end na Vercel

1. Add New > Project, importe o repositório, Root Directory: `frontend`.
2. Variável: `API_URL` = URL pública do Render (sem barra no final).
3. Deploy.
