import { z } from 'zod'

/**
 * Structured-output schemas for every AI deliverable in Discover and
 * Define. Each schema is the single source of truth for that deliverable's
 * shape — used to constrain generation (Section 3: structured JSON output)
 * and to validate the model's response before it's ever stored.
 */

export const evidenceTypeSchema = z.enum(['evidence', 'assumption', 'inference', 'recommendation'])
export const confidenceSchema = z.enum(['low', 'medium', 'high'])

// ---------------------------------------------------------------------------
// Discover
// ---------------------------------------------------------------------------

export const researchPlanSchema = z.object({
  objectives: z.array(z.string()).min(2).max(6).describe('What this research needs to establish.'),
  keyQuestions: z.array(z.string()).min(2).max(8).describe('The core questions the research should answer.'),
  recommendedMethods: z.array(z.string()).min(1).max(5).describe('e.g. semi-structured interviews, contextual inquiry, survey.'),
  targetParticipants: z.string().describe('Who should be involved, based on the target users described.'),
  suggestedSampleSize: z.string().describe('A realistic, qualitative suggestion, e.g. "8-12 participants".'),
  evidenceRequired: z.array(z.string()).min(1).max(6).describe('What evidence would make this stage ready to move on.'),
  expectedOutputs: z.array(z.string()).min(1).max(6),
})
export type ResearchPlan = z.infer<typeof researchPlanSchema>

const questionCategorySchema = z.array(z.string()).min(1).max(4).describe('Neutral, non-leading questions.')

export const interviewQuestionsSchema = z.object({
  opening: questionCategorySchema,
  context: questionCategorySchema,
  behaviour: questionCategorySchema,
  currentExperience: questionCategorySchema,
  painPoints: questionCategorySchema,
  motivation: questionCategorySchema,
  closing: z.array(z.string()).min(1).max(3),
})
export type InterviewQuestions = z.infer<typeof interviewQuestionsSchema>

export const surveyQuestionsSchema = z.object({
  screening: z.array(z.string()).min(1).max(4),
  behaviour: z.array(z.string()).min(1).max(4),
  experience: z.array(z.string()).min(1).max(4),
  painPoints: z.array(z.string()).min(1).max(4),
  satisfaction: z.array(z.string()).min(1).max(3),
  openEnded: z.array(z.string()).min(1).max(3),
})
export type SurveyQuestions = z.infer<typeof surveyQuestionsSchema>

export const assumptionItemSchema = z.object({
  assumption: z.string(),
  whyItMatters: z.string(),
  confidence: confidenceSchema,
  potentialImpact: z.string(),
  validationApproach: z.string().describe('How this could be checked — an interview, a test, existing data, etc.'),
})
export const assumptionsSchema = z.object({
  items: z.array(assumptionItemSchema).min(3).max(8),
})
export type AssumptionItem = z.infer<typeof assumptionItemSchema>
export type Assumptions = z.infer<typeof assumptionsSchema>

const synthesisItemSchema = z.object({
  text: z.string(),
  type: evidenceTypeSchema.describe('"evidence" only if directly supported by the supplied evidence; otherwise "inference" or "assumption".'),
})
export const researchSynthesisSchema = z.object({
  hasEvidence: z.boolean().describe('True only if real evidence/research notes were supplied in the project context.'),
  disclaimer: z
    .string()
    .nullable()
    .describe(
      'Must read exactly "No primary research has been provided. Generated items are hypotheses or assumptions rather than validated findings." when hasEvidence is false, otherwise null.',
    ),
  observations: z.array(synthesisItemSchema).max(6),
  findings: z.array(synthesisItemSchema).max(6),
  themes: z.array(synthesisItemSchema).max(6),
  insights: z.array(synthesisItemSchema).max(6),
})
export type ResearchSynthesis = z.infer<typeof researchSynthesisSchema>

// ---------------------------------------------------------------------------
// Define
// ---------------------------------------------------------------------------

