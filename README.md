# Sistema de Gestão de Chamados

API REST para gerenciamento de chamados de suporte, desenvolvida para a **Etapa 1 — Back-end** do Projeto de Avaliação da disciplina de Desenvolvimento de Sistemas Web.

O código da API fica na pasta [`backend/`](backend).

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
| cors | Controle de quais origens podem chamar a API |
| dotenv | Variáveis de ambiente |
| Jest + Supertest | Testes automatizados |

## Arquitetura

A API é organizada em camadas, cada uma com uma responsabilidade:

```
Requisição HTTP
   │
   ▼
Routes        → declara o endpoint e aplica os middlewares (autenticar, validar)
   │
   ▼
validar (Zod) → valida body, params e query antes do controller
   │
   ▼
Controllers   → lê os dados já validados, chama o service e devolve a resposta HTTP
   │
   ▼
Services      → regras de negócio (ex.: email duplicado, categoria existente). Não conhece req/res nem o Prisma
   │
   ▼
Repositories  → único lugar que conhece o Prisma: só consultas ao banco
   │
   ▼
Prisma → PostgreSQL (Supabase)
```

Erros lançados em qualquer camada chegam ao **middleware global de erros** (`errorHandler`), que converte cada erro no status HTTP adequado. Como o Express 5 já encaminha os erros de funções `async` para esse middleware, não é preciso espalhar `try/catch` pelos controllers.

### Estrutura de pastas

```
backend/
├── prisma/
│   ├── migrations/              # Histórico de migrations do banco
│   ├── schema.prisma            # Modelos, enums e relacionamentos
│   └── seed.ts                  # Categorias iniciais
├── src/
│   ├── routes/                  # Declara as rotas, aplica autenticar/validar e aponta para o controller
│   │   ├── index.ts             # Agrega os roteadores de cada recurso
│   │   ├── auth.routes.ts
│   │   ├── users.routes.ts
│   │   ├── categories.routes.ts
│   │   └── tickets.routes.ts
│   ├── schemas/                 # Schemas Zod: formato de body e params de cada rota
│   │   ├── common.ts            # idParamsSchema e formatação das mensagens de erro
│   │   ├── auth.schema.ts
│   │   ├── category.schema.ts
│   │   └── ticket.schema.ts
│   ├── controllers/             # Lê req.validated, chama o service, formata a resposta HTTP
│   ├── services/                # Regras de negócio
│   ├── repositories/            # Acesso ao banco com Prisma
│   ├── middlewares/
│   │   ├── autenticar.ts        # Exige "Authorization: Bearer TOKEN"
│   │   ├── validar.ts           # Valida com Zod e lança ErroValidacao (400)
│   │   ├── errorHandler.ts      # Tratamento de erros centralizado (inclusive erros do Prisma)
│   │   └── notFound.ts          # 404 para rotas inexistentes
│   ├── utils/
│   │   ├── erros.ts             # ErroValidacao (400), ErroNaoAutorizado (401), ErroNaoEncontrado (404), ErroConflito (409)
│   │   └── jwt.ts               # gerarToken e verificarToken
│   ├── config/
│   │   ├── db.ts                # Instância única do Prisma Client
│   │   └── env.ts               # Leitura e validação das variáveis de ambiente
│   ├── types/                   # Tipos do TypeScript (req.user, req.validated)
│   ├── app.ts                   # Monta o Express: CORS, JSON, rotas, notFound e errorHandler
│   └── server.ts                # Ponto de entrada: sobe o servidor HTTP
├── tests/                       # Testes automatizados, separados por camada
├── docs/postman_collection.json
├── .env.example
├── jest.config.js
├── package.json
└── tsconfig.json
```

Cada recurso segue o mesmo caminho. Por exemplo, para chamados: `routes/tickets.routes.ts` → `schemas/ticket.schema.ts` → `controllers/tickets.controller.ts` → `services/tickets.service.ts` → `repositories/tickets.repository.ts`. As funções seguem os mesmos nomes em todas as camadas: `listar`, `buscarPorId`, `criar`, `atualizar` e `remover`.

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
- Não é permitido criar chamado com **categoria inexistente** (`400`).
- Não é permitido cadastrar **email duplicado** nem **categoria com nome duplicado** (`409`).
- Não é permitido atualizar ou excluir chamado inexistente (`404`).
- A senha é armazenada apenas como hash (bcrypt) e o `passwordHash` **nunca** é retornado pela API.

## Decisões de design

