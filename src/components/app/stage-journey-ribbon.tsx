import { CircleCheck, Loader, type LucideIcon } from 'lucide-react'
import type { DeliverableState } from '@/data/models'
import { cn } from '@/lib/utils'

export interface JourneyStep {
  /** Key into the stage's `content` record — see `Stage.content` in data/models.ts. */
  key: string
  label: string
  icon: LucideIcon
  /** DOM id of the card this step scrolls to — set via `<div id={anchor}>` around the card. */
  anchor: string
}

export type JourneyNodeState = 'idle' | 'generating' | 'reviewing' | 'complete'

function deliverableNodeState(state: DeliverableState | undefined): JourneyNodeState {
  if (!state) return 'idle'
  if (state.accepted || state.status === 'complete') return 'complete'
  if (state.status === 'preparing' || state.status === 'generating') return 'generating'
  if (state.status === 'reviewing') return 'reviewing'
  return 'idle'
}

const NODE_TONE: Record<JourneyNodeState, string> = {
  idle: 'text-muted-foreground hover:bg-muted hover:text-foreground',
  generating: 'bg-info-soft text-info',
  reviewing: 'bg-warning-soft text-warning',
  complete: 'bg-success-soft text-success',
}

interface StageJourneyRibbonProps {
  steps: JourneyStep[]
  content: Record<string, DeliverableState>
  /** Override a step's computed state — for steps that aren't AI deliverables (e.g. a manual selection). */
  overrides?: Record<string, JourneyNodeState>
}

/** A slim, sticky wayfinder across a stage's real artifact sequence — click a step to jump to its card. */
export function StageJourneyRibbon({ steps, content, overrides }: StageJourneyRibbonProps) {
  function goTo(anchor: string) {
    document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="sticky top-0 z-10 -mx-6 overflow-x-auto bg-card px-6 py-3.5 sm:-mx-8 sm:px-8">
      <div className="mx-auto flex w-max items-center justify-center gap-1">
        {steps.map((step, i) => {
          const nState = overrides?.[step.key] ?? deliverableNodeState(content[step.key])
          const Icon = nState === 'generating' ? Loader : nState === 'complete' ? CircleCheck : step.icon
          return (
            <div key={step.key} className="flex items-center">
              <button
                type="button"
                onClick={() => goTo(step.anchor)}
                className={cn(
                  'flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1.5 text-xs font-semibold transition-colors',
                  NODE_TONE[nState],
                )}
              >
                <Icon className={cn('size-3.5', nState === 'generating' && 'animate-spin')} aria-hidden />
                {step.label}
              </button>
              {i < steps.length - 1 && <div className="mx-1 h-px w-4 shrink-0 bg-border sm:w-6" aria-hidden />}
            </div>
          )
        })}
      </div>
    </div>
  )
}
