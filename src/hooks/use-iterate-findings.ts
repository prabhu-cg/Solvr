import { useCallback, useMemo } from 'react'
import type { FindingsWithIds, FindingWithId } from '@/ai/schemas'
import { useProjectStore } from '@/store/useProjectStore'

function writeSelection(patchActiveProject: ReturnType<typeof useProjectStore.getState>['patchActiveProject'], next: string[]) {
  const current = useProjectStore.getState().activeProject
  if (!current) return
  patchActiveProject({
    stages: {
      ...current.stages,
      iterate: { ...current.stages.iterate, selectedFindingIds: next },
    },
  })
}

/**
 * Iteration only ever works from accepted findings (Section 4) — draft and
 * rejected findings are filtered out here so nothing downstream can
 * accidentally pick them up. Selection is a plain array of finding ids,
 * persisted on the Iterate stage exactly like `selectedConceptId` on Ideate.
 */
export function useIterateFindings() {
  const project = useProjectStore((state) => state.activeProject)
  const patchActiveProject = useProjectStore((state) => state.patchActiveProject)

  const acceptedFindings = useMemo<FindingWithId[]>(() => {
    const findingsContent = project?.stages.validate.content.findings?.content as FindingsWithIds | undefined
    return (findingsContent?.items ?? []).filter((item) => item.status === 'accepted')
  }, [project])

  const selectedIds = project?.stages.iterate.selectedFindingIds ?? []

  const toggleSelect = useCallback(
    (id: string) => {
      const current = useProjectStore.getState().activeProject?.stages.iterate.selectedFindingIds ?? []
      const next = current.includes(id) ? current.filter((existing) => existing !== id) : [...current, id]
      writeSelection(patchActiveProject, next)
    },
    [patchActiveProject],
  )

  const selectAll = useCallback(() => {
    writeSelection(
      patchActiveProject,
      acceptedFindings.map((f) => f.id),
    )
  }, [acceptedFindings, patchActiveProject])

  const clearSelection = useCallback(() => {
    writeSelection(patchActiveProject, [])
  }, [patchActiveProject])

  return { acceptedFindings, selectedIds, toggleSelect, selectAll, clearSelection }
}
