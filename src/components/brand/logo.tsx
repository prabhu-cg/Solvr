import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  withTagline?: boolean
  size?: 'sm' | 'md'
}

/** Simple typographic wordmark — no icon, no "AI" in the name, per brand guidance. */
export function Logo({ className, withTagline = false, size = 'md' }: LogoProps) {
  return (
    <div className={cn('flex flex-col', className)}>
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
  )
}
