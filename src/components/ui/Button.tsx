import type { ButtonHTMLAttributes } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'outlined'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
}

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-primary-700 text-white hover:bg-primary-600 active:bg-primary-800 focus-visible:outline-primary-300',
  secondary:
    'bg-surface-soft text-secondary-800 hover:bg-secondary-100 active:bg-secondary-200 focus-visible:outline-primary-300',
  outlined:
    'border border-primary-600 bg-transparent text-secondary-800 hover:bg-primary-50 active:bg-primary-100 focus-visible:outline-primary-300',
}

export function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex h-11 items-center justify-center gap-2 rounded-md px-6 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-40 ${variants[variant]} ${className}`}
      {...props}
    />
  )
}
