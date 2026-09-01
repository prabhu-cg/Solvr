import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { StatusBadge } from '@/components/app/status-badge'
import { Progress } from '@/components/ui/progress'
import type { StageStatus } from '@/data/models'

interface StageHeaderProps {
  title: string
  description: string
  status: StageStatus
  readiness?: number
  icon?: LucideIcon
  children?: ReactNode
}

export function StageHeader({ title, description, status, readiness, icon: Icon, children }: StageHeaderProps) {
  return (
    <div className="border-b border-border bg-secondary/50 px-6 py-6 sm:px-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3.5">
          {Icon && (
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
              <Icon className="size-5.5" aria-hidden />
            </span>
          )}
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground">{title}</h1>
            <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">{description}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {typeof readiness === 'number' && (
            <div className="flex items-center gap-2">
              <Progress value={readiness} className="w-20" aria-label="Stage completeness" />
              <span className="text-xs font-semibold tabular-nums text-muted-foreground">{readiness}%</span>
            </div>
          )}
          <StatusBadge status={status} />
        </div>
      </div>
      {children}
    </div>
  )
}
