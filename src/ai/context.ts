import type { FindingsWithIds } from './schemas.js'
import type { Project, ProjectStage, StageKey } from '../data/models.js'
import { PROJECT_STAGE_ORDER } from '../data/models.js'

/**
 * The trimmed, structured context sent to the AI backend. This — and
 * nothing else — is what generation is grounded in. Deliberately excludes
 * other projects, UI state, or anything not relevant to the current stage
 * (Section 2).
 */
export interface AIProjectContext {
  project: {
    name: string
    problem: string
    productService: string
    targetUsers: string
    businessGoal: string
    constraints?: string
    evidence?: string
  }
  currentStage: StageKey
  /** Accepted deliverables from stages earlier in the process, keyed by "stage.taskId". */
  priorAcceptedDeliverables: Record<string, unknown>
  /** This stage's own deliverables generated so far, keyed by taskId — used for critique/regeneration context. */
  currentStageDeliverables: Record<string, unknown>
  knownGaps: string[]
  knownAssumptions: string[]
  /** The concept chosen in Ideate (via selectedConceptId), called out explicitly so Solution builds on THAT concept — not just whichever ones happen to be in priorAcceptedDeliverables. */
  selectedConcept?: unknown
  /**
   * Validate only: evidence manually captured from testing conducted
   * outside Solvr, each carrying its own stable id so generated analysis
   * can cite exactly which evidence it's grounded in (Section 15 —
   * analysis transparency) rather than inventing findings.
   */
  validationEvidence?: {
    id: string
    type: string
    title: string
    description: string
    context?: string
    relatedTask?: string
    severity?: string
  }[]
  /**
   * Iterate only: the accepted Validate findings the user selected to
   * analyse (Section 4/7) — never draft or rejected findings, and never
   * every accepted finding, only the ones the user picked.
   */
  selectedFindings?: {
    id: string
    title: string
    description: string
    theme: string
    severity: string
    priority: string
    insight: string
  }[]
  /**
   * Iterate only: the live Solution-stage content, regardless of whether
   * each card has been explicitly "Accepted" — proposals need to see what
   * the solution actually is right now, not just the accepted subset.
   */
  currentSolutionContent?: Record<string, unknown>
}

export function buildAIContext(project: Project, stage: StageKey): AIProjectContext {
  const priorAcceptedDeliverables: Record<string, unknown> = {}
  const currentRank = PROJECT_STAGE_ORDER.indexOf(stage as ProjectStage)

  for (const [stageKey, stageData] of Object.entries(project.stages) as [StageKey, Project['stages'][StageKey]][]) {
    const rank = PROJECT_STAGE_ORDER.indexOf(stageKey)
    if (rank >= currentRank) continue
    for (const [taskId, deliverable] of Object.entries(stageData.content)) {
      if (deliverable.accepted && deliverable.content) {
        priorAcceptedDeliverables[`${stageKey}.${taskId}`] = deliverable.content
      }
    }
  }

  const currentStageDeliverables: Record<string, unknown> = {}
  const currentStageData = project.stages[stage]
  for (const [taskId, deliverable] of Object.entries(currentStageData.content)) {
    if (deliverable.content) {
      currentStageDeliverables[taskId] = deliverable.content
    }
  }

  const selectedConceptId = project.stages.ideate.selectedConceptId
  const conceptsContent = project.stages.ideate.content.concepts?.content as { items?: { id?: string }[] } | undefined
  const selectedConcept = selectedConceptId
    ? conceptsContent?.items?.find((item) => item.id === selectedConceptId)
    : undefined

  const validationEvidence =
    stage === 'validate'
      ? project.stages.validate.evidence.map((item) => ({
          id: item.id,
          type: item.type,
          title: item.title,
          description: item.description,
          context: item.context,
          relatedTask: item.relatedTask,
          severity: item.severity,
        }))
      : undefined

  const selectedFindings =
    stage === 'iterate'
      ? (() => {
          const findingsContent = project.stages.validate.content.findings?.content as FindingsWithIds | undefined
          const selectedIds = new Set(project.stages.iterate.selectedFindingIds)
          return (findingsContent?.items ?? [])
            .filter((item) => item.status === 'accepted' && selectedIds.has(item.id))
            .map((item) => ({
              id: item.id,
              title: item.title,
              description: item.description,
              theme: item.theme,
              severity: item.severity,
              priority: item.priority,
              insight: item.insight,
            }))
        })()
      : undefined

  const currentSolutionContent =
    stage === 'iterate'
      ? Object.fromEntries(
          Object.entries(project.stages.solution.content)
            .filter(([, deliverable]) => deliverable.content !== undefined)
            .map(([localId, deliverable]) => [localId, deliverable.content]),
        )
      : undefined

  return {
    project: {
      name: project.name,
      problem: project.problem,
      productService: project.productService,
      targetUsers: project.targetUsers,
      businessGoal: project.businessGoal,
      constraints: project.constraints,
      evidence: project.evidence,
    },
    currentStage: stage,
    priorAcceptedDeliverables,
    currentStageDeliverables,
    knownGaps: currentStageData.readiness?.gaps ?? [],
    knownAssumptions: currentStageData.readiness?.criticalAssumptions ?? [],
    selectedConcept,
    validationEvidence,
    selectedFindings,
    currentSolutionContent,
  }
}
