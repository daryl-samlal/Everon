import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'outline' | 'ghost' }

export function Button({ className, variant = 'primary', ...props }: ButtonProps) {
  return <button className={cn('inline-flex min-h-12 items-center justify-center rounded-2xl px-5 text-sm font-bold transition active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-50', {
    'bg-coral text-white shadow-[0_8px_18px_rgba(242,107,94,.22)] hover:bg-[#dd5c50]': variant === 'primary',
    'border-2 border-ink/10 bg-white text-ink hover:border-ink/30': variant === 'outline',
    'text-ink/60 hover:bg-ink/5 hover:text-ink': variant === 'ghost',
  }, className)} {...props} />
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('rounded-[1.75rem] border border-ink/5 bg-white shadow-[0_12px_36px_rgba(16,42,67,.06)]', className)}>{children}</div>
}

export function Progress({ value }: { value: number }) {
  return <div className="h-2 overflow-hidden rounded-full bg-ink/10"><div className="h-full rounded-full bg-coral transition-all duration-500" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} /></div>
}
