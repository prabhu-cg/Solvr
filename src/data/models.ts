/**
 * Core Solvr data model.
 *
 * Kept deliberately storage-agnostic — nothing here knows about Dexie,
 * IndexedDB, or any future backing store. Repositories translate to/from
 * whatever persistence they use; everything else in the app only ever
 * sees these shapes.
 */

export type StageKey = 'discover' | 'define' | 'ideate' | 'solution' | 'validate' | 'iterate'

export const STAGE_KEYS: StageKey[] = ['discover', 'define', 'ideate', 'solution', 'validate', 'iterate']

export const STAGE_LABELS: Record<StageKey, string> = {
  discover: 'Discover',
  define: 'Define',
  ideate: 'Ideate',
  solution: 'Solution',
  validate: 'Validate',
  iterate: 'Iterate',
}

export const STAGE_ORDER_NUMBER: Record<StageKey, string> = {
  discover: '01',
  define: '02',
  ideate: '03',
  solution: '04',
  validate: '06',
  iterate: '07',
}

export const STAGE_DESCRIPTIONS: Record<StageKey, string> = {
  discover: 'Understand the problem space — evidence, users and context before jumping to answers.',
  define: 'Turn what you discovered into a sharp, agreed opportunity worth solving.',
  ideate: 'Explore and compare multiple solution concepts before committing to one.',
  solution: 'Develop the strongest direction into a practical, structured specification.',
  validate: 'Test assumptions and prepare for validation.',
  iterate: 'Improve the solution based on validated findings.',
}

/**
 * A stage's status is the single source of truth the left navigation and
 * header readiness indicators render from. "not_started" also covers
 * "not yet available" for stages that later phases haven't implemented.
 */
export type StageStatus = 'not_started' | 'in_progress' | 'needs_attention' | 'ready' | 'completed'

export const STAGE_STATUS_LABELS: Record<StageStatus, string> = {
  not_started: 'Not started',
  in_progress: 'In progress',
  needs_attention: 'Needs attention',
  ready: 'Ready',
  completed: 'Completed',
}

/**
 * Deliverables, assumptions, gaps and recommendations are intentionally
 * loose JSON records rather than fixed shapes — later phases (and the AI
 * service) generate stage-specific content we don't want to redesign the
 * schema for.
 */
export interface StageRecord {
  id: string
  label: string
  detail?: string
  createdAt: string
  [key: string]: unknown
}

/**
 * How a piece of AI-touched content was arrived at. Shown as a badge next to
 * content throughout Discover/Define so it's always clear what's actually
 * known versus inferred or suggested — nothing is ever presented as fact
 * without this distinction.
 */
export type EvidenceType = 'evidence' | 'assumption' | 'inference' | 'recommendation'

export const EVIDENCE_TYPE_LABELS: Record<EvidenceType, string> = {
  evidence: 'Evidence',
  assumption: 'Assumption',
  inference: 'Inference',
  recommendation: 'Recommendation',
}

export const EVIDENCE_TYPE_DESCRIPTIONS: Record<EvidenceType, string> = {
  evidence: 'Directly supplied information — from what you entered or pasted in.',
  assumption: 'An unverified belief that should be checked before you rely on it.',
  inference: 'A conclusion drawn from the available information, not stated outright.',
  recommendation: 'A suggestion for what to do next.',
}

/**
 * Manually captured evidence from testing conducted outside Solvr (Validate
 * stage, V2.2). Distinct from `EvidenceType` above — that tags how a piece
 * of AI-touched content was arrived at; this tags what kind of real-world
 * input the user is recording.
 */
export type ValidationEvidenceType = 'observation' | 'feedback' | 'issue' | 'finding'

export const VALIDATION_EVIDENCE_TYPE_LABELS: Record<ValidationEvidenceType, string> = {
  observation: 'Observation',
  feedback: 'Feedback',
  issue: 'Issue',
  finding: 'Finding',
}

export const VALIDATION_EVIDENCE_TYPE_DESCRIPTIONS: Record<ValidationEvidenceType, string> = {
  observation: 'Something observed during testing.',
  feedback: 'Something a user or stakeholder said.',
  issue: 'A problem identified during testing or review.',
  finding: 'A manually identified research finding.',
}

/** Shared severity scale — used on evidence items, prioritised issues, and findings alike. */
export type EvidenceSeverity = 'critical' | 'high' | 'medium' | 'low'

