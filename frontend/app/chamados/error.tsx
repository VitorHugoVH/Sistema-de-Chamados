"use client";

// error boundary do segmento /chamados (precisa ser client component)
export default function Erro({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="cartao space-y-4 p-8 text-center">
      <h2 className="text-xl font-semibold">Não foi possível carregar os chamados</h2>
      <p className="text-sm text-slate-600">{error.message}</p>
      <button type="button" onClick={reset} className="botao">
        Tentar novamente
      </button>
    </div>
  );
}
