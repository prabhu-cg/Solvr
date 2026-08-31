/**
 * Core Solvr data model.
 *
 * Kept deliberately storage-agnostic — nothing here knows about Dexie,
 * IndexedDB, or any future backing store. Repositories translate to/from
 * whatever persistence they use; everything else in the app only ever
 * sees these shapes.
 */

export type StageKey = 'discover' | 'define' | 'ideate' | 'solution'

export const STAGE_KEYS: StageKey[] = ['discover', 'define', 'ideate', 'solution']

export const STAGE_LABELS: Record<StageKey, string> = {
  discover: 'Discover',
  define: 'Define',
  ideate: 'Ideate',
  solution: 'Solution',
}

export const STAGE_ORDER_NUMBER: Record<StageKey, string> = {
  discover: '01',
  define: '02',
  ideate: '03',
  solution: '04',
}

export const STAGE_DESCRIPTIONS: Record<StageKey, string> = {
  discover: 'Understand the problem space — evidence, users and context before jumping to answers.',
  define: 'Turn what you discovered into a sharp, agreed opportunity worth solving.',
  ideate: 'Explore and compare multiple solution concepts before committing to one.',
  solution: 'Develop the strongest direction into a practical, structured specification.',
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

export interface Stage {
  status: StageStatus
  readinessScore: number
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
    deliverables: [],
    assumptions: [],
    gaps: [],
    recommendations: [],
    userEdits: {},
    updatedAt: now,
  }
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