export const EVIDENCE_SEVERITY_LABELS: Record<EvidenceSeverity, string> = {
  critical: 'Critical',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
}

/**
 * One manually entered piece of validation evidence. Fields are a superset
 * across the four types (Section 5) rather than four separate shapes —
 * which ones are shown/required is driven by `type` in the UI, not the
 * data model. Never AI-generated; this is the user's own record of what
 * happened during testing outside Solvr.
 */
export interface ValidationEvidenceItem {
  id: string
  type: ValidationEvidenceType
  title: string
  /** The observation/issue/finding description, or the feedback quote itself. */
  description: string
  context?: string
  /** Observation/feedback: "related task". Issue: "related task or screen". Not used for findings. */
  relatedTask?: string
  /** Observation/feedback only. */
  notes?: string
  /** Issue/finding only. */
  severity?: EvidenceSeverity
  /** Finding only. */
  supportingEvidence?: string
  createdAt: string
  updatedAt: string
}

/** Review status of a generated finding (Section 18-19) — never auto-accepted; the user decides. */
export type FindingStatus = 'draft' | 'accepted' | 'rejected'

export const FINDING_STATUS_LABELS: Record<FindingStatus, string> = {
  draft: 'Draft',
  accepted: 'Accepted',
  rejected: 'Rejected',
}

/**
 * Iterate proposals (V2.3) share the exact same draft/accepted/rejected
 * review lifecycle as findings — same type, aliased for readability where
 * it's a proposal rather than a finding. Reuses `FINDING_STATUS_LABELS`.
 */
export type ProposalStatus = FindingStatus

/** Lifecycle of one AI-generated deliverable — never a fake percentage, just where it is. */
export type DeliverableStatus = 'idle' | 'preparing' | 'generating' | 'reviewing' | 'complete' | 'failed'

export interface DeliverableState<T = unknown> {
  status: DeliverableStatus
  content?: T
  /** Set once the user has explicitly accepted this deliverable — see Section 9/2. */
  accepted?: boolean
  /** Set when an earlier-stage output this may depend on was edited after this was generated — surfaced, never auto-resolved (Phase 4, Section 9). */
  possiblyStale?: boolean
  error?: string
  generatedAt?: string
  updatedAt: string
}

export function createIdleDeliverable<T>(): DeliverableState<T> {
  return { status: 'idle', updatedAt: new Date().toISOString() }
}

/** A readiness assessment, generated by AI critique of a stage's content — never a bare number alone. */
export interface ReadinessAssessment {
  score: number
  strengths: string[]
  gaps: string[]
  criticalAssumptions: string[]
  recommendation: string
  recommendedAction: 'proceed' | 'resolve_gaps'
  generatedAt: string
}

export interface Stage {
  status: StageStatus
  readinessScore: number
  readiness?: ReadinessAssessment
  /** Keyed by the local deliverable id for this stage, e.g. "researchPlan", "persona". */
  content: Record<string, DeliverableState>
  /** Ideate only: id of the chosen concept within stages.ideate.content.concepts — the source for the Solution stage. */
  selectedConceptId?: string
  /** Validate only: evidence manually captured from testing conducted outside Solvr (V2.2). Never AI-generated. */
  evidence: ValidationEvidenceItem[]
  /** Iterate only: ids of accepted Validate findings the user has chosen to analyse (V2.3, Section 4/7). */
  selectedFindingIds: string[]
  deliverables: StageRecord[]
  assumptions: StageRecord[]
  gaps: StageRecord[]
  recommendations: StageRecord[]
  userEdits: Record<string, unknown>
  updatedAt: string
}

export function createEmptyStage(): Stage {
  const now = new Date().toISOString()
  return {
    status: 'not_started',
    readinessScore: 0,
    content: {},
    evidence: [],
    selectedFindingIds: [],
    deliverables: [],
    assumptions: [],
    gaps: [],
    recommendations: [],
    userEdits: {},
    updatedAt: now,
  }
}

/**
 * Fills in fields that may be missing on a Stage persisted before this field
 * existed (Phase 1 projects, or projects created before a new deliverable
 * type shipped). Called wherever a stored Project is read.
 */
export function hydrateStage(stage: Stage | undefined | null): Stage {
  if (!stage) return createEmptyStage()
  return {
    ...createEmptyStage(),
    ...stage,
    content: stage.content ?? {},
    evidence: stage.evidence ?? [],
    selectedFindingIds: stage.selectedFindingIds ?? [],
  }
}

