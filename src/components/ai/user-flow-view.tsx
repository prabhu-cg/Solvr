import { AlertTriangle, ArrowRight, CircleDot, GitBranch, MousePointerClick, PlayCircle, SquareStack } from 'lucide-react'
import type { FlowStep } from '@/ai/schemas'
import { cn } from '@/lib/utils'

const STEP_ICON: Record<FlowStep['type'], typeof PlayCircle> = {
  start: PlayCircle,
  action: MousePointerClick,
  decision: GitBranch,
  screen: SquareStack,
  completion: CircleDot,
  error: AlertTriangle,
}

const STEP_TONE: Record<FlowStep['type'], string> = {
  start: 'text-info',
  action: 'text-foreground',
  decision: 'text-warning',
  screen: 'text-foreground',
  completion: 'text-success',
  error: 'text-destructive',
}

export function FlowStepList({ steps }: { steps: FlowStep[] }) {
  return (
    <ol className="flex flex-col gap-3">
      {steps.map((step, i) => {
        const Icon = STEP_ICON[step.type]
        return (
          <li key={i} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span className={cn('flex size-7 shrink-0 items-center justify-center rounded-full border border-border bg-card', STEP_TONE[step.type])}>
                <Icon className="size-3.5" aria-hidden />
              </span>
              {i < steps.length - 1 && <span className="mt-1 h-full w-px flex-1 bg-border" aria-hidden />}
            </div>
            <div className="pb-3">
              <p className="text-sm font-bold text-foreground">
                {step.step}
                <span className="ml-2 rounded-full border border-border bg-muted px-2 py-0.5 text-xs font-semibold capitalize text-muted-foreground">
                  {step.type}
                </span>
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>
              {step.screen && <p className="mt-1 text-xs font-semibold text-primary-text">Screen: {step.screen}</p>}
              {step.branches && step.branches.length > 0 && (
                <ul className="mt-1.5 flex flex-col gap-1">
                  {step.branches.map((branch, bi) => (
                    <li key={bi} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <ArrowRight className="size-3 shrink-0" aria-hidden />
                      {branch}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
