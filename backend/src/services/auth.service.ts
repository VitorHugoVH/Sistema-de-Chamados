import bcrypt from "bcrypt";
import { prisma } from "../config/db";
import { generateToken } from "../utils/jwt";
import { ConflictError, UnauthorizedError } from "../utils/AppError";
import { LoginInput, RegisterInput } from "../validators/auth.validator";
import { publicUserSelect } from "./user.service";

const SALT_ROUNDS = 10;

export async function register({ name, email, password }: RegisterInput) {
  // Regra: não permitir email duplicado
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new ConflictError("Email já cadastrado");
  }

  // A senha nunca é salva em texto puro, apenas o hash
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  return prisma.user.create({
    data: { name, email, passwordHash },
    select: publicUserSelect,
  });
}

export async function login({ email, password }: LoginInput) {
  const user = await prisma.user.findUnique({ where: { email } });

  // Mesma mensagem para email ou senha errados: não revela quais emails existem
  const passwordMatches = user ? await bcrypt.compare(password, user.passwordHash) : false;
  if (!user || !passwordMatches) {
    throw new UnauthorizedError("Email ou senha inválidos");
  }

  return {
    token: generateToken(user.id),
    user: { id: user.id, name: user.name, email: user.email },
  };
}