export const insightItemSchema = z.object({
  insight: z.string(),
  evidence: z.string().describe('What this is based on. Say so plainly if it is inferred rather than directly evidenced.'),
  relatedUserNeed: z.string(),
  confidence: confidenceSchema,
})
export const insightsSchema = z.object({ items: z.array(insightItemSchema).min(2).max(6) })
export type InsightItem = z.infer<typeof insightItemSchema>
export type Insights = z.infer<typeof insightsSchema>

export const userNeedItemSchema = z.object({
  user: z.string(),
  need: z.string(),
  context: z.string(),
  importance: confidenceSchema,
  evidence: z.string(),
})
export const userNeedsSchema = z.object({ items: z.array(userNeedItemSchema).min(2).max(6) })
export type UserNeedItem = z.infer<typeof userNeedItemSchema>
export type UserNeeds = z.infer<typeof userNeedsSchema>

export const painPointItemSchema = z.object({
  painPoint: z.string(),
  user: z.string(),
  impact: z.string(),
  evidence: z.string(),
})
export const painPointsSchema = z.object({ items: z.array(painPointItemSchema).min(2).max(6) })
export type PainPointItem = z.infer<typeof painPointItemSchema>
export type PainPoints = z.infer<typeof painPointsSchema>

export const personaSchema = z.object({
  userType: z.string(),
  context: z.string(),
  goals: z.array(z.string()).min(1).max(5),
  needs: z.array(z.string()).min(1).max(5),
  behaviours: z.array(z.string()).min(1).max(5),
  painPoints: z.array(z.string()).min(1).max(5),
  motivations: z.array(z.string()).min(1).max(5),
  evidence: z.string().describe('What this persona is grounded in. Do not invent demographics unless supplied.'),
})
export type Persona = z.infer<typeof personaSchema>

export const userJourneyStageSchema = z.object({
  stage: z.string(),
  userGoal: z.string(),
  userAction: z.string(),
  experience: z.string(),
  painPoint: z.string(),
  opportunity: z.string(),
})
export const userJourneySchema = z.object({
  stages: z.array(userJourneyStageSchema).min(3).max(8),
})
export type UserJourneyStage = z.infer<typeof userJourneyStageSchema>
export type UserJourney = z.infer<typeof userJourneySchema>

export const problemStatementSchema = z.object({
  user: z.string(),
  context: z.string(),
  problem: z.string(),
  impact: z.string(),
  rationale: z.string().describe('Why this framing follows from what was discovered.'),
})
export type ProblemStatement = z.infer<typeof problemStatementSchema>

export const hmwSchema = z.object({
  questions: z.array(z.string()).min(3).max(5).describe('Solution-neutral "How might we" questions.'),
  recommendedQuestion: z.string(),
  rationale: z.string(),
})
export type HMW = z.infer<typeof hmwSchema>

// ---------------------------------------------------------------------------
// Ideate
// ---------------------------------------------------------------------------

export const opportunityItemSchema = z.object({
  opportunity: z.string(),
  userNeed: z.string().describe('Which insight, user need, pain point, problem statement or HMW this comes from.'),
  supportingEvidence: z.string(),
  potentialImpact: z.string(),
})
export const opportunitiesSchema = z.object({ items: z.array(opportunityItemSchema).min(3).max(8) })
export type OpportunityItem = z.infer<typeof opportunityItemSchema>
export type Opportunities = z.infer<typeof opportunitiesSchema>

