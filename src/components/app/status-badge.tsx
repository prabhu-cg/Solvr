import { AlertTriangle, Circle, CircleCheck, CircleDashed, Loader } from 'lucide-react'
import type { StageStatus } from '@/data/models'
import { STAGE_STATUS_LABELS } from '@/data/models'
import { cn } from '@/lib/utils'

const STATUS_STYLES: Record<StageStatus, { icon: typeof Circle; className: string }> = {
  not_started: { icon: CircleDashed, className: 'border-border bg-muted text-muted-foreground' },
  in_progress: { icon: Loader, className: 'border-transparent bg-info-soft text-info' },
  needs_attention: { icon: AlertTriangle, className: 'border-transparent bg-warning-soft text-warning' },
  ready: { icon: Circle, className: 'border-transparent bg-accent text-accent-foreground' },
  completed: { icon: CircleCheck, className: 'border-transparent bg-success-soft text-success' },
}

interface StatusBadgeProps {
  status: StageStatus
  className?: string
  iconOnly?: boolean
}

/**
 * Status is always conveyed with an icon + text label together, never color
 * alone, so it reads correctly for colorblind users and in high-contrast
 * mode (WCAG 2.2 — use of color).
 */
export function StatusBadge({ status, className, iconOnly = false }: StatusBadgeProps) {
  const { icon: Icon, className: styles } = STATUS_STYLES[status]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap',
        styles,
        className,
      )}
    >
      <Icon className={cn('size-3', status === 'in_progress' && 'animate-spin')} aria-hidden />
      {!iconOnly && STAGE_STATUS_LABELS[status]}
      {iconOnly && <span className="sr-only">{STAGE_STATUS_LABELS[status]}</span>}
    </span>
  )
}
