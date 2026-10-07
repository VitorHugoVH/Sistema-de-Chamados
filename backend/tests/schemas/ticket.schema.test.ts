import { idParamsSchema } from "../../src/schemas/common";
import { atualizarTicketSchema, criarTicketSchema } from "../../src/schemas/ticket.schema";

const ticketValido = { title: "Impressora", description: "Não liga desde ontem", categoryId: 1 };

describe("criarTicketSchema", () => {
  it("aceita um chamado válido e descarta o userId enviado no corpo", () => {
    const resultado = criarTicketSchema.safeParse({ body: { ...ticketValido, userId: 999 } });

    expect(resultado.success).toBe(true);
    expect(resultado.data?.body).toEqual(ticketValido);
  });

  it("rejeita prioridade fora do enum", () => {
    const resultado = criarTicketSchema.safeParse({ body: { ...ticketValido, priority: "URGENTE" } });
    expect(resultado.success).toBe(false);
  });

  it("rejeita categoryId que não é inteiro positivo", () => {
    expect(criarTicketSchema.safeParse({ body: { ...ticketValido, categoryId: 0 } }).success).toBe(false);
    expect(criarTicketSchema.safeParse({ body: { ...ticketValido, categoryId: "1" } }).success).toBe(false);
  });
});

describe("atualizarTicketSchema", () => {
  it("aceita atualização parcial e converte o id da URL para número", () => {
    const resultado = atualizarTicketSchema.safeParse({ params: { id: "2" }, body: { status: "CLOSED" } });

    expect(resultado.success).toBe(true);
    expect(resultado.data?.params.id).toBe(2);
  });

  it("rejeita corpo vazio e status inválido", () => {
    expect(atualizarTicketSchema.safeParse({ params: { id: "1" }, body: {} }).success).toBe(false);
    expect(atualizarTicketSchema.safeParse({ params: { id: "1" }, body: { status: "FEITO" } }).success).toBe(false);
  });
});

describe("idParamsSchema", () => {
  it("rejeita id não numérico", () => {
    expect(idParamsSchema.safeParse({ params: { id: "abc" } }).success).toBe(false);
  });
});
