// Erros "esperados" da aplicação. Os services lançam esses erros e o
// errorHandler transforma cada um na resposta HTTP correspondente.
export class AppError extends Error {
  public readonly status: number;

  constructor(mensagem: string, status: number) {
    super(mensagem);
    this.name = new.target.name;
    this.status = status;
  }
}

// 400 — dados de entrada inválidos (lista de problemas em "detalhes")
export class ErroValidacao extends AppError {
  public readonly detalhes: string[];

  constructor(detalhes: string[]) {
    super("Dados inválidos", 400);
    this.detalhes = detalhes;
  }
}

// 401 — token ausente/inválido ou credenciais erradas
export class ErroNaoAutorizado extends AppError {
  constructor(mensagem = "Não autenticado") {
    super(mensagem, 401);
  }
}

// 404 — registro não encontrado
export class ErroNaoEncontrado extends AppError {
  constructor(mensagem = "Recurso não encontrado") {
    super(mensagem, 404);
  }
}

// 409 — conflito com um registro existente (ex.: email duplicado)
export class ErroConflito extends AppError {
  constructor(mensagem = "Conflito com um registro existente") {
    super(mensagem, 409);
  }
}
