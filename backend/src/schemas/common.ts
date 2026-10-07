import { z, ZodError } from "zod";

// :id das rotas — chega como texto na URL e é convertido para número
export const idPositivo = z.coerce
  .number({ error: "deve ser um número inteiro positivo" })
  .int({ error: "deve ser um número inteiro positivo" })
  .positive({ error: "deve ser um número inteiro positivo" });

export const idParamsSchema = z.object({
  params: z.object({ id: idPositivo }),
});

// Remove os prefixos "body", "params" e "query" do caminho do campo
function caminhoAmigavel(path: PropertyKey[]): string {
  return path
    .filter((parte) => parte !== "body" && parte !== "params" && parte !== "query")
    .map(String)
    .join(".");
}

// Transforma os erros do Zod em mensagens no formato "campo: mensagem"
export function formatarErrosZod(error: ZodError): string[] {
  return error.issues.map((issue) => {
    const campo = caminhoAmigavel(issue.path);
    return campo ? `${campo}: ${issue.message}` : issue.message;
  });
}
