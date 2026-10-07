# Sistema de Gestão de Chamados

API REST para gerenciamento de chamados de suporte, desenvolvida como **Projeto de Avaliação Full-Stack** da disciplina de Desenvolvimento de Sistemas Web.

- **Etapa 1 — Back-end** (este conteúdo): API em Node.js + Express, pasta [`backend/`](backend).
- **Etapa 2 — Front-end**: Next.js, a ser desenvolvido na pasta `frontend/`.

Usuários se cadastram, fazem login (JWT) e abrem chamados classificados por categoria, com status e prioridade.

## Tecnologias

| Tecnologia | Uso |
| --- | --- |
| Node.js + Express 5 | Servidor HTTP e rotas |
| TypeScript | Tipagem estática |
| PostgreSQL (Supabase) | Banco de dados relacional hospedado no Supabase |
| Prisma ORM | Modelagem, migrations e acesso ao banco |
| Zod | Validação dos dados de entrada |
| bcrypt | Hash de senhas |
| jsonwebtoken (JWT) | Autenticação |
| cors | Liberação de acesso para o front-end |
| dotenv | Variáveis de ambiente |
| Vitest + Supertest | Testes automatizados |

## Arquitetura

A API é organizada em camadas, cada uma com uma responsabilidade:

```
Requisição HTTP
   │
   ▼
Routes        → define o endpoint e os middlewares (autenticação, validação)
   │
   ▼
Controllers   → lê a requisição, chama o service e devolve a resposta HTTP
   │
   ▼
Services      → regras de negócio (ex.: email duplicado, categoria existente)
   │
   ▼
Prisma        → acesso ao banco
   │
   ▼
PostgreSQL (Supabase)
```

Erros lançados em qualquer camada chegam ao **middleware global de erros** (`errorHandler`). Ele converte cada erro no status HTTP adequado. Como o Express 5 já encaminha os erros de funções `async` para esse middleware, não é preciso espalhar `try/catch` pelo código.

### Estrutura de pastas

```
backend/
├── prisma/
│   ├── migrations/            # Histórico de migrations do banco
│   ├── schema.prisma          # Modelos, enums e relacionamentos
│   └── seed.ts                # Categorias iniciais
├── src/
│   ├── controllers/           # Camada HTTP (req → service → res)
│   ├── services/              # Regras de negócio + Prisma
│   ├── routes/                # Definição dos endpoints
│   ├── middlewares/           # auth, validate, errorHandler, notFound
│   ├── validators/            # Schemas do Zod
│   ├── lib/                   # env, prisma (instância única), jwt
│   ├── utils/                 # AppError, parseId
│   ├── types/                 # Tipos (ex.: req.user)
│   ├── app.ts                 # Configuração do Express (CORS, JSON, rotas, erros)
│   └── server.ts              # Inicialização do servidor
├── tests/                     # Testes automatizados
├── docs/postman_collection.json
├── .env.example
├── package.json
└── tsconfig.json
```

### Entidades e relacionamentos

```
User 1 ──── N Ticket N ──── 1 Category
```

| Entidade | Campos |
| --- | --- |
| **User** | id, name, email (único), passwordHash, createdAt, updatedAt |
| **Category** | id, name (único), description, createdAt, updatedAt |
| **Ticket** | id, title, description, status, priority, userId, categoryId, createdAt, updatedAt |

- Um **User** possui vários **Tickets**; cada **Ticket** pertence a um **User**.
- Uma **Category** possui vários **Tickets**; cada **Ticket** pertence a uma **Category**.
- `status` (enum `TicketStatus`): `OPEN`, `IN_PROGRESS`, `RESOLVED`, `CLOSED`. Padrão: `OPEN`.
- `priority` (enum `TicketPriority`): `LOW`, `MEDIUM`, `HIGH`. Padrão: `MEDIUM`.

### Regras de negócio

- O dono do chamado (`userId`) vem **sempre do JWT**. Um `userId` enviado no corpo da requisição é ignorado.
- Cada usuário só visualiza, altera e exclui **os próprios chamados**. Chamados de outros usuários respondem `404`.
- O chamado precisa pertencer a uma **categoria existente**, tanto na criação quanto na atualização.
- Todo chamado nasce com status `OPEN`. O status é alterado depois, via `PUT`.
- Não é permitido cadastrar **email duplicado** nem **categoria com nome duplicado** (`409`).
- Não é permitido atualizar ou excluir chamado inexistente (`404`).
- A senha é armazenada apenas como hash (bcrypt) e o `passwordHash` **nunca** é retornado pela API.

## Como instalar

Pré-requisitos: **Node.js 20+** e um projeto no **Supabase**, ou um PostgreSQL 14+ local.

