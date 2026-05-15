import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/shell/AppShell'
import { RequireAuth } from './components/shell/RequireAuth'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { ProvasPage } from './pages/ProvasPage'
import { MateriaisPage } from './pages/MateriaisPage'
import { EstatisticasPage } from './pages/EstatisticasPage'
import { NovaProvaPage } from './pages/NovaProvaPage'
import { ProcessingPage } from './pages/ProcessingPage'
import { RevisarProvaPage } from './pages/RevisarProvaPage'
import { AnalyticsPage } from './pages/AnalyticsPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/provas" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/cadastro" element={<RegisterPage />} />

      <Route element={<RequireAuth />}>
        <Route element={<AppShell />}>
          <Route path="/provas" element={<ProvasPage />} />
          <Route path="/provas/nova" element={<NovaProvaPage />} />
          <Route path="/provas/nova/processando" element={<ProcessingPage />} />
          <Route path="/provas/nova/revisar" element={<RevisarProvaPage />} />
          <Route path="/provas/:id/analytics" element={<AnalyticsPage />} />
          <Route path="/materiais" element={<MateriaisPage />} />
          <Route path="/estatisticas" element={<EstatisticasPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/provas" replace />} />
    </Routes>
  )
}

export default App
