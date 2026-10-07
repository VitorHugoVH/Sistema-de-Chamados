import jwt from "jsonwebtoken";
import { env } from "../config/env";

interface TokenPayload {
  sub: string; // id do usuário
}

export function generateToken(userId: number): string {
  return jwt.sign({ sub: String(userId) }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });
}

// Lança erro se o token for inválido, adulterado ou expirado
export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, env.JWT_SECRET) as TokenPayload;
}