```bash
git clone https://github.com/VitorHugoVH/Projeto-de-Avalia-o.git
cd Projeto-de-Avalia-o/backend
npm install
```

## Variáveis de ambiente

Copie o arquivo de exemplo e ajuste os valores:

```bash
cp .env.example .env
```

| Variável | Obrigatória | Descrição |
| --- | --- | --- |
| `DATABASE_URL` | Sim | Conexão usada pela API (Supabase: pooler em modo *transaction*, porta 6543) |
| `DIRECT_URL` | Sim (Prisma CLI) | Conexão usada pelas migrations (Supabase: modo *session*, porta 5432) |
| `JWT_SECRET` | Sim | Segredo usado para assinar os tokens |
| `PORT` | Não (padrão `3333`) | Porta da API |
| `JWT_EXPIRES_IN` | Não (padrão `1d`) | Validade do token (ex.: `1h`, `1d`) |
| `CORS_ORIGIN` | Não (padrão `http://localhost:3000`) | Origens permitidas, separadas por vírgula |
| `NODE_ENV` | Não (padrão `development`) | `development`, `production` ou `test` |

Para gerar um `JWT_SECRET` aleatório:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

As variáveis são validadas na inicialização (`src/lib/env.ts`). Se faltar alguma obrigatória, a API não sobe e informa qual está faltando. O arquivo `.env` está no `.gitignore` e **não deve ser commitado**.

## Banco de dados

O banco é um PostgreSQL hospedado no **Supabase**, projeto **Sistema de Chamados**. A API acessa o banco somente pelo Prisma; os recursos de Auth e Data API do Supabase não são usados.

### Configurando a conexão com o Supabase

1. No painel do Supabase, abra o projeto e clique em **Connect** → aba **ORMs** → **Prisma**.
2. Copie as duas strings para o `.env`, trocando `[YOUR-PASSWORD]` pela senha do banco definida ao criar o projeto. Se não lembrar a senha, redefina em *Project Settings → Database*.
   - `DATABASE_URL`: modo *transaction*, porta **6543**, com `?pgbouncer=true`. É a conexão da API.
   - `DIRECT_URL`: modo *session*, porta **5432**. É usada pelo Prisma para rodar migrations.
3. Confira se o banco está sincronizado com as migrations:

   ```bash
   npx prisma migrate status
   ```

4. Para aplicar migrations novas (ou montar um banco do zero):

   ```bash
   npx prisma migrate deploy
   ```

5. (Opcional) Popule as categorias iniciais (Hardware, Software, Rede, Acesso):

   ```bash
   npx prisma db seed
   ```

**Por que duas URLs?** O Supabase usa um *pooler* (Supavisor) que compartilha conexões entre muitas requisições, ideal para a API. As migrations precisam de uma conexão de sessão "completa", por isso o Prisma usa a `DIRECT_URL` para elas.

**Segurança (RLS).** O Supabase expõe automaticamente as tabelas do schema `public` por uma API REST pública (Data API). A migration `enable_row_level_security` ativa o *Row Level Security* em todas as tabelas sem criar policies, o que bloqueia esse acesso externo. Os dados, incluindo `password_hash`, só podem ser acessados pela nossa API, que conecta como dona das tabelas.

### Alternativa: PostgreSQL local

Crie o banco (`CREATE DATABASE gestao_chamados;`), use a mesma string local em `DATABASE_URL` e `DIRECT_URL` e rode `npx prisma migrate dev`.

Outros comandos úteis:

| Comando | Para que serve |
| --- | --- |
| `npx prisma generate` | Gera o Prisma Client a partir do `schema.prisma` |
| `npx prisma migrate dev --name nome` | Cria e aplica uma nova migration (desenvolvimento) |
| `npx prisma migrate deploy` | Aplica as migrations existentes (produção) |
| `npx prisma studio` | Interface visual para ver os dados do banco |

## Como executar

```bash
npm run dev     # desenvolvimento, com reinício automático
```

A API ficará disponível em `http://localhost:3333`. Para verificar: `GET /health` deve responder `{ "status": "ok" }`.

Produção:

```bash
npm run build   # compila o TypeScript para dist/
npm start       # executa dist/server.js
```

Testes:

```bash
npm test
```

Os testes usam um mock do Prisma, então **não precisam de banco de dados**.

## Endpoints

