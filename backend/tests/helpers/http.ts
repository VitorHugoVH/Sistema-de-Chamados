import { Response } from "express";

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
