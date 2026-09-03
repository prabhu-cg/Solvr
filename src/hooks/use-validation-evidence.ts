import { useCallback } from 'react'
import type { ValidationEvidenceItem } from '@/data/models'
import { useProjectStore } from '@/store/useProjectStore'

function newId(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `ev_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
}

function writeEvidence(patchActiveProject: ReturnType<typeof useProjectStore.getState>['patchActiveProject'], next: ValidationEvidenceItem[]) {
  const current = useProjectStore.getState().activeProject
  if (!current) return
  patchActiveProject({
    stages: {
      ...current.stages,
      validate: { ...current.stages.validate, evidence: next },
    },
  })
}

/**
 * Manual CRUD for Validate-stage evidence (Section 5-8) — never AI-generated,
 * so unlike `useDeliverable` this writes straight to the store rather than
 * going through the generation lifecycle.
 */
export function useValidationEvidence() {
  const project = useProjectStore((state) => state.activeProject)
  const patchActiveProject = useProjectStore((state) => state.patchActiveProject)
  const evidence = project?.stages.validate.evidence ?? []

  const addEvidence = useCallback(
    (input: Omit<ValidationEvidenceItem, 'id' | 'createdAt' | 'updatedAt'>) => {
      const current = useProjectStore.getState().activeProject
      if (!current) return
      const now = new Date().toISOString()
      writeEvidence(patchActiveProject, [...current.stages.validate.evidence, { ...input, id: newId(), createdAt: now, updatedAt: now }])
    },
    [patchActiveProject],
  )

  const updateEvidence = useCallback(
    (id: string, patch: Partial<Omit<ValidationEvidenceItem, 'id' | 'createdAt'>>) => {
      const current = useProjectStore.getState().activeProject
      if (!current) return
      writeEvidence(
        patchActiveProject,
        current.stages.validate.evidence.map((item) =>
          item.id === id ? { ...item, ...patch, updatedAt: new Date().toISOString() } : item,
        ),
      )
    },
    [patchActiveProject],
  )

  const deleteEvidence = useCallback(
    (id: string) => {
      const current = useProjectStore.getState().activeProject
      if (!current) return
      writeEvidence(
        patchActiveProject,
        current.stages.validate.evidence.filter((item) => item.id !== id),
      )
    },
    [patchActiveProject],
  )

  return { evidence, addEvidence, updateEvidence, deleteEvidence }
}
