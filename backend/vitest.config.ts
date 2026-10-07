import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    setupFiles: ["./tests/setup.ts"],
    mockReset: true, // cada teste começa com os mocks zerados
    // Valores fictícios usados apenas nos testes (o banco é substituído por um mock)
    env: {
      NODE_ENV: "test",
      DATABASE_URL: "postgresql://test:test@localhost:5432/test",
      JWT_SECRET: "segredo-apenas-para-testes",
    },
  },
});
