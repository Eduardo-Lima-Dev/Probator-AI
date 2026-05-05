import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { loginUser } from '../api/authApi'
import { EyeClosedIcon, EyeOpenIcon } from '../components/icons/AuthIcons'
import { ProbatorLogoIcon } from '../components/icons/ProbatorLogoIcon'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { TextField } from '../components/ui/TextField'

type LoginForm = {
  email: string
  password: string
}

const initialLoginForm: LoginForm = {
  email: '',
  password: '',
}

export function LoginPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState<LoginForm>(initialLoginForm)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage('')
    setError('')
    setIsLoading(true)

    try {
      await loginUser(form)
      setMessage('Login realizado com sucesso.')
      navigate('/dashboard')
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Nao foi possivel concluir o login.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-page px-4 py-8 font-sans text-secondary-800">
      <div className="mx-auto w-full max-w-md">
        <header className="mb-4 flex items-center gap-2 px-1 text-xl font-semibold">
          <span className="inline-flex h-11 w-11" aria-hidden="true" />
        </header>

        <Card className="border border-border-soft">
          <div className="mx-auto flex w-full justify-center pl-10" aria-label="Logo Probator-IA">
            <ProbatorLogoIcon iconOnly className="h-28 w-28" />
          </div>

          <h1 className="mt-4 text-center text-3xl leading-tight font-semibold">Entrar</h1>
          <p className="mx-auto mt-2 max-w-[320px] text-center text-sm text-neutral-700">
            Acesse sua conta para continuar criando provas com o Probator-AI.
          </p>

          <form className="mt-6 flex w-full flex-col gap-4" onSubmit={handleSubmit}>
            <TextField
              id="loginEmail"
              label="E-MAIL"
              type="email"
              placeholder="exemplo@exemplo.com"
              autoComplete="email"
              required
              value={form.email}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, email: event.target.value }))
              }
            />

            <TextField
              id="loginPassword"
              label="SENHA"
              type={showPassword ? 'text' : 'password'}
              placeholder="........"
              autoComplete="current-password"
              required
              value={form.password}
              rightElement={
                <button
                  type="button"
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full text-secondary-500 hover:bg-secondary-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-300"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
                </button>
              }
              onChange={(event) =>
                setForm((prev) => ({ ...prev, password: event.target.value }))
              }
            />

            <Button type="submit" className="mt-2 h-14 w-full text-base" disabled={isLoading}>
              {isLoading ? 'Entrando...' : 'Entrar'}
              <span aria-hidden="true">→</span>
            </Button>
          </form>

          {(message || error) && (
            <p className={`mt-3 w-full text-center text-sm ${error ? 'text-danger' : 'text-success'}`}>
              {error || message}
            </p>
          )}

          <p className="mt-6 text-center text-base text-neutral-700">
            Ainda nao tem uma conta?{' '}
            <Link
              to="/cadastro"
              className="font-bold text-secondary-800 no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-300"
            >
              Cadastrar-se
            </Link>
          </p>
        </Card>
      </div>
    </main>
  )
}
