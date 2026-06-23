import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/shell/AppShell'
import { RequireAuth } from './components/shell/RequireAuth'
import { RequireRole } from './components/shell/RequireRole'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { ProvasPage } from './pages/ProvasPage'
import { MateriaisPage } from './pages/MateriaisPage'
import { EstatisticasPage } from './pages/EstatisticasPage'
import { NovaProvaPage } from './pages/NovaProvaPage'
import { ProcessingPage } from './pages/ProcessingPage'
import { RevisarProvaPage } from './pages/RevisarProvaPage'
import { CorrigirProvaPage } from './pages/CorrigirProvaPage'
import { AnalyticsPage } from './pages/AnalyticsPage'
import { PerfilPage } from './pages/PerfilPage'
import { UsuariosPage } from './pages/admin/UsuariosPage'
import { UsuarioEditarPage } from './pages/admin/UsuarioEditarPage'
import { ImportarQuestoesPage } from './pages/admin/ImportarQuestoesPage'
import { BancoQuestoesPage } from './pages/BancoQuestoesPage'

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
          <Route path="/provas/:examId/corrigir" element={<CorrigirProvaPage />} />
          <Route path="/materiais" element={<MateriaisPage />} />
          <Route path="/estatisticas" element={<EstatisticasPage />} />
          <Route path="/perfil" element={<PerfilPage />} />
          <Route path="/banco-questoes" element={<BancoQuestoesPage />} />

          <Route element={<RequireRole role="admin" />}>
            <Route path="/admin/usuarios" element={<UsuariosPage />} />
            <Route path="/admin/usuarios/:id" element={<UsuarioEditarPage />} />
            <Route path="/admin/importar" element={<ImportarQuestoesPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/provas" replace />} />
    </Routes>
  )
}

export default App
