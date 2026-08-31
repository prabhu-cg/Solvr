import type { z } from 'zod'
import type { AIProjectContext } from './context.js'
import {
  assumptionsSchema,
  conceptsSchema,
  designConfidenceSchema,
  hmwSchema,
  informationArchitectureSchema,
  insightsSchema,
  interviewQuestionsSchema,
  opportunitiesSchema,
  painPointsSchema,
  personaSchema,
  prioritisationSchema,
  problemStatementSchema,
  productRequirementsSchema,
  readinessResultSchema,
  recommendationSchema,
  researchPlanSchema,
  researchSynthesisSchema,
  screenListSchema,
  surveyQuestionsSchema,
  userFlowSchema,
  userJourneySchema,
  userNeedsSchema,
  wireframeSpecsSchema,
} from './schemas.js'
import type { StageKey } from '../data/models.js'

export type DiscoverTaskLocalId =
  | 'researchPlan'
  | 'interviewQuestions'
  | 'surveyQuestions'
  | 'assumptions'
  | 'researchSynthesis'

export type DefineTaskLocalId =
  | 'insights'
  | 'userNeeds'
  | 'painPoints'
  | 'persona'
  | 'userJourney'
  | 'problemStatement'
  | 'hmw'

export type IdeateTaskLocalId = 'opportunities' | 'concepts' | 'prioritisation' | 'recommendation'

export type SolutionTaskLocalId =
  | 'informationArchitecture'
  | 'userFlow'
  | 'screenList'
  | 'wireframeSpecs'
  | 'productRequirements'
  | 'designConfidence'

export type AITaskId =
  | `discover.${DiscoverTaskLocalId}`
  | `define.${DefineTaskLocalId}`
  | `ideate.${IdeateTaskLocalId}`
  | `solution.${SolutionTaskLocalId}`

export interface AITaskDefinition<T = unknown> {
  id: AITaskId
  stage: StageKey
  localId: string
  label: string
  schema: z.ZodType<T>
  taskInstruction: string
}

/**
 * Every rule here applies to every deliverable — kept separate from each
 * task's specific instruction so it can't be dropped by accident.
 * (Section 3, 5: structured output, never fabricate research.)
 */
export const AI_SYSTEM_PROMPT = `You are Solvr's Discover/Define/Ideate engine — an evidence-aware product design partner embedded in a structured design tool.

Always follow these rules:
- Never invent interviews, participants, direct quotes, statistics, or research results that were not supplied in the project context.
- If no real evidence was supplied, generated items are hypotheses or assumptions, not validated findings — say so plainly rather than presenting them as fact.
- When asked to tag content by type, use exactly: "evidence" only for information directly supplied by the user, "assumption" for an unverified belief, "inference" for a conclusion you drew from the available information, "recommendation" for a suggestion you are making.
- Be concrete and specific to this project. Avoid generic output that could apply to any project.
- Keep language plain, neutral and non-leading — especially in interview/survey questions.
- Do not invent demographics, frequencies, market sizes, or statistics that were not supplied.
- When generating multiple concepts, make them genuinely different approaches, not superficial variations of the same idea — vary the underlying mechanism, not just the wording.
- Any numeric score you produce is your own assessment, not a measurement — never imply it came from real data unless it did.
- Respond only with the structured object requested — no extra commentary.`

/**
 * Later stages accumulate context from every earlier one, and small models
 * on tight per-minute token budgets (the free tier this runs on by default)
 * can reject an oversized request outright. Rather than let a rich project
 * hard-fail once it reaches Ideate/Solution, cap each JSON context block —
 * a truncated-but-present block still grounds the model far better than no
 * context at all, and reliability comes first (Section 14).
 */
const MAX_CONTEXT_JSON_CHARS = 3000

export function truncateContextJson(value: unknown): string {
  const full = JSON.stringify(value)
  if (full.length <= MAX_CONTEXT_JSON_CHARS) return full
  return `${full.slice(0, MAX_CONTEXT_JSON_CHARS)}… [cut off here only because of a prompt-length limit — this is not a gap in the actual project, so do not report it as missing or incomplete]`
}

