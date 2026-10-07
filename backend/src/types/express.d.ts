import { UsuarioAutenticado } from "./auth";

declare global {
  namespace Express {
    interface Request {
      // Usuário autenticado — preenchido pelo middleware de autenticação
      user?: UsuarioAutenticado;
      // Dados já validados pelo Zod — preenchidos pelo middleware validar
      validated: { body?: any; params?: any; query?: any };
    }
  }
}
