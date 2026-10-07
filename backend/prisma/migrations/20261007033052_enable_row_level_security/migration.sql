-- O Supabase expõe as tabelas do schema "public" pela Data API (REST) usando a chave "anon".
-- Ativar RLS sem criar policies bloqueia esse acesso externo: os dados só podem ser
-- lidos/alterados pela nossa API, que conecta via Prisma como dono das tabelas.
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "categories" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "tickets" ENABLE ROW LEVEL SECURITY;

-- A tabela de controle do Prisma também fica no "public". Ela só existe no banco real
-- (não no shadow database usado pelo "migrate dev"), por isso a verificação.
DO $$
BEGIN
  IF to_regclass('public._prisma_migrations') IS NOT NULL THEN
    ALTER TABLE "_prisma_migrations" ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;
