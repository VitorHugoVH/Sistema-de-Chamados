// mostrado automaticamente enquanto o server component busca os dados
export default function Carregando() {
  return (
    <div className="animate-pulse space-y-4" aria-label="Carregando">
      <div className="h-8 w-48 rounded bg-slate-200" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-20 rounded-xl bg-slate-200" />
        ))}
      </div>
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-24 rounded-xl bg-slate-200" />
      ))}
    </div>
  );
}
