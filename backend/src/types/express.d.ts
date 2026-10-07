import { AuthUser } from "./auth";

// Adiciona a propriedade "user" ao Request do Express.
// Ela é preenchida pelo middleware de autenticação.
declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}
