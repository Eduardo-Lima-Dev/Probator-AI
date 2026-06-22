import { Link } from 'react-router-dom';

export function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-page p-4 font-sans">
      <div className="w-full max-w-lg">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-primary-500 to-primary-700 text-white shadow-lg shadow-primary-200">
            <span className="text-3xl font-bold">P</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-secondary-900 font-display">Crie sua conta</h1>
          <p className="mt-2 text-secondary-500">Junte-se a milhares de estudantes e alcance sua aprovação.</p>
        </div>

        <div className="card-premium p-8">
          <form className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-secondary-700">Nome</label>
                <input
                  type="text"
                  placeholder="Seu nome"
                  className="w-full rounded-lg border border-border-soft bg-secondary-50 px-4 py-3 text-sm outline-hidden transition-all focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/10"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-secondary-700">Sobrenome</label>
                <input
                  type="text"
                  placeholder="Seu sobrenome"
                  className="w-full rounded-lg border border-border-soft bg-secondary-50 px-4 py-3 text-sm outline-hidden transition-all focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/10"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-secondary-700">E-mail</label>
              <input
                type="email"
                placeholder="seu@email.com"
                className="w-full rounded-lg border border-border-soft bg-secondary-50 px-4 py-3 text-sm outline-hidden transition-all focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/10"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-secondary-700">Senha</label>
              <input
                type="password"
                placeholder="Mínimo 8 caracteres"
                className="w-full rounded-lg border border-border-soft bg-secondary-50 px-4 py-3 text-sm outline-hidden transition-all focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/10"
              />
            </div>

            <div className="flex items-start gap-3 py-2">
              <input
                type="checkbox"
                id="terms"
                className="mt-1 h-4 w-4 rounded-sm border-border-soft text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="terms" className="text-xs text-secondary-500 leading-relaxed">
                Eu concordo com os <Link to="#" className="font-bold text-primary-600">Termos de Serviço</Link> e{' '}
                <Link to="#" className="font-bold text-primary-600">Política de Privacidade</Link> da ProbatorAI.
              </label>
            </div>

            <button type="submit" className="btn-primary w-full py-3.5 text-base">
              Criar Conta Grátis
            </button>
          </form>
        </div>

        <p className="mt-8 text-center text-sm text-secondary-500">
          Já tem uma conta?{' '}
          <Link to="/login" className="font-bold text-primary-600 hover:text-primary-700">
            Fazer login
          </Link>
        </p>
      </div>
    </div>
  );
}
