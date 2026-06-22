import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: '📊' },
    { name: 'Minhas Provas', path: '/provas', icon: '📝' },
    { name: 'Simulados', path: '/simulados', icon: '🎯' },
    { name: 'Desempenho', path: '/desempenho', icon: '📈' },
    { name: 'Configurações', path: '/configuracoes', icon: '⚙️' },
  ];

  return (
    <div className="flex min-h-screen bg-page">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 border-r border-border-soft bg-white">
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center px-6">
            <span className="text-2xl font-bold tracking-tight text-primary-600 font-display">Probator<span className="text-secondary-900">AI</span></span>
          </div>

          <nav className="flex-1 space-y-1 px-3 py-4">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-border-soft p-4">
            <div className="flex items-center gap-3 rounded-xl bg-secondary-50 p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-700 font-bold">
                FL
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-semibold text-secondary-900">Fulano Lima</p>
                <p className="truncate text-xs text-secondary-500">Premium Plan</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col pl-64">
        {/* Top Header */}
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-border-soft bg-white/80 px-8 backdrop-blur-md">
          <div className="flex w-96 items-center gap-2 rounded-full bg-secondary-50 px-4 py-2 border border-border-soft">
            <span className="text-secondary-400">🔍</span>
            <input
              type="text"
              placeholder="Buscar provas, matérias ou simulados..."
              className="w-full bg-transparent text-sm text-secondary-900 outline-hidden placeholder:text-secondary-400"
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-secondary-50">
              <span className="text-xl">🔔</span>
              <span className="absolute top-2 right-2 flex h-2 w-2 rounded-full bg-danger"></span>
            </button>
            <button className="btn-primary">Criar Nova Prova</button>
          </div>
        </header>

        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
