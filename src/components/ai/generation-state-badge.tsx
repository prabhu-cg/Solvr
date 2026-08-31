import { Circle, CircleCheck, Loader, TriangleAlert } from 'lucide-react'
import type { DeliverableStatus } from '@/data/models'
import { cn } from '@/lib/utils'

const STATE_CONFIG: Record<
  DeliverableStatus,
  { label: string; icon: typeof Circle; className: string; spin?: boolean }
> = {
  idle: { label: 'Not generated', icon: Circle, className: 'text-muted-foreground' },
  preparing: { label: 'Preparing…', icon: Loader, className: 'text-info', spin: true },
  generating: { label: 'Generating…', icon: Loader, className: 'text-info', spin: true },
  reviewing: { label: 'Ready to review', icon: Circle, className: 'text-warning' },
  complete: { label: 'Accepted', icon: CircleCheck, className: 'text-success' },
  failed: { label: 'Failed', icon: TriangleAlert, className: 'text-destructive' },
}

/** Meaningful lifecycle labels only — never a fake progress percentage (Section 10). */
export function GenerationStateBadge({ status, className }: { status: DeliverableStatus; className?: string }) {
  const config = STATE_CONFIG[status]
  const Icon = config.icon
  return (
    <span className={cn('inline-flex items-center gap-1.5 text-xs font-semibold', config.className, className)}>
      <Icon className={cn('size-3.5', config.spin && 'animate-spin')} aria-hidden />
      {config.label}
    </span>
  )
}
