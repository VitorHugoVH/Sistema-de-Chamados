// route group (auth): layout compartilhado por login e cadastro, sem mudar a url
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto w-full max-w-md py-6">{children}</div>;
}