| Método | Endpoint | Autenticação | Descrição |
| ------ | -------- | ------------ | --------- |
| GET | `/health` | Não | Verifica se a API está no ar |
| POST | `/auth/register` | Não | Cadastra um usuário |
| POST | `/auth/login` | Não | Faz login e retorna o JWT |
| GET | `/users/:id` | Sim | Busca os dados públicos de um usuário |
| GET | `/categories` | Não | Lista as categorias |
| GET | `/categories/:id` | Não | Busca uma categoria (com total de chamados) |
| POST | `/categories` | Sim | Cria uma categoria |
| POST | `/tickets` | Sim | Cria um chamado para o usuário autenticado |
| GET | `/tickets` | Sim | Lista os chamados do usuário autenticado |
| GET | `/tickets/:id` | Sim | Busca um chamado por ID |
| PUT | `/tickets/:id` | Sim | Atualiza um chamado (inclusive o status) |
| DELETE | `/tickets/:id` | Sim | Exclui um chamado |

### Exemplos de corpo

`POST /auth/register`

```json
{ "name": "Maria Souza", "email": "maria@exemplo.com", "password": "senha123" }
```

`POST /auth/login`

```json
{ "email": "maria@exemplo.com", "password": "senha123" }
```

Resposta:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { "id": 1, "name": "Maria Souza", "email": "maria@exemplo.com" }
}
```

`POST /categories`

```json
{ "name": "Impressoras", "description": "Problemas com impressão" }
```

`POST /tickets` (`priority` é opcional, padrão `MEDIUM`)

```json
{
  "title": "Impressora não liga",
  "description": "A impressora do 2º andar não liga desde ontem",
  "priority": "HIGH",
  "categoryId": 1
}
```

`PUT /tickets/:id` aceita qualquer combinação de `title`, `description`, `priority`, `status` e `categoryId` (pelo menos um campo):

```json
{ "status": "IN_PROGRESS" }
```

### Respostas de erro

Todos os erros seguem o mesmo formato:

```json
{ "error": "Chamado não encontrado" }
```

Erros de validação trazem também a lista de campos inválidos:

```json
{
  "error": "Dados inválidos",
  "details": [
    { "field": "email", "message": "Email inválido" },
    { "field": "password", "message": "A senha deve ter pelo menos 6 caracteres" }
  ]
}
```

| Status | Quando |
| --- | --- |
| `200` | Sucesso em consulta, atualização ou exclusão |
| `201` | Recurso criado (usuário, categoria, chamado) |
| `400` | Dados inválidos, JSON malformado ou `:id` não numérico |
| `401` | Token ausente/inválido/expirado ou credenciais erradas |
| `404` | Recurso inexistente (chamado, categoria, usuário ou rota) |
| `409` | Email ou nome de categoria já cadastrado |
| `500` | Erro inesperado (sem detalhes internos na resposta) |

## Autenticação

1. Cadastre um usuário em `POST /auth/register`.
2. Faça login em `POST /auth/login` e copie o `token` da resposta.
3. Envie o token no header das rotas protegidas:

   ```
   Authorization: Bearer TOKEN
   ```

O middleware `authenticate` (`src/middlewares/auth.ts`):

1. verifica se o header `Authorization` existe;
2. extrai o token do formato `Bearer TOKEN`;
3. valida a assinatura e a expiração do JWT com o `JWT_SECRET`;
4. busca no banco o usuário dono do token;
5. disponibiliza o usuário em `req.user` para os controllers;
6. responde `401` em qualquer falha.

Exemplo com curl:

```bash
TOKEN="cole-o-token-aqui"
curl http://localhost:3333/tickets -H "Authorization: Bearer $TOKEN"
```

## Demonstração (Postman / Insomnia)

Importe o arquivo [`backend/docs/postman_collection.json`](backend/docs/postman_collection.json) no Postman ou no Insomnia. As requisições estão numeradas na ordem do fluxo:

1. Registrar usuário
2. Login: o token é salvo automaticamente na variável `{{token}}`
3. Listar categorias
4. Criar categoria: o id é salvo em `{{categoryId}}`
5. Buscar categoria por ID
6. Criar chamado: o id é salvo em `{{ticketId}}`
7. Listar chamados
8. Buscar chamado por ID
9. Atualizar chamado
10. Alterar status
11. Buscar usuário por ID
12. Excluir chamado
13. Rota protegida sem JWT → `401`

O salvamento automático das variáveis funciona no Postman. No Insomnia ou no Thunder Client, copie o token manualmente para a variável `token`.

## CORS

As origens permitidas são definidas pela variável `CORS_ORIGIN`, com várias separadas por vírgula. O padrão é `http://localhost:3000`, onde roda o front-end Next.js em desenvolvimento. Em produção, basta incluir a URL publicada do front-end:

```
CORS_ORIGIN="http://localhost:3000,https://meu-front.vercel.app"
```