export const conceptSchema = z.object({
  name: z.string(),
  description: z.string(),
  userValue: z.string().describe('What this concept gives the user.'),
  businessValue: z.string().describe('What this concept gives the business.'),
  keyFunctionality: z.array(z.string()).min(2).max(6),
  advantages: z.array(z.string()).min(1).max(5),
  risks: z.array(z.string()).min(1).max(5),
  dependencies: z.array(z.string()).max(5),
  openQuestions: z.array(z.string()).max(5),
  supportingEvidence: z.string().describe('Which opportunities/insights this concept responds to.'),
  keyAssumptions: z.array(z.string()).min(1).max(5),
})
export const conceptsSchema = z.object({
  items: z
    .array(conceptSchema)
    .min(3)
    .max(5)
    .describe('3-5 genuinely different approaches — never superficial variations of the same idea.'),
})
export type Concept = z.infer<typeof conceptSchema>
export type Concepts = z.infer<typeof conceptsSchema>
/** Concepts are given a stable client-side id once generated, so selection survives edits/regeneration of other fields. */
export type ConceptWithId = Concept & { id: string }
export interface ConceptsWithIds {
  items: ConceptWithId[]
}

export const prioritisationItemSchema = z.object({
  conceptName: z.string(),
  userValue: z.number().min(1).max(10),
  businessValue: z.number().min(1).max(10),
  feasibility: z.number().min(1).max(10),
  complexityRisk: z.number().min(1).max(10).describe('Higher number = more complex/risky.'),
  reasoning: z.string().describe('Why these scores — the reasoning a user can inspect.'),
})
export const prioritisationSchema = z.object({
  items: z.array(prioritisationItemSchema).min(3).max(5),
})
export type PrioritisationItem = z.infer<typeof prioritisationItemSchema>
export type Prioritisation = z.infer<typeof prioritisationSchema>

export const recommendationSchema = z.object({
  recommendedConceptName: z.string(),
  reasoning: z.string(),
  evidenceSupporting: z.array(z.string()).min(1).max(6),
  assumptions: z.array(z.string()).min(1).max(6),
  risks: z.array(z.string()).min(1).max(6),
  openQuestions: z.array(z.string()).max(6),
})
export type Recommendation = z.infer<typeof recommendationSchema>

// ---------------------------------------------------------------------------
// Solution
// ---------------------------------------------------------------------------

// A fixed 3-level hierarchy (product area -> section -> page), not an open-ended
// recursive tree: the spec only ever needs these three named levels, and a truly
// recursive (z.lazy) schema is unreliable under strict-mode structured output —
// providers can silently degrade the recursive branch to "any", which in testing
// caused the model to wrap its entire response in an array instead of an object.
export const iaPageSchema = z.object({ label: z.string() })
export const iaSectionSchema = z.object({
  label: z.string(),
  pages: z.array(iaPageSchema).min(1).max(8),
})
export const iaProductAreaSchema = z.object({
  label: z.string(),
  sections: z.array(iaSectionSchema).min(1).max(8),
})
export type IAPage = z.infer<typeof iaPageSchema>
export type IASection = z.infer<typeof iaSectionSchema>
export type IAProductArea = z.infer<typeof iaProductAreaSchema>

export const informationArchitectureSchema = z.object({
  tree: z.array(iaProductAreaSchema).min(1).max(6).describe('Root-level product areas, each with sections, each with pages.'),
  primaryNavigation: z.array(z.string()).min(2).max(8),
  secondaryNavigation: z.array(z.string()).max(8).describe('Leave empty if there is no meaningful secondary navigation.'),
})
export type InformationArchitecture = z.infer<typeof informationArchitectureSchema>

export const flowStepSchema = z.object({
  step: z.string().describe('A short label for this step.'),
  type: z.enum(['start', 'action', 'decision', 'screen', 'completion', 'error']),
  description: z.string(),
  screen: z.string().describe('Which screen from the screen list this corresponds to. Empty string if none.'),
  branches: z.array(z.string()).max(4).describe('For a decision step: the possible outcomes. Empty array otherwise.'),
})
export const userFlowSchema = z.object({
  mainPath: z.array(flowStepSchema).min(4).max(14),
  alternatePaths: z
    .array(z.object({ name: z.string(), steps: z.array(flowStepSchema).min(1).max(8) }))
    .max(4)
    .describe('Realistic alternate routes through the flow.'),
  errorRecoveryPaths: z
    .array(
      z.object({
        name: z.string(),
        steps: z
          .array(flowStepSchema)
          .min(1)
          .max(8)
          .describe('Only the steps from where things go wrong back to safety — do not re-list the whole main path.'),
      }),
    )
    .max(4)
    .describe('What happens when something goes wrong, and how the user recovers.'),
})
export type FlowStep = z.infer<typeof flowStepSchema>
export type UserFlow = z.infer<typeof userFlowSchema>