function describeContext(context: AIProjectContext): string {
  const p = context.project
  const lines = [
    `Project: ${p.name}`,
    `Problem: ${p.problem}`,
    `Product/service: ${p.productService}`,
    `Target users: ${p.targetUsers}`,
    `Business goal: ${p.businessGoal}`,
  ]
  if (p.constraints) lines.push(`Constraints: ${p.constraints}`)
  lines.push(
    p.evidence
      ? `Existing evidence supplied by the user:\n${p.evidence}`
      : 'No existing evidence, research notes or interview data was supplied for this project.',
  )
  if (context.selectedConcept) {
    lines.push(`The concept selected to build the solution from (JSON):\n${truncateContextJson(context.selectedConcept)}`)
  }
  if (Object.keys(context.priorAcceptedDeliverables).length > 0) {
    lines.push(`Accepted outputs from earlier stages (JSON):\n${truncateContextJson(context.priorAcceptedDeliverables)}`)
  }
  if (Object.keys(context.currentStageDeliverables).length > 0) {
    lines.push(`This stage's other outputs so far (JSON):\n${truncateContextJson(context.currentStageDeliverables)}`)
  }
  if (context.knownGaps.length) lines.push(`Known gaps from a previous readiness review: ${context.knownGaps.join('; ')}`)
  if (context.knownAssumptions.length) {
    lines.push(`Known critical assumptions from a previous readiness review: ${context.knownAssumptions.join('; ')}`)
  }
  return lines.join('\n')
}

export function buildTaskPrompt(
  task: AITaskDefinition,
  context: AIProjectContext,
  instruction?: string,
): { instructions: string; prompt: string } {
  const parts = [describeContext(context), task.taskInstruction]
  if (instruction?.trim()) {
    parts.push(`Additional instruction from the user: ${instruction.trim()}`)
  }
  return { instructions: AI_SYSTEM_PROMPT, prompt: parts.join('\n\n') }
}

