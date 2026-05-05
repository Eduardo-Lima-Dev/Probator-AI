import type { HTMLAttributes } from 'react'

type CardProps = HTMLAttributes<HTMLDivElement>

export function Card({ className = '', ...props }: CardProps) {
  return <section className={`rounded-xl bg-surface p-6 shadow-sm ${className}`} {...props} />
}
