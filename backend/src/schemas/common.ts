import { z, ZodError } from "zod";

export const idPositivo = z.coerce
  .number({ error: "deve ser um número inteiro positivo" })
  .int({ error: "deve ser um número inteiro positivo" })
  .positive({ error: "deve ser um número inteiro positivo" });

export const idParamsSchema = z.object({
  params: z.object({ id: idPositivo }),
});

function caminhoAmigavel(path: PropertyKey[]): string {
  return path
    .filter((parte) => parte !== "body" && parte !== "params" && parte !== "query")
    .map(String)
    .join(".");
}

// formata como "campo: mensagem"
export function formatarErrosZod(error: ZodError): string[] {
  return error.issues.map((issue) => {
    const campo = caminhoAmigavel(issue.path);
    return campo ? `${campo}: ${issue.message}` : issue.message;
  });
}
