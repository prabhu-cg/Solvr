import { LogoMark } from '@/components/brand/logo-mark'
import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  withTagline?: boolean
  size?: 'sm' | 'md'
}

/** Icon mark + typographic wordmark — no "AI" in the name, per brand guidance. */
export function Logo({ className, withTagline = false, size = 'md' }: LogoProps) {
  return (
    <div className={cn('flex items-center', size === 'md' ? 'gap-2' : 'gap-1.5', className)}>
      <LogoMark className={cn('shrink-0 text-primary', size === 'md' ? 'size-6' : 'size-5')} />
      <div className="flex flex-col">
        <span
          className={cn(
            'font-extrabold tracking-tight text-foreground',
            size === 'md' ? 'text-xl' : 'text-lg',
          )}
        >
          Solvr
        </span>
        {withTagline && (
          <span className="text-xs text-muted-foreground">Think through. Design better.</span>
        )}
      </div>
    </div>
  )
}
