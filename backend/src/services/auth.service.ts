import bcrypt from "bcrypt";
import * as usersRepository from "../repositories/users.repository";
import { LoginInput, RegistrarInput } from "../schemas/auth.schema";
import { UsuarioAutenticado } from "../types/auth";
import { ErroConflito, ErroNaoAutorizado } from "../utils/erros";
import { gerarToken, verificarToken } from "../utils/jwt";

const SALT_ROUNDS = 10;

export async function registrar({ name, email, password }: RegistrarInput) {
  // Regra: não permitir email duplicado
  const usuarioExistente = await usersRepository.buscarPorEmail(email);
  if (usuarioExistente) throw new ErroConflito("Email já cadastrado");

  // A senha nunca é salva em texto puro, apenas o hash
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  return usersRepository.criar({ name, email, passwordHash });
}

export async function login({ email, password }: LoginInput) {
  const usuario = await usersRepository.buscarPorEmail(email);

  // Mesma mensagem para email ou senha errados: não revela quais emails existem
  const senhaCorreta = usuario ? await bcrypt.compare(password, usuario.passwordHash) : false;
  if (!usuario || !senhaCorreta) throw new ErroNaoAutorizado("Email ou senha inválidos");

  return {
    token: gerarToken(usuario.id),
    user: { id: usuario.id, name: usuario.name, email: usuario.email },
  };
}

// Valida o JWT e identifica o usuário dono do token
export async function validarToken(token: string): Promise<UsuarioAutenticado> {
  let userId: number;
  try {
    userId = Number(verificarToken(token).sub);
  } catch {
    throw new ErroNaoAutorizado("Token inválido ou expirado");
  }

  // O token pode ser de um usuário que não existe mais
  const usuario = await usersRepository.buscarPorId(userId);
  if (!usuario) throw new ErroNaoAutorizado("Usuário do token não encontrado");

  return { id: usuario.id, name: usuario.name, email: usuario.email };
}
