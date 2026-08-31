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
  }
}
