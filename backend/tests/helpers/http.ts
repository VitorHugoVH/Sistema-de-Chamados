import { Response } from "express";

// Cria um "res" falso para testar middlewares sem subir o servidor
export function criarRes() {
  const res = {
    statusCode: 0,
    payload: undefined as unknown,
    status(codigo: number) {
      this.statusCode = codigo;
      return this;
    },
    json(corpo: unknown) {
      this.payload = corpo;
      return this;
    },
  };
  return res as typeof res & Response;
}
