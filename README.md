# Sistema de Gestão de Chamados

API REST em Node.js, Express, TypeScript, Prisma e PostgreSQL (Supabase).

## Como rodar

```bash
cd backend
npm install
cp .env.example .env
npx prisma migrate deploy
npm run dev
```

Testes: `npm test`

## Endpoints

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
