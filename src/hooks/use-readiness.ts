import { useCallback, useState } from 'react'
import { buildAIContext } from '@/ai/context'
import type { CritiqueStage } from '@/services/ai/AIService'
import { aiService } from '@/services/ai/AIService'
import { useProjectStore } from '@/store/useProjectStore'

export type ReadinessRunStatus = 'idle' | 'loading' | 'failed'

/** Discover/Define/Ideate readiness assessment — generation, storage, and the score feeding straight into overall project readiness. */
export function useReadiness(stage: CritiqueStage) {
  const project = useProjectStore((state) => state.activeProject)
  const patchActiveProject = useProjectStore((state) => state.patchActiveProject)
  const readiness = project?.stages[stage]?.readiness
  const [status, setStatus] = useState<ReadinessRunStatus>('idle')
  const [error, setError] = useState<string | undefined>(undefined)

  const run = useCallback(async () => {
    const latest = useProjectStore.getState().activeProject
    if (!latest) return
    setStatus('loading')
    setError(undefined)

    try {
      const context = buildAIContext(latest, stage)
      const result = await aiService.critique({ stage, context })

      const current = useProjectStore.getState().activeProject
      if (!current) return
      const currentStage = current.stages[stage]
      patchActiveProject({
        stages: {
          ...current.stages,
          [stage]: {
            ...currentStage,
            readiness: { ...result.content, generatedAt: new Date().toISOString() },
            readinessScore: result.content.score,
          },
        },
      })
      setStatus('idle')
    } catch (err) {
      setStatus('failed')
      setError(err instanceof Error ? err.message : 'Could not assess readiness. Please try again.')
    }
  }, [stage, patchActiveProject])

  return { readiness, run, status, error }
}
