// Erro "esperado" da aplicação: carrega a mensagem e o status HTTP.
// Os services lançam AppError e o errorHandler transforma em resposta.
export class AppError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Recurso não encontrado") {
    super(message, 404);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Não autenticado") {
    super(message, 401);
  }
}

export class ConflictError extends AppError {
  constructor(message = "Conflito com um recurso existente") {
    super(message, 409);
  }
}
