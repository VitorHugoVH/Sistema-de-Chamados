import { loginSchema, registrarSchema } from "../../src/schemas/auth.schema";

describe("registrarSchema", () => {
  it("aceita dados válidos e normaliza o email", () => {
    const resultado = registrarSchema.safeParse({
      body: { name: " Maria ", email: " Maria@Teste.COM ", password: "senha123" },
    });

    expect(resultado.success).toBe(true);
    expect(resultado.data?.body).toEqual({ name: "Maria", email: "maria@teste.com", password: "senha123" });
  });

  it("rejeita nome curto, email inválido e senha curta", () => {
    const resultado = registrarSchema.safeParse({
      body: { name: "M", email: "email-invalido", password: "123" },
    });

    expect(resultado.success).toBe(false);
    expect(resultado.error?.issues.map((issue) => issue.path.join("."))).toEqual([
      "body.name",
      "body.email",
      "body.password",
    ]);
  });
});

describe("loginSchema", () => {
  it("exige email e senha", () => {
    expect(loginSchema.safeParse({ body: {} }).success).toBe(false);
    expect(loginSchema.safeParse({ body: { email: "a@b.com", password: "x" } }).success).toBe(true);
  });
});
