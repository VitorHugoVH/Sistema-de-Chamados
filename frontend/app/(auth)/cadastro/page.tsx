import type { Metadata } from "next";
import Link from "next/link";
import FormCadastro from "@/components/FormCadastro";

export const metadata: Metadata = {
  title: "Criar conta",
  description: "Crie sua conta para abrir chamados de suporte.",
};

export default function CadastroPage() {
  return (
    <div className="cartao space-y-6 p-8">
      <div>
        <h1 className="text-2xl font-bold">Criar conta</h1>
        <p className="mt-1 text-sm text-slate-600">Leva menos de um minuto.</p>
      </div>

      <FormCadastro />

      <p className="text-center text-sm text-slate-600">
        Já tem conta?{" "}
        <Link href="/login" className="font-semibold text-indigo-600 hover:underline">
          Entrar
        </Link>
      </p>
    </div>
  );
}