- **Dono do chamado vem do token, não do corpo.** O `userId` é lido do JWT pelo middleware de autenticação. Assim, um usuário não consegue abrir chamados em nome de outro, mesmo enviando um `userId` na requisição.
- **Cada usuário só acessa os próprios chamados.** As consultas filtram por `id` **e** `userId`. Um chamado de outro usuário responde `404`, sem revelar que ele existe.
- **Camada de repositories.** Só os repositories conhecem o Prisma. Os services ficam com as regras de negócio e podem ser testados com repositories falsos, sem banco.
- **Erros centralizados.** Os services lançam erros com o status HTTP (`ErroValidacao`, `ErroNaoEncontrado`, `ErroConflito`...) e um único middleware monta a resposta. Os controllers ficam curtos e não precisam de `try/catch`.
- **Validação antes da regra de negócio.** O middleware `validar` aplica o schema do Zod antes do controller, e os dados convertidos ficam em `req.validated`. O service já recebe dados válidos, e campos que não estão no schema (como `userId`) são descartados.
- **Enums do Prisma reaproveitados no Zod.** `status` e `priority` são validados com os mesmos enums do banco (`z.enum`), então a validação e o banco nunca divergem.
- **IDs numéricos.** IDs autoincrementais (`/tickets/1`) são mais fáceis de usar na demonstração do que UUIDs.
- **RLS no Supabase.** Ativar o Row Level Security bloqueia o acesso às tabelas pela API pública do Supabase. Os dados só podem ser acessados pela nossa API.

## Como instalar

Pré-requisitos: **Node.js 20+** e um projeto no **Supabase**, ou um PostgreSQL 14+ local.

```bash
git clone https://github.com/VitorHugoVH/Sistema-de-Chamados.git
cd Sistema-de-Chamados/backend
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

As variáveis são validadas na inicialização (`src/config/env.ts`). Se faltar alguma obrigatória, a API não sobe e informa qual está faltando. O arquivo `.env` está no `.gitignore` e **não deve ser commitado**.

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

## Testes

```bash
npm test               # roda todos os testes
npm run test:coverage  # mostra a cobertura de código
```

Os testes usam **Jest + Supertest** e ficam em `tests/`, separados por camada:

| Pasta | O que testa |
| --- | --- |
| `tests/schemas/` | Schemas Zod: dados válidos e inválidos |
| `tests/services/` | Regras de negócio, com os repositories mockados |
| `tests/repositories/` | Consultas enviadas ao Prisma (ex.: filtro pelo dono do chamado) |
| `tests/middlewares/` | errorHandler: status e formato de cada tipo de erro |
| `tests/routes/` | Requisições HTTP completas: cadastro, login, proteção por JWT e chamados |

O Prisma é substituído por um mock em `tests/jest.setup.ts`, então os testes **não precisam de banco de dados**.

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
{ "erro": "Chamado não encontrado" }
```

Erros de validação trazem também a lista de campos inválidos:

```json
{
  "erro": "Dados inválidos",
  "detalhes": [
    "email: deve ser um email válido",
    "password: deve ter pelo menos 6 caracteres"
  ]
}
```

| Status | Quando |
| --- | --- |
| `200` | Sucesso em consulta, atualização ou exclusão |
| `201` | Recurso criado (usuário, categoria, chamado) |
| `400` | Dados inválidos, categoria inexistente, JSON malformado ou `:id` não numérico |
| `401` | Token ausente/inválido/expirado ou credenciais erradas |
| `404` | Registro inexistente (chamado, categoria, usuário ou rota) |
| `409` | Email ou nome de categoria já cadastrado |
| `500` | Erro inesperado (sem detalhes internos na resposta) |

## Autenticação

1. Cadastre um usuário em `POST /auth/register`.
2. Faça login em `POST /auth/login` e copie o `token` da resposta.
3. Envie o token no header das rotas protegidas:

   ```
   Authorization: Bearer TOKEN
   ```

O middleware `autenticar` (`src/middlewares/autenticar.ts`), com a validação do token feita em `authService.validarToken`:

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

Importe o arquivo [`backend/docs/postman_collection.json`](backend/docs/postman_collection.json) no Postman (**Import**). A coleção está organizada em pastas, na ordem da apresentação:

| Pasta | O que demonstra |
| --- | --- |
| **00 - API no ar** | `GET /health` |
| **01 - Autenticação** | Cadastro (bcrypt) e login (JWT). O token é salvo automaticamente |
| **02 - Categorias** | Listar, criar (rota protegida) e buscar por ID |
| **03 - Chamados (CRUD)** | Criar, listar, buscar, atualizar, alterar status, excluir e confirmar a exclusão (404) |
| **04 - Usuários** | Buscar dados públicos do usuário (sem senha) |
| **05 - Erros e segurança** | 401 sem token e com token inválido, 400 de validação e de categoria inexistente, 409 de email duplicado, 404 de chamado inexistente |

- As rotas protegidas usam o **Bearer Token** configurado na coleção, com a variável `{{token}}` preenchida pelo login.
- Os ids da categoria e do chamado criados também são salvos em variáveis (`{{categoryId}}`, `{{ticketId}}`).
- O email do usuário e o nome da categoria são gerados a cada execução, então a demonstração pode ser repetida sem erro de duplicidade.
- Cada requisição tem testes automáticos que conferem o status esperado. Para rodar tudo de uma vez: clique na coleção → **Run**.

## CORS

As origens permitidas são definidas pela variável `CORS_ORIGIN`, com várias separadas por vírgula. O padrão é `http://localhost:3000`. Para liberar outras aplicações, basta incluir as URLs na variável:

```
CORS_ORIGIN="http://localhost:3000,https://minha-aplicacao.com"
```