export const screenListItemSchema = z.object({
  screen: z.string(),
  purpose: z.string(),
  userGoal: z.string(),
  primaryAction: z.string(),
  keyContent: z.string(),
  flowStep: z.string().describe('Which step of the user flow this screen corresponds to.'),
})
export const screenListSchema = z.object({
  items: z.array(screenListItemSchema).min(3).max(12),
})
export type ScreenListItem = z.infer<typeof screenListItemSchema>
export type ScreenList = z.infer<typeof screenListSchema>

export const wireframeStateSchema = z.enum(['default', 'loading', 'empty', 'error', 'success', 'disabled'])
export const wireframeSpecSchema = z.object({
  screen: z.string().describe('Must match a screen name from the screen list.'),
  purpose: z.string(),
  layout: z.string().describe('The structural layout — regions/zones and their arrangement, not visual pixels.'),
  content: z.array(z.string()).min(1).max(8),
  components: z.array(z.string()).min(1).max(10),
  interactions: z.array(z.string()).min(1).max(8),
  relevantStates: z.array(wireframeStateSchema).min(1).max(6).describe('Only the states that actually apply to this screen.'),
  accessibility: z.array(z.string()).min(1).max(6).describe('Concrete, meaningful accessibility considerations for this screen.'),
})
export const wireframeSpecsSchema = z.object({
  items: z
    .array(wireframeSpecSchema)
    .min(1)
    .max(8)
    .describe('One spec per primary screen only — not every screen in the list.'),
})
export type WireframeSpec = z.infer<typeof wireframeSpecSchema>
export type WireframeSpecs = z.infer<typeof wireframeSpecsSchema>

export const requirementItemSchema = z.object({
  requirement: z.string(),
  userNeed: z.string(),
  description: z.string(),
  priority: z.enum(['must', 'should', 'could']),
  acceptanceCriteria: z.array(z.string()).min(1).max(6),
  dependencies: z.array(z.string()).max(5),
  assumptions: z.array(z.string()).max(5),
})
export const productRequirementsSchema = z.object({
  items: z.array(requirementItemSchema).min(5).max(20),
})
export type RequirementItem = z.infer<typeof requirementItemSchema>
export type ProductRequirements = z.infer<typeof productRequirementsSchema>

export const designConfidenceSchema = z.object({
  problemClarity: z.number().min(0).max(100),
  evidenceStrength: z.number().min(0).max(100),
  solutionFit: z.number().min(0).max(100),
  feasibilityConfidence: z.number().min(0).max(100),
  validationStatus: z.string().describe('Plain language: what has and has not actually been validated so far.'),
  summary: z.string(),
})
export type DesignConfidence = z.infer<typeof designConfidenceSchema>

// ---------------------------------------------------------------------------
// Readiness (shared shape for Discover, Define, Ideate and Solution critique)
// ---------------------------------------------------------------------------

export const readinessResultSchema = z.object({
  score: z.number().min(0).max(100),
  strengths: z.array(z.string()).max(6),
  gaps: z.array(z.string()).max(6),
  criticalAssumptions: z.array(z.string()).max(6),
  recommendation: z.string(),
  recommendedAction: z.enum(['proceed', 'resolve_gaps']),
})
export type ReadinessResult = z.infer<typeof readinessResultSchema>
