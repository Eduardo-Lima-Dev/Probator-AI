import { Layout } from '../components/Layout';
import { recentExams } from '../constants/dashboard';

export function DashboardPage() {
  return (
    <Layout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Olá, Fulano! 👋</h1>
          <p className="mt-1 text-secondary-500">Seu progresso está excelente. Continue assim!</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="card-premium relative overflow-hidden">
            <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-primary-50 opacity-50"></div>
            <p className="text-sm font-medium text-secondary-500 uppercase tracking-wider">Provas Concluídas</p>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-4xl font-bold text-secondary-900">12</span>
              <span className="text-sm font-medium text-success">+2 esta semana</span>
            </div>
          </div>

          <div className="card-premium">
            <p className="text-sm font-medium text-secondary-500 uppercase tracking-wider">Tempo de Estudo</p>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-4xl font-bold text-secondary-900">24h</span>
              <span className="text-sm font-medium text-secondary-400">Total</span>
            </div>
          </div>

          <div className="card-premium">
            <p className="text-sm font-medium text-secondary-500 uppercase tracking-wider">Média de Acertos</p>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-4xl font-bold text-secondary-900">85%</span>
              <span className="text-sm font-medium text-success">↑ 5%</span>
            </div>
          </div>

          <div className="card-premium">
            <p className="text-sm font-medium text-secondary-500 uppercase tracking-wider">Simulados Pendentes</p>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-4xl font-bold text-secondary-900">4</span>
              <span className="text-sm font-medium text-warning">Aguardando</span>
            </div>
          </div>
        </div>

        {/* Recent Activity & Quick Action */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main List */}
          <div className="lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-secondary-900">Provas Recentes</h2>
              <button className="text-sm font-semibold text-primary-600 hover:text-primary-700">Ver todas</button>
            </div>
            
            <div className="space-y-4">
              {recentExams.map((exam) => (
                <div key={exam.id} className="card-premium flex items-center justify-between py-4 hover:translate-x-1">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-2xl">
                      {exam.id % 2 === 0 ? '📝' : '⚡'}
                    </div>
                    <div>
                      <h3 className="font-bold text-secondary-900">{exam.title}</h3>
                      <div className="mt-1 flex items-center gap-3 text-sm text-secondary-500">
                        <span>📅 {exam.date}</span>
                        <span>•</span>
                        <span>🧩 {exam.questions} questões</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                      exam.status === 'completed' 
                        ? 'bg-success/10 text-success' 
                        : 'bg-primary-50 text-primary-600'
                    }`}>
                      {exam.status === 'completed' ? 'Finalizada' : 'Em curso'}
                    </div>
                    <button className="h-8 w-8 rounded-full hover:bg-secondary-50 flex items-center justify-center transition-colors">
                      <span className="text-secondary-400 font-bold">⋮</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-6">
            <div className="card-premium bg-linear-to-br from-primary-600 to-primary-800 text-white border-none shadow-lg shadow-primary-200">
              <h3 className="text-xl font-bold">Probator Plus</h3>
              <p className="mt-2 text-primary-100 text-sm">Desbloqueie simulados ilimitados e análise detalhada de desempenho.</p>
              <button className="mt-6 w-full rounded-lg bg-white py-3 text-sm font-bold text-primary-700 transition-transform hover:scale-[1.02] active:scale-95">
                Fazer Upgrade
              </button>
            </div>

            <div className="card-premium">
              <h3 className="font-bold text-secondary-900">Sugestões de Estudo</h3>
              <div className="mt-4 space-y-3">
                {['Direito Constitucional', 'Raciocínio Lógico', 'Língua Portuguesa'].map((subject) => (
                  <div key={subject} className="flex items-center justify-between rounded-lg bg-secondary-50 p-3 transition-colors hover:bg-secondary-100">
                    <span className="text-sm font-medium text-secondary-700">{subject}</span>
                    <button className="text-primary-600 text-lg">⊕</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
