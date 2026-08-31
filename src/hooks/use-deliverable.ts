import { useCallback, useState } from 'react'
import { buildAIContext } from '@/ai/context'
import type { AITaskId } from '@/ai/tasks'
import { createIdleDeliverable, markDownstreamStale, type DeliverableState, type Project, type StageKey } from '@/data/models'
import { aiService } from '@/services/ai/AIService'
import { useProjectStore } from '@/store/useProjectStore'

/** Always reads/writes the live store state, never a closured prop — safe even if two deliverables generate concurrently. */
function writeDeliverable(
  patchActiveProject: (patch: Partial<Omit<Project, 'id' | 'createdAt'>>) => void,
  stage: StageKey,
  localId: string,
  next: DeliverableState,
) {
  const current = useProjectStore.getState().activeProject
  if (!current) return
  const currentStage = current.stages[stage]
  patchActiveProject({
    stages: {
      ...current.stages,
      [stage]: {
        ...currentStage,
        content: { ...currentStage.content, [localId]: next },
      },
    },
  })
}

/**
 * Generation lifecycle + storage for a single Discover/Define deliverable.
 * Every write goes through ProjectRepository (via patchActiveProject) —
 * never touches IndexedDB directly (Section 11).
 */
export function useDeliverable<T = unknown>(
  stage: StageKey,
  localId: string,
  options?: { transformContent?: (raw: unknown) => T },
) {
  const project = useProjectStore((state) => state.activeProject)
  const patchActiveProject = useProjectStore((state) => state.patchActiveProject)
  const taskId = `${stage}.${localId}` as AITaskId

  const deliverable = (project?.stages[stage]?.content[localId] ?? createIdleDeliverable()) as DeliverableState<T>
  // Live, unpersisted reasoning trace while a generation is in flight — the deliverable itself only ever arrives once, at the end.
  const [reasoning, setReasoning] = useState('')

  const generate = useCallback(
    async (instruction?: string) => {
      const latest = useProjectStore.getState().activeProject
      if (!latest) return
      const before = latest.stages[stage].content[localId] as DeliverableState<T> | undefined

      setReasoning('')
      writeDeliverable(patchActiveProject, stage, localId, {
        status: 'preparing',
        content: before?.content,
        accepted: before?.accepted,
        updatedAt: new Date().toISOString(),
      })

      try {
        const context = buildAIContext(latest, stage)
        writeDeliverable(patchActiveProject, stage, localId, {
          status: 'generating',
          content: before?.content,
          accepted: before?.accepted,
          updatedAt: new Date().toISOString(),
        })

        const result = await aiService.generate({
          task: taskId,
          context,
          instruction,
          onReasoning: (delta) => setReasoning((prev) => prev + delta),
        })
        const content = options?.transformContent ? options.transformContent(result.content) : (result.content as T)

        writeDeliverable(patchActiveProject, stage, localId, {
          status: 'reviewing',
          content,
          accepted: false,
          generatedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
      } catch (error) {
        // Existing content is preserved — a failed regeneration never wipes what was there.
        writeDeliverable(patchActiveProject, stage, localId, {
          status: 'failed',
          content: before?.content,
          accepted: before?.accepted,
          error: error instanceof Error ? error.message : 'Generation failed. Please try again.',
          updatedAt: new Date().toISOString(),
        })
      } finally {
        setReasoning('')
      }
    },
    [stage, localId, taskId, patchActiveProject, options],
  )

  const accept = useCallback(() => {
    writeDeliverable(patchActiveProject, stage, localId, {
      ...deliverable,
      status: 'complete',
      accepted: true,
      updatedAt: new Date().toISOString(),
    })
  }, [deliverable, patchActiveProject, stage, localId])

  const updateContent = useCallback(
    (content: T) => {
      const current = useProjectStore.getState().activeProject
      if (!current) return
      // Marking downstream stale and writing the edit are bundled into one
      // patch so they land atomically — never a moment where the edit is
      // saved but affected later-stage deliverables aren't yet flagged.
      const stagesWithStaleFlags = markDownstreamStale(current.stages, stage)
      const currentStageData = stagesWithStaleFlags[stage]
      patchActiveProject({
        stages: {
          ...stagesWithStaleFlags,
          [stage]: {
            ...currentStageData,
            content: {
              ...currentStageData.content,
              [localId]: { ...deliverable, content, updatedAt: new Date().toISOString() },
            },
          },
        },
      })
    },
    [deliverable, patchActiveProject, stage, localId],
  )

  /** The user reviewed a "may be affected" flag and decided this output is still fine as-is. */
  const dismissStale = useCallback(() => {
    writeDeliverable(patchActiveProject, stage, localId, {
      ...deliverable,
      possiblyStale: false,
      updatedAt: new Date().toISOString(),
    })
  }, [deliverable, patchActiveProject, stage, localId])

  return { deliverable, generate, accept, updateContent, dismissStale, reasoning }
}
