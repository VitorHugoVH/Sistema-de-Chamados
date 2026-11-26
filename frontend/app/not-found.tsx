import Link from "next/link";

export default function NaoEncontrado() {
  return (
    <div className="cartao mx-auto max-w-md space-y-4 p-8 text-center">
      <p className="text-5xl font-bold text-indigo-600">404</p>
      <h1 className="text-xl font-semibold">Página não encontrada</h1>
      <p className="text-sm text-slate-600">O que você procura não existe ou você não tem acesso.</p>
      <Link href="/" className="botao">
        Voltar ao início
      </Link>
    </div>
  );
}
