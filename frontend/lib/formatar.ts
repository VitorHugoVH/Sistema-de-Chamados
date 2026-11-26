// fuso fixo para servidor e navegador gerarem o mesmo texto (evita erro de hidratação)
const formatador = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
  timeZone: "America/Sao_Paulo",
});

export function formatarData(iso: string) {
  return formatador.format(new Date(iso));
}
