import { Sparkles } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useDeliverable } from '@/hooks/use-deliverable'
import { useProjectStore } from '@/store/useProjectStore'

/**
 * A single "build the whole plan" shortcut alongside the per-deliverable
 * Generate buttons on each card below (Section 8: never force the user to
 * generate everything). Only ever generates deliverables that are still
 * idle — an already-generated, edited or accepted one is left untouched,
 * matching DeliverableCard's own "never silently replace" rule.
 */
export function ValidateGenerateAllCard() {
  const readOnly = useProjectStore((state) => state.activeProject?.isSample ?? false)
  const testPlan = useDeliverable('validate', 'testPlan')
  const testScenarios = useDeliverable('validate', 'testScenarios')
  const testTasks = useDeliverable('validate', 'testTasks')
  const interviewQuestions = useDeliverable('validate', 'interviewQuestions')
  const successCriteria = useDeliverable('validate', 'successCriteria')
  const heuristicReview = useDeliverable('validate', 'heuristicReview')
  const [running, setRunning] = useState(false)

  const all = [testPlan, testScenarios, testTasks, interviewQuestions, successCriteria, heuristicReview]
  const pending = all.filter((d) => d.deliverable.status === 'idle')
  const isBusy = all.some((d) => d.deliverable.status === 'preparing' || d.deliverable.status === 'generating')

  if (readOnly || pending.length === 0) return null

  async function generateAll() {
    setRunning(true)
    try {
      for (const d of pending) {
        await d.generate()
      }
    } finally {
      setRunning(false)
    }
  }

  return (
    <Card className="border-dashed border-border-strong bg-muted/30">
      <CardContent className="flex flex-wrap items-center justify-between gap-4 py-5">
        <div>
          <p className="text-sm font-bold text-foreground">Generate a full validation plan</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Builds every deliverable below that hasn't been generated yet ({pending.length} remaining) — or generate them one at a
            time instead.
          </p>
        </div>
        <Button onClick={generateAll} disabled={running || isBusy}>
          <Sparkles className="size-4" />
          {running ? 'Generating…' : 'Generate all'}
        </Button>
      </CardContent>
    </Card>
  )
}
