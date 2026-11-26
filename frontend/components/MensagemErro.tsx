import { EstadoFormulario } from "@/lib/definitions";

// exibe o erro e os detalhes de validação vindos da api
export default function MensagemErro({ estado }: { estado: EstadoFormulario }) {
  if (!estado.erro) return null;

  return (
    <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      <p className="font-semibold">{estado.erro}</p>
      {estado.detalhes && estado.detalhes.length > 0 && (
        <ul className="mt-1 list-inside list-disc">
          {estado.detalhes.map((detalhe) => (
            <li key={detalhe}>{detalhe}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
