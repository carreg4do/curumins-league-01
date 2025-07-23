import { type ReactNode } from 'react'
import { clsx } from 'clsx'

interface CardProps {
  children: ReactNode
  className?: string
  padding?: 'sm' | 'md' | 'lg'
  hover?: boolean
}

export function Card({ 
  children, 
  className, 
  padding = 'md',
  hover = false 
}: CardProps) {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  }
  
  return (
    <div 
      className={clsx(
        'bg-surface-light rounded-xl shadow-medium border border-border',
        paddingClasses[padding],
        hover && 'hover:shadow-high hover:border-primary/30 transition-all duration-300',
        className
      )}
    >
      {children}
    </div>
  )
}