/** @type {import("jest").Config} */
module.exports = {
  testEnvironment: "node",
  clearMocks: true,
  // ts-jest permite escrever os testes em TypeScript
  transform: { "^.+\\.ts$": ["ts-jest", { diagnostics: false }] },
  setupFiles: ["<rootDir>/tests/jest.setup.ts"],
  testMatch: ["**/tests/**/*.test.ts"],
  collectCoverageFrom: ["src/**/*.ts", "!src/server.ts", "!src/config/db.ts", "!src/types/**"],
  coverageDirectory: "coverage",
};
