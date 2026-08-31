import { Clock } from 'lucide-react'
import { Navigate, useParams } from 'react-router-dom'
import { StageHeader } from '@/components/app/stage-header'
import { Card, CardContent } from '@/components/ui/card'
import type { StageKey } from '@/data/models'
import { STAGE_DESCRIPTIONS, STAGE_KEYS, STAGE_LABELS } from '@/data/models'

export function StagePlaceholderPage() {
  const { stage } = useParams<{ stage: string }>()

  if (!stage || !STAGE_KEYS.includes(stage as StageKey)) {
    return <Navigate to="../setup" replace />
  }
  const stageKey = stage as StageKey

  return (
    <div>
      <StageHeader
        title={STAGE_LABELS[stageKey]}
        description={STAGE_DESCRIPTIONS[stageKey]}
        status="not_started"
      />

      <div className="px-6 py-8 sm:px-8">
        <Card className="mx-auto max-w-2xl">
          <CardContent className="flex flex-col items-center gap-3 p-10 text-center">
            <span className="flex size-11 items-center justify-center rounded-full bg-accent text-accent-foreground">
              <Clock className="size-5" />
            </span>
            <h2 className="text-base font-bold text-foreground">Coming in a later phase</h2>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              {STAGE_LABELS[stageKey]} isn’t available yet. Solvr Phase 1 covers Project Setup —
              this stage, along with guided AI generation, arrives in a later phase.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
