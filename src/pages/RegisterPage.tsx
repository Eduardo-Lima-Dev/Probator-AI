import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { registerUser } from '../api/authApi'
import { EyeClosedIcon, EyeOpenIcon } from '../components/icons/AuthIcons'
import { ProbatorLogoIcon } from '../components/icons/ProbatorLogoIcon'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { TextField } from '../components/ui/TextField'
import { courseOptions } from '../constants/auth'

type RegisterForm = {
  fullName: string
  email: string
  course: string
  password: string
  confirmPassword: string
}

const initialForm: RegisterForm = {
  fullName: '',
  email: '',
  course: '',
  password: '',
  confirmPassword: '',
}

export function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState<RegisterForm>(initialForm)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage('')
    setError('')

    if (form.password !== form.confirmPassword) {
      setError('As senhas nao coincidem.')
      return
    }

    setIsLoading(true)

    try {
      await registerUser({
        name: form.fullName,
        email: form.email,
        course: form.course,
        password: form.password,
      })

      setMessage('Cadastro realizado com sucesso.')
      setForm(initialForm)
      navigate('/login')
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Nao foi possivel concluir o cadastro.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-page px-4 py-8 font-sans text-secondary-800">
      <div className="mx-auto w-full max-w-md">
        <header className="mb-4 flex items-center gap-2 px-1 text-xl font-semibold">
          <button
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-transparent text-xl leading-none transition hover:bg-secondary-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-300"
            type="button"
            aria-label="Voltar para login"
            onClick={() => navigate('/login')}
          >
            <span aria-hidden="true">←</span>
          </button>
          <strong>Probator-AI</strong>
        </header>

        <Card className="border border-border-soft">
          <div className="mx-auto flex w-full justify-center pl-10" aria-label="Logo Probator-IA">
            <ProbatorLogoIcon iconOnly className="h-28 w-28" />
          </div>

          <h1 className="mt-4 text-center text-3xl leading-tight font-semibold">Criar Conta</h1>
          <p className="mx-auto mt-2 max-w-[320px] text-center text-sm text-neutral-700">
            Junte-se ao Probator-AI para criar provas de forma mais inteligente.
          </p>

          <form className="mt-6 flex w-full flex-col gap-4" onSubmit={handleSubmit}>
            <TextField
              id="fullName"
              label="NOME COMPLETO"
              type="text"
              placeholder="nome"
              autoComplete="name"
              required
              value={form.fullName}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, fullName: event.target.value }))
              }
            />

            <TextField
              id="email"
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

            <div className="flex flex-col gap-2">
              <label htmlFor="course" className="text-sm font-semibold tracking-wide text-secondary-800">
                CURSO
              </label>
              <select
                id="course"
                required
                value={form.course}
                className="h-14 rounded-sm border border-border-gold bg-surface-soft px-4 text-base text-secondary-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-300"
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, course: event.target.value }))
                }
              >
                <option value="" disabled>
                  Selecione um curso
                </option>
                {courseOptions.map((course) => (
                  <option key={course} value={course}>
                    {course}
                  </option>
                ))}
              </select>
            </div>

            <TextField
              id="password"
              label="SENHA"
              type={showPassword ? 'text' : 'password'}
              placeholder="........"
              autoComplete="new-password"
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

            <TextField
              id="confirmPassword"
              label="CONFIRMAR SENHA"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="........"
              autoComplete="new-password"
              required
              value={form.confirmPassword}
              rightElement={
                <button
                  type="button"
                  aria-label={showConfirmPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full text-secondary-500 hover:bg-secondary-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-300"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                >
                  {showConfirmPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
                </button>
              }
              onChange={(event) =>
                setForm((prev) => ({ ...prev, confirmPassword: event.target.value }))
              }
            />

            <Button type="submit" className="mt-2 h-14 w-full text-base" disabled={isLoading}>
              {isLoading ? 'Cadastrando...' : 'Cadastrar-se'}
              <span aria-hidden="true">→</span>
            </Button>
          </form>

          {(message || error) && (
            <p className={`mt-3 w-full text-center text-sm ${error ? 'text-danger' : 'text-success'}`}>
              {error || message}
            </p>
          )}

          <p className="mt-6 text-center text-base text-neutral-700">
            Ja tem uma conta?{' '}
            <Link
              to="/login"
              className="font-bold text-secondary-800 no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-300"
            >
              Entrar
            </Link>
          </p>
        </Card>
      </div>
    </main>
  )
}
