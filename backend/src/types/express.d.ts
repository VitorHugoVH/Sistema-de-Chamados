import { UsuarioAutenticado } from "./auth";

declare global {
  namespace Express {
    interface Request {
      user?: UsuarioAutenticado;
      validated: { body?: any; params?: any; query?: any };
    }
  }
}
