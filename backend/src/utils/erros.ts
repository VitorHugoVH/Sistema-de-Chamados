export class AppError extends Error {
  public readonly status: number;

  constructor(mensagem: string, status: number) {
    super(mensagem);
    this.name = new.target.name;
    this.status = status;
  }
}

export class ErroValidacao extends AppError {
  public readonly detalhes: string[];

  constructor(detalhes: string[]) {
    super("Dados inválidos", 400);
    this.detalhes = detalhes;
  }
}

export class ErroNaoAutorizado extends AppError {
  constructor(mensagem = "Não autenticado") {
    super(mensagem, 401);
  }
}

export class ErroNaoEncontrado extends AppError {
  constructor(mensagem = "Recurso não encontrado") {
    super(mensagem, 404);
  }
}

export class ErroConflito extends AppError {
  constructor(mensagem = "Conflito com um registro existente") {
    super(mensagem, 409);
  }
}
