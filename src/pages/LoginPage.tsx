import { Link } from 'react-router-dom';

export function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-page p-4 font-sans">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-primary-500 to-primary-700 text-white shadow-lg shadow-primary-200">
            <span className="text-3xl font-bold">P</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-secondary-900 font-display">Bem-vindo de volta</h1>
          <p className="mt-2 text-secondary-500">Acesse sua conta para continuar seus estudos.</p>
        </div>

        <div className="card-premium p-8">
          <form className="space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-secondary-700">E-mail</label>
              <input
                type="email"
                placeholder="seu@email.com"
                className="w-full rounded-lg border border-border-soft bg-secondary-50 px-4 py-3 text-sm outline-hidden transition-all focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/10"
              />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label className="mb-1.5 block text-sm font-semibold text-secondary-700">Senha</label>
                <Link to="#" className="text-xs font-semibold text-primary-600 hover:text-primary-700">Esqueceu a senha?</Link>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full rounded-lg border border-border-soft bg-secondary-50 px-4 py-3 text-sm outline-hidden transition-all focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/10"
              />
            </div>

            <Link to="/dashboard" className="btn-primary w-full py-3.5 text-base">
              Entrar
            </Link>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border-soft"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-3 text-secondary-400">Ou continue com</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button type="button" className="btn-secondary py-3">
                <img src="https://www.google.com/favicon.ico" alt="Google" className="h-4 w-4" />
                Google
              </button>
              <button type="button" className="btn-secondary py-3">
                <span className="text-xl"></span>
                Apple
              </button>
            </div>
          </form>
        </div>

        <p className="mt-8 text-center text-sm text-secondary-500">
          Não tem uma conta?{' '}
          <Link to="/cadastro" className="font-bold text-primary-600 hover:text-primary-700">
            Cadastre-se grátis
          </Link>
        </p>
      </div>
    </div>
  );
}