/** A stage's status is derived from its readiness assessment and how far the project has moved on — never stored redundantly. */
export function computeStageStatus(stage: Stage, hasMovedPast: boolean): StageStatus {
  if (hasMovedPast) return 'completed'
  if (!stage.readiness) {
    const hasAnyContent = Object.values(stage.content).some((d) => d.status === 'complete' || d.status === 'reviewing')
    return hasAnyContent ? 'in_progress' : 'not_started'
  }
  if (stage.readiness.recommendedAction === 'resolve_gaps') return 'needs_attention'
  return 'ready'
}

export type ProjectStage = 'setup' | StageKey

/** Process order, setup first — the single source of truth for "further along". */
export const PROJECT_STAGE_ORDER: ProjectStage[] = ['setup', ...STAGE_KEYS]

function stageRank(stage: ProjectStage): number {
  return PROJECT_STAGE_ORDER.indexOf(stage)
}

/**
 * The furthest stage a project should be considered "at", given a candidate
 * (typically the stage the user just navigated to). Never regresses — a
 * project that has reached Discover stays at Discover even if the user
 * revisits Project Setup afterwards.
 */
export function advanceCurrentStage(currentStage: ProjectStage, visitedStage: ProjectStage): ProjectStage {
  return stageRank(visitedStage) > stageRank(currentStage) ? visitedStage : currentStage
}

/**
 * Editing an already-generated earlier-stage output never silently
 * overwrites what was built on top of it — instead every later-stage
 * deliverable that already has content gets flagged so the user can
 * decide whether to regenerate it (Section 9: change propagation).
 */
export function markDownstreamStale(stages: Record<StageKey, Stage>, editedStage: StageKey): Record<StageKey, Stage> {
  const editedRank = stageRank(editedStage)
  const next = { ...stages }
  for (const key of STAGE_KEYS) {
    if (stageRank(key) <= editedRank) continue
    const stage = next[key]
    let changed = false
    const content = { ...stage.content }
    for (const [localId, deliverable] of Object.entries(content)) {
      if (deliverable.content !== undefined && !deliverable.possiblyStale) {
        content[localId] = { ...deliverable, possiblyStale: true }
        changed = true
      }
    }
    if (changed) next[key] = { ...stage, content }
  }
  return next
}

export interface Project {
  id: string
  name: string

  // Project Setup fields
  problem: string
  productService: string
  targetUsers: string
  businessGoal: string
  constraints?: string
  evidence?: string

  currentStage: ProjectStage
  stages: Record<StageKey, Stage>

  isSample?: boolean

  createdAt: string
  updatedAt: string
}

export interface NewProjectInput {
  name: string
  problem: string
  productService: string
  targetUsers: string
  businessGoal: string
  constraints?: string
  evidence?: string
  isSample?: boolean
}

export interface ProjectSummary {
  id: string
  name: string
  problem: string
  currentStage: ProjectStage
  overallReadiness: number
  isSample?: boolean
  createdAt: string
  updatedAt: string
}

export function createProjectStages(): Record<StageKey, Stage> {
  return {
    discover: createEmptyStage(),
    define: createEmptyStage(),
    ideate: createEmptyStage(),
    solution: createEmptyStage(),
    validate: createEmptyStage(),
    iterate: createEmptyStage(),
  }
}

/** Overall readiness shown in the header: setup completeness plus stage progress. */
export function computeOverallReadiness(project: Pick<Project, 'stages'> & Partial<Project>): number {
  const setupScore = computeSetupCompleteness(project as Project)
  const stageScores = STAGE_KEYS.map((key) => project.stages?.[key]?.readinessScore ?? 0)
  const weights = [setupScore, ...stageScores]
  const total = weights.reduce((sum, value) => sum + value, 0)
  return Math.round(total / weights.length)
}

export function computeSetupCompleteness(
  project: Pick<Project, 'name' | 'problem' | 'productService' | 'targetUsers' | 'businessGoal'>,
): number {
  const required = [project.name, project.problem, project.productService, project.targetUsers, project.businessGoal]
  const filled = required.filter((field) => field && field.trim().length > 0).length
  return Math.round((filled / required.length) * 100)
}

export function getSetupStatus(project: Project): StageStatus {
  const completeness = computeSetupCompleteness(project)
  if (completeness === 100) return 'completed'
  if (completeness === 0) return 'not_started'
  return 'in_progress'
}
