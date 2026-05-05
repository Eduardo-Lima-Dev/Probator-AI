import type { InputHTMLAttributes, ReactNode } from 'react'

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  rightElement?: ReactNode
}

export function TextField({ id, label, className = '', rightElement, ...props }: TextFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-semibold tracking-wide text-secondary-800">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          className={`h-14 w-full rounded-sm border border-border-gold bg-surface-soft px-4 text-base text-secondary-800 placeholder:text-neutral-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-300 ${rightElement ? 'pr-12' : ''} ${className}`}
          {...props}
        />
        {rightElement && (
          <div className="absolute inset-y-0 right-3 z-10 flex items-center">{rightElement}</div>
        )}
      </div>
    </div>
  )
}
