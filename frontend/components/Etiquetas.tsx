import { PRIORIDADES, PrioridadeChamado, STATUS, StatusChamado } from "@/lib/definitions";

const coresStatus: Record<StatusChamado, string> = {
  OPEN: "bg-sky-100 text-sky-800",
  IN_PROGRESS: "bg-amber-100 text-amber-800",
  RESOLVED: "bg-emerald-100 text-emerald-800",
  CLOSED: "bg-slate-200 text-slate-700",
};

const coresPrioridade: Record<PrioridadeChamado, string> = {
  LOW: "text-slate-600",
  MEDIUM: "text-amber-700",
  HIGH: "text-red-700",
};

export function EtiquetaStatus({ status }: { status: StatusChamado }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${coresStatus[status]}`}>
      {STATUS[status]}
    </span>
  );
}

export function EtiquetaPrioridade({ prioridade }: { prioridade: PrioridadeChamado }) {
  return (
    <span className={`text-xs font-semibold ${coresPrioridade[prioridade]}`}>
      Prioridade {PRIORIDADES[prioridade].toLowerCase()}
    </span>
  );
}
