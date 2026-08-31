import { Clock } from 'lucide-react'
import { StageHeader } from '@/components/app/stage-header'
import { Card, CardContent } from '@/components/ui/card'
import type { StageKey } from '@/data/models'
import { STAGE_DESCRIPTIONS, STAGE_LABELS } from '@/data/models'

interface StagePlaceholderPageProps {
  stage: StageKey
}

export function StagePlaceholderPage({ stage }: StagePlaceholderPageProps) {
  return (
    <div>
      <StageHeader title={STAGE_LABELS[stage]} description={STAGE_DESCRIPTIONS[stage]} status="not_started" />

      <div className="px-6 py-8 sm:px-8">
        <Card className="mx-auto max-w-2xl">
          <CardContent className="flex flex-col items-center gap-3 p-10 text-center">
            <span className="flex size-11 items-center justify-center rounded-full bg-accent text-accent-foreground">
              <Clock className="size-5" />
            </span>
            <h2 className="text-base font-bold text-foreground">Coming in a later phase</h2>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              {STAGE_LABELS[stage]} isn’t available yet. Solvr currently covers Project Setup,
              Discover, Define and Ideate — this stage arrives in a later phase.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
