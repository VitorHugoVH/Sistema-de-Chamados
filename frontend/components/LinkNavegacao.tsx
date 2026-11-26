"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// client component: usePathname só existe no navegador, para destacar o link ativo
export default function LinkNavegacao({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const ativo = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={`rounded-md px-3 py-1.5 font-medium transition ${
        ativo ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-100"
      }`}
    >
      {children}
    </Link>
  );
}
