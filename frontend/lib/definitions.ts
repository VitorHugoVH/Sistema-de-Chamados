// tipos espelhando as respostas da API

export type StatusChamado = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
export type PrioridadeChamado = "LOW" | "MEDIUM" | "HIGH";

export interface Usuario {
  id: number;
  name: string;
  email: string;
}

export interface Categoria {
  id: number;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Chamado {
  id: number;
  title: string;
  description: string;
  status: StatusChamado;
  priority: PrioridadeChamado;
  userId: number;
  categoryId: number;
  createdAt: string;
  updatedAt: string;
  user: Usuario;
  category: Pick<Categoria, "id" | "name">;
}

export interface RespostaLogin {
  token: string;
  user: Usuario;
}

// estado devolvido pelas server actions para os formulários
export interface EstadoFormulario {
  erro?: string;
  detalhes?: string[];
  sucesso?: string;
  valores?: Record<string, string>;
}

export const STATUS: Record<StatusChamado, string> = {
  OPEN: "Aberto",
  IN_PROGRESS: "Em andamento",
  RESOLVED: "Resolvido",
  CLOSED: "Fechado",
};

export const PRIORIDADES: Record<PrioridadeChamado, string> = {
  LOW: "Baixa",
  MEDIUM: "Média",
  HIGH: "Alta",
};
