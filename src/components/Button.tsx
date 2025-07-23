import { type ButtonHTMLAttributes, type ReactNode } from 'react'
import { clsx } from 'clsx'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'danger' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  fullWidth?: boolean
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses = 'font-bold transition-all duration-300 ease-in-out rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variantClasses = {
    primary: 'bg-primary text-black hover:bg-[#00B4E6] hover:scale-105',
    secondary: 'bg-transparent border border-primary text-primary hover:bg-primary/10 hover:scale-105',
    danger: 'bg-accent text-white hover:bg-accent/80 hover:scale-105',
    outline: 'bg-transparent border border-primary text-primary hover:bg-primary/10 hover:scale-105'
  }
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  }
  
  const widthClasses = fullWidth ? 'w-full' : ''
  
  return (
    <button
      className={clsx(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        widthClasses,
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
          Carregando...
        </div>
      ) : (
        children
      )}
    </button>
  )
}