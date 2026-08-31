import { ArrowRight, CircleCheck, ListChecks, RotateCcw, Sparkles, TriangleAlert } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { ReadinessAssessment } from '@/data/models'
import type { ReadinessRunStatus } from '@/hooks/use-readiness'
import { cn } from '@/lib/utils'

interface ReadinessPanelProps {
  stageLabel: string
  readiness?: ReadinessAssessment
  status: ReadinessRunStatus
  error?: string
  onRun: () => void
  nextStageHref?: string
  nextStageLabel?: string
}

export function ReadinessPanel({
  stageLabel,
  readiness,
  status,
  error,
  onRun,
  nextStageHref,
  nextStageLabel,
}: ReadinessPanelProps) {
  const loading = status === 'loading'

  return (
    <Card className="border-border-strong">
      <CardHeader className="flex-row items-center justify-between gap-4 space-y-0">
        <CardTitle>{stageLabel} readiness</CardTitle>
        {readiness && (
          <span
            className={cn(
              'flex items-center gap-1.5 text-lg font-extrabold tabular-nums',
              readiness.recommendedAction === 'proceed' ? 'text-success' : 'text-warning',
            )}
          >
            {readiness.recommendedAction === 'proceed' ? (
              <CircleCheck className="size-5" aria-hidden />
            ) : (
              <TriangleAlert className="size-5" aria-hidden />
            )}
            {readiness.score}%
          </span>
        )}
      </CardHeader>

      <CardContent>
        {!readiness && !loading && (
          <div className="flex flex-col items-start gap-3 rounded-lg border border-dashed border-border-strong p-5">
            <p className="text-sm text-muted-foreground">
              Run a readiness check to see what's strong, what's missing, and whether this stage is ready to move on.
            </p>
            <Button onClick={onRun}>
              <Sparkles className="size-4" />
              Run readiness check
            </Button>
          </div>
        )}

        {loading && (
          <p className="flex items-center gap-2 rounded-lg border border-dashed border-border-strong p-5 text-sm text-muted-foreground">
            Assessing readiness…
          </p>
        )}

        {!loading && error && (
          <div className="mb-4 rounded-lg border border-destructive-soft bg-destructive-soft p-4">
            <p className="text-sm font-semibold text-destructive">{error}</p>
            <Button variant="secondary" size="sm" className="mt-3" onClick={onRun}>
              <RotateCcw className="size-3.5" />
              Retry
            </Button>
          </div>
        )}

        {!loading && readiness && (
          <div className="flex flex-col gap-5">
            <p className="text-sm leading-relaxed text-foreground">{readiness.recommendation}</p>

            <div className="grid gap-4 sm:grid-cols-3">
              <ReadinessList title="Strengths" items={readiness.strengths} icon={CircleCheck} tone="success" />
              <ReadinessList title="Gaps" items={readiness.gaps} icon={TriangleAlert} tone="warning" />
              <ReadinessList
                title="Critical assumptions"
                items={readiness.criticalAssumptions}
                icon={ListChecks}
                tone="info"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 border-t border-border pt-4">
              {nextStageHref && nextStageLabel && (
                <Button asChild>
                  <Link to={nextStageHref}>
                    Proceed to {nextStageLabel}
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              )}
              <Button variant="secondary" onClick={onRun}>
                <RotateCcw className="size-3.5" />
                Re-run readiness check
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function ReadinessList({
  title,
  items,
  icon: Icon,
  tone,
}: {
  title: string
  items: string[]
  icon: typeof CircleCheck
  tone: 'success' | 'warning' | 'info'
}) {
  const toneClass = { success: 'text-success', warning: 'text-warning', info: 'text-info' }[tone]
  return (
    <div>
      <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">{title}</p>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">None noted.</p>
      ) : (
        <ul className="flex flex-col gap-1.5">
          {items.map((item, index) => (
            <li key={index} className="flex items-start gap-1.5 text-sm text-foreground">
              <Icon className={cn('mt-0.5 size-3.5 shrink-0', toneClass)} aria-hidden />
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
