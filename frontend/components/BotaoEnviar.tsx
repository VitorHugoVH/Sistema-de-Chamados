"use client";

import { useFormStatus } from "react-dom";

// mostra "carregando" enquanto a server action roda
export default function BotaoEnviar({ children, textoEnviando }: { children: React.ReactNode; textoEnviando: string }) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" className="botao" disabled={pending}>
      {pending ? textoEnviando : children}
    </button>
  );
}
