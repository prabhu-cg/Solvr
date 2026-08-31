import type { z } from 'zod'
import type { AIProjectContext } from './context.js'
import {
  assumptionsSchema,
  conceptsSchema,
  hmwSchema,
  insightsSchema,
  interviewQuestionsSchema,
  opportunitiesSchema,
  painPointsSchema,
  personaSchema,
  prioritisationSchema,
  problemStatementSchema,
  readinessResultSchema,
  recommendationSchema,
  researchPlanSchema,
  researchSynthesisSchema,
  surveyQuestionsSchema,
  userJourneySchema,
  userNeedsSchema,
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

export type AITaskId =
  | `discover.${DiscoverTaskLocalId}`
  | `define.${DefineTaskLocalId}`
  | `ideate.${IdeateTaskLocalId}`

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
  if (Object.keys(context.priorAcceptedDeliverables).length > 0) {
    lines.push(`Accepted outputs from earlier stages (JSON):\n${JSON.stringify(context.priorAcceptedDeliverables)}`)
  }
  if (Object.keys(context.currentStageDeliverables).length > 0) {
    lines.push(`This stage's other outputs so far (JSON):\n${JSON.stringify(context.currentStageDeliverables)}`)
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
}

export const READINESS_TASK_INSTRUCTION: Record<'discover' | 'define' | 'ideate', string> = {
  discover:
    'Assess this project\'s Discover-stage readiness. Evaluate: problem context, target users, research questions, evidence, assumptions, and research gaps. Give a 0-100 score, strengths, gaps, critical unvalidated assumptions, a short recommendation written to the user, and a recommendedAction of "proceed" or "resolve_gaps". Do not hard-block — "resolve_gaps" is a recommendation, not a lock.',
  define:
    'Critique this project\'s Define-stage outputs. Look specifically for: unsupported assumptions, weak evidence, a solution disguised as a problem, missing context, contradictions between outputs, over-generalisation, and a poorly formulated How Might We. Give a 0-100 score, strengths, gaps, critical unvalidated assumptions, a short recommendation, and a recommendedAction of "proceed" or "resolve_gaps".',
  ideate:
    'Assess this project\'s Ideate-stage readiness. Evaluate whether: opportunities were identified, multiple genuinely distinct concepts were explored, concepts were compared/scored, risks were identified, assumptions were identified, and a direction was selected. Give a 0-100 score, strengths, gaps, critical unvalidated assumptions, a short recommendation, and a recommendedAction of "proceed" or "resolve_gaps". Do not require certainty or a perfect score — uncertainty at this stage is normal; the score should reflect how well-explored the options are, not how confident the outcome is.',
}

export const READINESS_SCHEMA = readinessResultSchema
