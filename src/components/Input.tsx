import { type InputHTMLAttributes, forwardRef } from 'react'
import { clsx } from 'clsx'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>((
  { label, error, helperText, className, ...props },
  ref
) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-text-primary mb-2">
          {label}
        </label>
      )}
      
      <input
        ref={ref}
        className={clsx(
          'w-full px-4 py-3 bg-surface border border-border-light rounded-lg',
          'text-text-primary placeholder-text-secondary',
          'focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary',
          'transition-all duration-200',
          error && 'border-accent focus:ring-accent focus:border-accent',
          className
        )}
        {...props}
      />
      
      {error && (
        <p className="mt-1 text-sm text-accent">{error}</p>
      )}
      
      {helperText && !error && (
        <p className="mt-1 text-sm text-text-secondary">{helperText}</p>
      )}
    </div>
  )
})