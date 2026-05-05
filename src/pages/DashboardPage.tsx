import { Card } from '../components/ui/Card'
import { recentExams } from '../constants/dashboard'

export function DashboardPage() {
  return (
    <main className="min-h-screen bg-page pb-28 pt-6 font-sans text-secondary-800">
      <div className="mx-auto w-full max-w-md px-4">
        <header className="mb-6">
          <h1 className="text-[32px] leading-tight font-semibold text-secondary-800">Ola, Fulano</h1>
          <p className="mt-2 text-base text-neutral-600">Aqui esta um resumo das suas provas recentes.</p>
        </header>

        <section className="mb-8 grid grid-cols-2 gap-4">
          <Card className="border border-border-soft p-6">
            <div className="mb-5 inline-flex h-11 w-11 items-center justify-center text-secondary-500">
              <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
                <path
                  d="M6.5 12.5l3.2 3.2 7.8-7.8"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <p className="text-5xl leading-none font-semibold text-secondary-800">12</p>
            <p className="mt-2 text-sm font-semibold tracking-wide text-secondary-300 uppercase">
              Concluidas
            </p>
          </Card>

          <Card className="border border-border-soft p-6">
            <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-md bg-primary-50 text-primary-700">
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
                <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.8" />
                <path
                  d="M12 8v4l2.8 2.8"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <p className="text-5xl leading-none font-semibold text-secondary-800">4</p>
            <p className="mt-2 text-sm font-semibold tracking-wide text-secondary-300 uppercase">
              Pendentes
            </p>
          </Card>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Provas Recentes</h2>
            <button type="button" className="text-base font-semibold text-secondary-300 hover:text-secondary-500">
              Ver todas →
            </button>
          </div>

          <div className="space-y-4">
            {recentExams.map((exam) => (
              <Card key={exam.id} className="border border-border-soft p-4">
                <div className="flex items-center gap-3">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-sm bg-neutral-100 text-secondary-400">
                    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
                      <path
                        d="M8 3.5h6l4 4V20a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 20V5A1.5 1.5 0 0 1 7.5 3.5z"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M14 3.5V8h4"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M9.5 12h5M9.5 15h5"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-base leading-tight font-semibold text-secondary-800">
                      {exam.title}
                    </p>
                    <div className="mt-1 flex items-center gap-2 text-sm text-secondary-300">
                      <span className="inline-flex items-center gap-1">
                        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
                          <rect
                            x="4"
                            y="5.5"
                            width="16"
                            height="14"
                            rx="2"
                            stroke="currentColor"
                            strokeWidth="1.7"
                          />
                          <path
                            d="M8 3.5v4M16 3.5v4M4 9.5h16"
                            stroke="currentColor"
                            strokeWidth="1.7"
                            strokeLinecap="round"
                          />
                        </svg>
                        {exam.date}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="inline-flex items-center gap-1">
                        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
                          <path
                            d="M8 6.5h11M8 12h11M8 17.5h11"
                            stroke="currentColor"
                            strokeWidth="1.7"
                            strokeLinecap="round"
                          />
                          <circle cx="5" cy="6.5" r="1.1" fill="currentColor" />
                          <circle cx="5" cy="12" r="1.1" fill="currentColor" />
                          <circle cx="5" cy="17.5" r="1.1" fill="currentColor" />
                        </svg>
                        {exam.questions} questoes
                      </span>
                    </div>
                  </div>
                  <span
                    className={`inline-flex h-8 w-8 items-center justify-center rounded-full ${
                      exam.status === 'completed'
                        ? 'bg-secondary-50 text-success'
                        : 'bg-primary-50 text-primary-700'
                    }`}
                  >
                    {exam.status === 'completed' ? (
                      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
                        <path
                          d="M6.5 12.5l3.2 3.2 7.8-7.8"
                          stroke="currentColor"
                          strokeWidth="2.1"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
                        <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.8" />
                        <path
                          d="M12 8v4l2.8 2.8"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>

      <nav className="fixed inset-x-0 bottom-4 mx-auto w-full max-w-md px-4">
        <div className="flex items-center justify-center gap-8 rounded-full bg-surface-soft px-6 py-3 shadow-sm">
          <button
            type="button"
            className="inline-flex min-h-11 min-w-[68px] flex-col items-center justify-center gap-1 rounded-md text-[11px] font-semibold tracking-wide text-primary-800 uppercase"
          >
            <span aria-hidden="true" className="text-base leading-none">
              ☰
            </span>
            PROVAS
          </button>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary-700 text-xl text-white shadow-sm"
            aria-label="Criar prova"
          >
            +
          </button>

          <button
            type="button"
            className="inline-flex min-h-11 min-w-[68px] flex-col items-center justify-center gap-1 rounded-md text-[11px] font-semibold tracking-wide text-neutral-700 uppercase"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
              <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.8" />
              <path
                d="M5.5 19c1.4-2.6 3.6-3.9 6.5-3.9s5.1 1.3 6.5 3.9"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
            PERFIL
          </button>
        </div>
      </nav>
    </main>
  )
}