export const AI_TASKS: Record<AITaskId, AITaskDefinition> = {
  'discover.researchPlan': {
    id: 'discover.researchPlan',
    stage: 'discover',
    localId: 'researchPlan',
    label: 'Research Plan',
    schema: researchPlanSchema,
    taskInstruction:
      'Produce a research plan for the Discover stage of this project: objectives, key questions, recommended methods, target participants, a realistic suggested sample size, evidence required, and expected outputs.',
  },
  'discover.interviewQuestions': {
    id: 'discover.interviewQuestions',
    stage: 'discover',
    localId: 'interviewQuestions',
    label: 'Interview Questions',
    schema: interviewQuestionsSchema,
    taskInstruction:
      'Produce interview questions organised by: opening, context, behaviour, current experience, pain points, motivation, closing. Questions must be neutral and non-leading — never presuppose an answer or a solution.',
  },
  'discover.surveyQuestions': {
    id: 'discover.surveyQuestions',
    stage: 'discover',
    localId: 'surveyQuestions',
    label: 'Survey Questions',
    schema: surveyQuestionsSchema,
    taskInstruction:
      'Produce survey questions organised by: screening, behaviour, experience, pain points, satisfaction, and open-ended questions. Avoid biased or leading phrasing.',
  },
  'discover.assumptions': {
    id: 'discover.assumptions',
    stage: 'discover',
    localId: 'assumptions',
    label: 'Assumptions',
    schema: assumptionsSchema,
    taskInstruction:
      'List the assumptions currently being made about this problem (3 to 8). For each: the assumption itself, why it matters, your confidence in it, the potential impact if it turns out wrong, and how it could be validated.',
  },
  'discover.researchSynthesis': {
    id: 'discover.researchSynthesis',
    stage: 'discover',
    localId: 'researchSynthesis',
    label: 'Research Synthesis',
    schema: researchSynthesisSchema,
    taskInstruction:
      'Synthesise the evidence supplied into observations, findings, themes and insights. If no real evidence or research notes were supplied, set hasEvidence to false, leave those lists sparse or empty, and set disclaimer to exactly: "No primary research has been provided. Generated items are hypotheses or assumptions rather than validated findings." Tag every item with its correct type — never present a hypothesis as evidence.',
  },
  'define.insights': {
    id: 'define.insights',
    stage: 'define',
    localId: 'insights',
    label: 'Insights',
    schema: insightsSchema,
    taskInstruction:
      'Produce 2-6 insights connecting what was discovered to what it means for this project. Each insight must state what it is based on (evidence field), which user need it relates to, and your confidence.',
  },
  'define.userNeeds': {
    id: 'define.userNeeds',
    stage: 'define',
    localId: 'userNeeds',
    label: 'User Needs',
    schema: userNeedsSchema,
    taskInstruction:
      'Identify 2-6 user needs. For each: which user, the need itself, the context it arises in, how important it appears to be, and the evidence it is based on.',
  },
  'define.painPoints': {
    id: 'define.painPoints',
    stage: 'define',
    localId: 'painPoints',
    label: 'Pain Points',
    schema: painPointsSchema,
    taskInstruction:
      'Identify 2-6 pain points. For each: the pain point, which user experiences it, its impact, and the evidence for it. Do not invent a frequency or percentage unless one was supplied.',
  },
  'define.persona': {
    id: 'define.persona',
    stage: 'define',
    localId: 'persona',
    label: 'Persona',
    schema: personaSchema,
    taskInstruction:
      'Produce one lightweight, evidence-based persona: user type, context, goals, needs, behaviours, pain points, motivations, and what it is grounded in. Do not invent demographic details (age, gender, location, etc.) unless they were supplied.',
  },
  'define.userJourney': {
    id: 'define.userJourney',
    stage: 'define',
    localId: 'userJourney',
    label: 'User Journey',
    schema: userJourneySchema,
    taskInstruction:
      'Produce a user journey of 3-8 stages. For each: the user\'s goal, their action, their experience, a pain point, and an opportunity.',
  },
  'define.problemStatement': {
    id: 'define.problemStatement',
    stage: 'define',
    localId: 'problemStatement',
    label: 'Problem Statement',
    schema: problemStatementSchema,
    taskInstruction:
      'Produce a concise problem statement: user, context, problem, and impact — plus a short rationale for why this framing follows from what was discovered and defined so far.',
  },
  'define.hmw': {
    id: 'define.hmw',
    stage: 'define',
    localId: 'hmw',
    label: 'How Might We',
    schema: hmwSchema,
    taskInstruction:
      'Produce 3-5 solution-neutral "How might we" questions arising from the problem statement and insights. Recommend the single strongest one and explain why.',
  },
  'ideate.opportunities': {
    id: 'ideate.opportunities',
    stage: 'ideate',
    localId: 'opportunities',
    label: 'Opportunities',
    schema: opportunitiesSchema,
    taskInstruction:
      'Generate 3-8 opportunities drawn from the accepted insights, user needs, pain points, problem statement and How Might We questions from Define. For each: the opportunity itself, which user need it responds to, the supporting evidence, and its potential impact. Do not jump to solutions yet — these are opportunity areas, not concepts.',
  },
  'ideate.concepts': {
    id: 'ideate.concepts',
    stage: 'ideate',
    localId: 'concepts',
    label: 'Concepts',
    schema: conceptsSchema,
    taskInstruction:
      'Generate 3-5 substantially different solution concepts responding to the accepted opportunities. Each must take a genuinely different approach — do not produce superficial variations of the same idea. For each concept: name, description, user value, business value, key functionality, advantages, risks, dependencies, open questions, supporting evidence (which opportunities/insights it responds to), and key assumptions.',
  },
  'ideate.prioritisation': {
    id: 'ideate.prioritisation',
    stage: 'ideate',
    localId: 'prioritisation',
    label: 'Prioritisation',
    schema: prioritisationSchema,
    taskInstruction:
      'Score every concept generated so far on: user value, business value, feasibility, and complexity/risk (1-10 each, complexity/risk where higher means more complex or risky). For each concept, give a short reasoning statement covering all four scores so the user can see exactly why it was scored that way. These are your own assessments, not measurements from real data.',
  },
  'ideate.recommendation': {
    id: 'ideate.recommendation',
    stage: 'ideate',
    localId: 'recommendation',
    label: 'Recommendation',
    schema: recommendationSchema,
    taskInstruction:
      'Recommend exactly one concept from those generated so far (recommendedConceptName must match a concept name exactly). Explain the reasoning, referencing the prioritisation scores and evidence. List the evidence supporting it, the key assumptions it rests on, its risks, and open questions still to resolve before committing further.',
  },
  'solution.informationArchitecture': {
    id: 'solution.informationArchitecture',
    stage: 'solution',
    localId: 'informationArchitecture',
    label: 'Information Architecture',
    schema: informationArchitectureSchema,
    taskInstruction:
      'Using the selected concept as the foundation, produce an information architecture: a tree of product areas, their sections, and pages/screens within each. Also list primary navigation, and secondary navigation only where it is genuinely meaningful (leave it empty otherwise).',
  },
  'solution.userFlow': {
    id: 'solution.userFlow',
    stage: 'solution',
    localId: 'userFlow',
    label: 'User Flow',
    schema: userFlowSchema,
    taskInstruction:
      'Produce the primary user flow for the selected concept as a sequence of steps (start, action, decision, screen, completion). Include realistic decision points, at least one alternate path, and at least one error/recovery path. Keep it understandable and practical — do not over-complicate it.',
  },
  'solution.screenList': {
    id: 'solution.screenList',
    stage: 'solution',
    localId: 'screenList',
    label: 'Screen List',
    schema: screenListSchema,
    taskInstruction:
      'Produce the list of screens implied by the information architecture and user flow. For each: its purpose, the user\'s goal on it, its primary action, key content, and which flow step it corresponds to.',
  },
  'solution.wireframeSpecs': {
    id: 'solution.wireframeSpecs',
    stage: 'solution',
    localId: 'wireframeSpecs',
    label: 'Wireframe Specification',
    schema: wireframeSpecsSchema,
    taskInstruction:
      'Do NOT generate a visual wireframe. Produce a structured wireframe specification for each primary screen only (pick the 3-6 most important from the screen list): purpose, layout (structural regions, described in words), content, components, interactions, only the relevant states (from default/loading/empty/error/success/disabled), and meaningful accessibility considerations.',
  },
  'solution.productRequirements': {
    id: 'solution.productRequirements',
    stage: 'solution',
    localId: 'productRequirements',
    label: 'Product Requirements',
    schema: productRequirementsSchema,
    taskInstruction:
      'Produce concise, implementation-oriented product requirements covering the selected concept. For each: the requirement, the user need it serves, a short description, priority (must/should/could), acceptance criteria, dependencies, and assumptions. Cover a realistic mix of must/should/could — not everything can be "must have".',
  },
  'solution.designConfidence': {
    id: 'solution.designConfidence',
    stage: 'solution',
    localId: 'designConfidence',
    label: 'Design Confidence',
    schema: designConfidenceSchema,
    taskInstruction:
      'Assess design confidence — NOT a validation score. Score 0-100 on: problem clarity, evidence strength, solution fit, and feasibility confidence, each independently. State plainly, in validationStatus, what has and has not actually been validated (this solution has NOT been usability tested — say so explicitly). Write a short summary. Never imply the solution has been validated with real users.',
  },
}

