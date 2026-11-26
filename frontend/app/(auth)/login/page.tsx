import type { Metadata } from "next";
import Link from "next/link";
import FormLogin from "@/components/FormLogin";

export const metadata: Metadata = {
  title: "Entrar",
  description: "Acesse sua conta para gerenciar seus chamados.",
};

interface Props {
  searchParams: Promise<{ redirect?: string; expirado?: string }>;
}

export default async function LoginPage({ searchParams }: Props) {
  const { redirect, expirado } = await searchParams;

  return (
    <div className="cartao space-y-6 p-8">
      <div>
        <h1 className="text-2xl font-bold">Entrar</h1>
        <p className="mt-1 text-sm text-slate-600">Acesse sua conta para ver seus chamados.</p>
      </div>

      {expirado && (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Sua sessão expirou. Entre novamente.
        </p>
      )}

      <FormLogin redirect={redirect} />

      <p className="text-center text-sm text-slate-600">
        Não tem conta?{" "}
        <Link href="/cadastro" className="font-semibold text-indigo-600 hover:underline">
          Cadastre-se
        </Link>
      </p>
    </div>
  );
}
