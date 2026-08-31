import type { ReactNode } from 'react'
import { StatusBadge } from '@/components/app/status-badge'
import type { StageStatus } from '@/data/models'

interface StageHeaderProps {
  title: string
  description: string
  status: StageStatus
  readiness?: number
  children?: ReactNode
}

export function StageHeader({ title, description, status, readiness, children }: StageHeaderProps) {
  return (
    <div className="border-b border-border px-6 py-6 sm:px-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">{title}</h1>
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">{description}</p>
        </div>
        <div className="flex items-center gap-3">
          {typeof readiness === 'number' && (
            <span className="text-xs font-semibold tabular-nums text-muted-foreground">
              {readiness}% complete
            </span>
          )}
          <StatusBadge status={status} />
        </div>
      </div>
      {children}
    </div>
  )
}