export const READINESS_TASK_INSTRUCTION: Record<'discover' | 'define' | 'ideate' | 'solution', string> = {
  discover:
    'Assess this project\'s Discover-stage readiness. Evaluate: problem context, target users, research questions, evidence, assumptions, and research gaps. Give a 0-100 score, strengths, gaps, critical unvalidated assumptions, a short recommendation written to the user, and a recommendedAction of "proceed" or "resolve_gaps". Do not hard-block — "resolve_gaps" is a recommendation, not a lock.',
  define:
    'Critique this project\'s Define-stage outputs. Look specifically for: unsupported assumptions, weak evidence, a solution disguised as a problem, missing context, contradictions between outputs, over-generalisation, and a poorly formulated How Might We. Give a 0-100 score, strengths, gaps, critical unvalidated assumptions, a short recommendation, and a recommendedAction of "proceed" or "resolve_gaps".',
  ideate:
    'Assess this project\'s Ideate-stage readiness. Evaluate whether: opportunities were identified, multiple genuinely distinct concepts were explored, concepts were compared/scored, risks were identified, assumptions were identified, and a direction was selected. Give a 0-100 score, strengths, gaps, critical unvalidated assumptions, a short recommendation, and a recommendedAction of "proceed" or "resolve_gaps". Do not require certainty or a perfect score — uncertainty at this stage is normal; the score should reflect how well-explored the options are, not how confident the outcome is.',
  solution:
    'Assess this project\'s Solution-stage readiness. Evaluate whether: the information architecture is coherent, the user flow is practical and covers error/alternate paths, the screen list is complete relative to the flow, wireframe specs cover the primary screens, and product requirements are concrete and prioritised. Give a 0-100 score, strengths, gaps, critical unvalidated assumptions, a short recommendation, and a recommendedAction of "proceed" or "resolve_gaps". This is about how well-specified the solution is, not whether it has been tested with real users.',
}

export const READINESS_SCHEMA = readinessResultSchema
