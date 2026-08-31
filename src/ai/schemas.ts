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
    .optional()
    .describe(
      'Required and must read "No primary research has been provided. Generated items are hypotheses or assumptions rather than validated findings." when hasEvidence is false.',
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
// Readiness (shared shape for Discover and Define critique)
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
