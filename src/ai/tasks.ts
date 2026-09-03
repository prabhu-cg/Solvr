import type { z } from 'zod'
import type { AIProjectContext } from './context.js'
import {
  assumptionsSchema,
  conceptsSchema,
  designConfidenceSchema,
  findingsSchema,
  heuristicReviewSchema,
  hmwSchema,
  impactAnalysisSchema,
  informationArchitectureSchema,
  insightsSchema,
  interviewQuestionsSchema,
  iterationRecommendationsSchema,
  opportunitiesSchema,
  painPointsSchema,
  patternsSchema,
  personaSchema,
  prioritisationSchema,
  prioritisedIssuesSchema,
  problemStatementSchema,
  productRequirementsSchema,
  readinessResultSchema,
  recommendationSchema,
  requirementProposalsSchema,
  researchPlanSchema,
  researchSynthesisSchema,
  screenListSchema,
  screenSpecProposalsSchema,
  successCriteriaSchema,
  surveyQuestionsSchema,
  testScenariosSchema,
  testTasksSchema,
  themesSchema,
  usabilityTestPlanSchema,
  userFlowProposalsSchema,
  userFlowSchema,
  userJourneySchema,
  userNeedsSchema,
  validationInsightsSchema,
  validationInterviewQuestionsSchema,
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

export type ValidateTaskLocalId =
  | 'testPlan'
  | 'testScenarios'
  | 'testTasks'
  | 'interviewQuestions'
  | 'successCriteria'
  | 'heuristicReview'
  | 'themes'
  | 'patterns'
  | 'prioritisedIssues'
  | 'insights'
  | 'findings'

export type IterateTaskLocalId =
  | 'impactAnalysis'
  | 'recommendations'
  | 'userFlowProposals'
  | 'screenSpecProposals'
  | 'requirementProposals'

export type AITaskId =
  | `discover.${DiscoverTaskLocalId}`
  | `define.${DefineTaskLocalId}`
  | `ideate.${IdeateTaskLocalId}`
  | `solution.${SolutionTaskLocalId}`
  | `validate.${ValidateTaskLocalId}`
  | `iterate.${IterateTaskLocalId}`

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
export const AI_SYSTEM_PROMPT = `You are Solvr's Discover/Define/Ideate/Solution/Validate/Iterate engine — an evidence-aware product design partner embedded in a structured design tool.

Always follow these rules:
- Never invent interviews, participants, direct quotes, statistics, or research results that were not supplied in the project context.
- If no real evidence was supplied, generated items are hypotheses or assumptions, not validated findings — say so plainly rather than presenting them as fact.
- Solvr does not conduct usability testing, interviews, or heuristic reviews itself — Validate-stage preparation outputs (test plan, scenarios, tasks, interview questions, success criteria, heuristic review) are for testing the user will do outside the tool. Never phrase one as though testing, an interview, or a review has already happened.
- When analysing validation evidence (themes, patterns, prioritised issues, insights, findings), every item must cite the exact "id" values of the evidence it is based on — never invent an evidence id, and never invent a participant, session, quote, or result beyond what the supplied evidence actually contains. If the evidence doesn't support a conclusion, don't generate it.
- Iterate-stage outputs (impact analysis, recommendations, proposed updates) are proposals only — every item must cite the exact "id" values of the selected findings it is grounded in, never invent a finding id, and never claim a Solution deliverable has already been changed. Only the user's explicit Accept changes anything.
- Do not claim every finding affects every deliverable — identify only genuinely relevant impacts, and skip a deliverable entirely when a finding has no real bearing on it.
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

export function truncateContextJson(value: unknown, maxChars: number = MAX_CONTEXT_JSON_CHARS): string {
  const full = JSON.stringify(value)
  if (full.length <= maxChars) return full
  return `${full.slice(0, maxChars)}… [cut off here only because of a prompt-length limit — this is not a gap in the actual project, so do not report it as missing or incomplete]`
}

/** Evidence is the primary input for Validate's Analyse tasks, not supplementary context — give it more room than the generic cap. */
const MAX_EVIDENCE_JSON_CHARS = 6000

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
  if (context.validationEvidence) {
    lines.push(
      context.validationEvidence.length > 0
        ? `Validation evidence supplied by the user (JSON) — each item has a stable "id"; reference these exact ids in supportingEvidenceIds and never invent new ones:\n${truncateContextJson(context.validationEvidence, MAX_EVIDENCE_JSON_CHARS)}`
        : 'No validation evidence has been supplied yet.',
    )
  }
  if (context.knownGaps.length) lines.push(`Known gaps from a previous readiness review: ${context.knownGaps.join('; ')}`)
  if (context.knownAssumptions.length) {
    lines.push(`Known critical assumptions from a previous readiness review: ${context.knownAssumptions.join('; ')}`)
  }
  if (context.selectedFindings) {
    lines.push(
      context.selectedFindings.length > 0
        ? `Accepted findings selected by the user for this iteration (JSON) — each item has a stable "id"; reference these exact ids in findingIds and never invent new ones:\n${truncateContextJson(context.selectedFindings, MAX_EVIDENCE_JSON_CHARS)}`
        : 'No findings have been selected for this iteration yet.',
    )
  }
  if (context.currentSolutionContent) {
    lines.push(
      Object.keys(context.currentSolutionContent).length > 0
        ? `The current Solution-stage content this iteration proposes changes against (JSON):\n${truncateContextJson(context.currentSolutionContent, MAX_EVIDENCE_JSON_CHARS)}`
        : 'No Solution-stage content has been generated yet.',
    )
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
  'validate.testPlan': {
    id: 'validate.testPlan',
    stage: 'validate',
    localId: 'testPlan',
    label: 'Usability Test Plan',
    schema: usabilityTestPlanSchema,
    taskInstruction:
      'Produce a usability test plan for validating the solution built in this project, grounded in the project brief, the selected concept, and the Solution-stage deliverables (information architecture, user flow, screen list, wireframe specs, product requirements). Cover: objective, research goals, validation goals, target participants, a realistic suggested number of participants, testing method, test format, session duration, moderator guidance, materials required, and risks or considerations. This is a plan for testing to be conducted outside Solvr — do not imply testing has happened.',
  },
  'validate.testScenarios': {
    id: 'validate.testScenarios',
    stage: 'validate',
    localId: 'testScenarios',
    label: 'Test Scenarios',
    schema: testScenariosSchema,
    taskInstruction:
      'Produce realistic test scenarios specific to this project\'s users, product and solution — never generic placeholders. For each: a title, the user\'s context, the situation they are in, their goal, and the relevant assumptions the scenario rests on. Ground each scenario in the selected concept and user flow where possible.',
  },
  'validate.testTasks': {
    id: 'validate.testTasks',
    stage: 'validate',
    localId: 'testTasks',
    label: 'Test Tasks',
    schema: testTasksSchema,
    taskInstruction:
      'Produce practical usability test tasks derived from the user flow and screen list. For each: a title, a user instruction, the expected outcome, and what the task is evaluating. Instructions must describe the user\'s goal, never the exact UI control to use — do not reveal the solution or give leading step-by-step directions (e.g. write "add the documents required to complete your application", never "click the Upload button").',
  },
  'validate.interviewQuestions': {
    id: 'validate.interviewQuestions',
    stage: 'validate',
    localId: 'interviewQuestions',
    label: 'Interview Questions',
    schema: validationInterviewQuestionsSchema,
    taskInstruction:
      'Produce post/pre-test interview questions grouped into: before testing (background, previous experience, expectations), during testing (understanding, decision making, confidence, confusion, expectations), and after testing (overall experience, difficulties, confidence, satisfaction, improvement suggestions). Questions must be open-ended, neutral and non-leading, and specific to this project — avoid unnecessary generic questions.',
  },
  'validate.successCriteria': {
    id: 'validate.successCriteria',
    stage: 'validate',
    localId: 'successCriteria',
    label: 'Success Criteria',
    schema: successCriteriaSchema,
    taskInstruction:
      'Produce measurable success criteria for the validation testing, derived from the product requirements and business goal. For each: the criterion, how it will be measured (e.g. task completion, task success, time on task, error rate, user confidence, user satisfaction), a target to aim for, and the reason it matters. These are targets to test against, not results — testing has not happened yet.',
  },
  'validate.heuristicReview': {
    id: 'validate.heuristicReview',
    stage: 'validate',
    localId: 'heuristicReview',
    label: 'Heuristic Review',
    schema: heuristicReviewSchema,
    taskInstruction:
      'Produce a heuristic review checklist adapted to this project\'s screens and flow, using recognised UX heuristics (e.g. visibility of system status, match between system and the real world, user control and freedom, consistency and standards, error prevention, recognition rather than recall, flexibility and efficiency, minimalist design, help users recover from errors, help and documentation). For each: the heuristic, a concrete review question, the relevant screen or flow from the Solution stage, and the potential risk if it fails. This is a checklist to use during a review the user will conduct outside Solvr — never phrase it as though the review has already happened.',
  },
  'validate.themes': {
    id: 'validate.themes',
    stage: 'validate',
    localId: 'themes',
    label: 'Themes',
    schema: themesSchema,
    taskInstruction:
      'Identify meaningful themes across the validation evidence supplied (e.g. navigation, content clarity, information architecture, error prevention, form completion, user confidence, accessibility). Every theme must be grounded in the supplied evidence — reference the exact "id" values from that evidence in supportingEvidenceIds, and never invent evidence, participants, sessions or results that were not supplied. If no evidence was supplied, return no items and use contextNote to say so plainly.',
  },
  'validate.patterns': {
    id: 'validate.patterns',
    stage: 'validate',
    localId: 'patterns',
    label: 'Patterns',
    schema: patternsSchema,
    taskInstruction:
      'Identify repeated or related behaviours and problems across the validation evidence. For each pattern: a title, a description, the exact supporting evidence ids it is based on, and a confidence level (high/medium/low) reflecting the strength, number and consistency of the supporting evidence. Do not pretend statistical certainty from a small number of items.',
  },
  'validate.prioritisedIssues': {
    id: 'validate.prioritisedIssues',
    stage: 'validate',
    localId: 'prioritisedIssues',
    label: 'Prioritised Issues',
    schema: prioritisedIssuesSchema,
    taskInstruction:
      'Produce a prioritised list of issues drawn from the validation evidence. For each: the issue, a priority (high/medium/low) based on severity, impact, frequency where the evidence shows recurrence, and relevance to the project goal; a severity (critical/high/medium/low — critical prevents completion of an essential task, high significantly impacts the experience or task completion, medium creates noticeable friction users can usually recover from, low is a minor issue); the exact supporting evidence ids; and a rationale explaining the reasoning. Do not automatically treat every issue as high severity.',
  },
  'validate.insights': {
    id: 'validate.insights',
    stage: 'validate',
    localId: 'insights',
    label: 'Insights',
    schema: validationInsightsSchema,
    taskInstruction:
      'Produce synthesised UX insights from the validation evidence that go beyond repeating an observation — explain what the evidence means, not just what it shows (e.g. evidence: "multiple users struggled to locate the document upload step" → insight: "the upload step does not align with when users expect to provide supporting information"). For each: the insight and the exact supporting evidence ids it is grounded in. Do not generate generic UX advice that is not tied to the supplied evidence.',
  },
  'validate.findings': {
    id: 'validate.findings',
    stage: 'validate',
    localId: 'findings',
    label: 'Findings',
    schema: findingsSchema,
    taskInstruction:
      'Draft candidate findings synthesised from the validation evidence and from any themes, patterns, prioritised issues and insights already generated for this stage (see this stage\'s other outputs so far). For each: a title, a description, the theme it relates to (empty string if none), a severity, a priority, the exact supporting evidence ids, and the insight behind it. These are drafts only, for the user to review, edit, accept or reject — never present them as already-validated conclusions or as if research has been formally conducted.',
  },
  'iterate.impactAnalysis': {
    id: 'iterate.impactAnalysis',
    stage: 'iterate',
    localId: 'impactAnalysis',
    label: 'Impact Analysis',
    schema: impactAnalysisSchema,
    taskInstruction:
      'Using only the accepted findings the user selected, identify which existing Solution deliverables may need to change (recommendedSolution, userFlow, informationArchitecture, screenList, screenSpecifications, productRequirements). For each impact: the affected deliverable, what may need to change, and the reason — tied directly to one or more of the selected findings via their exact ids. Only list a deliverable when a finding genuinely bears on it; do not claim every finding affects every deliverable, and do not force an Information Architecture impact unless a finding genuinely affects IA.',
  },
  'iterate.recommendations': {
    id: 'iterate.recommendations',
    stage: 'iterate',
    localId: 'recommendations',
    label: 'Recommended Changes',
    schema: iterationRecommendationsSchema,
    taskInstruction:
      'Produce specific, actionable recommended changes grounded in the selected findings and the impact analysis already generated for this stage (if any). Each recommendation must be concrete enough to act on — never generic advice like "improve navigation" (instead, e.g. "move document upload immediately after application details and explain why supporting documents are required"). For each: a title, a description, the problem it addresses, the exact ids of the findings it responds to, the expected benefit, and which Solution deliverables it affects.',
  },
  'iterate.userFlowProposals': {
    id: 'iterate.userFlowProposals',
    stage: 'iterate',
    localId: 'userFlowProposals',
    label: 'Updated User Flow',
    schema: userFlowProposalsSchema,
    taskInstruction:
      'Propose ONE revised version of the current Solution user flow (see the current Solution-stage content supplied) that addresses the selected findings. Produce exactly one proposal: the exact ids of the findings it responds to, a rationale, and the full proposed user flow (main path plus any alternate/error-recovery paths). This is a proposal only — it does not change the live Solution deliverable unless the user explicitly accepts it, so never imply the flow has already been updated. If no Solution user flow exists yet, propose a flow that reflects the fix directly.',
  },
  'iterate.screenSpecProposals': {
    id: 'iterate.screenSpecProposals',
    stage: 'iterate',
    localId: 'screenSpecProposals',
    label: 'Updated Screen Specifications',
    schema: screenSpecProposalsSchema,
    taskInstruction:
      'Propose changes to the screens (from the current Solution wireframe specs) affected by the selected findings. For each proposal: the exact finding ids it responds to, the screen name (matching an existing screen where possible), the type of change (add_section, remove_section, modify_content, modify_interaction, add_guidance, improve_error_handling, or change_hierarchy), a rationale, and the full proposed wireframe specification for that screen. Only propose changes for screens genuinely affected — do not touch unrelated screens. This is a proposal only; never imply the specification has already changed.',
  },
  'iterate.requirementProposals': {
    id: 'iterate.requirementProposals',
    stage: 'iterate',
    localId: 'requirementProposals',
    label: 'Updated Product Requirements',
    schema: requirementProposalsSchema,
    taskInstruction:
      'Propose changes to the product requirements (from the current Solution product requirements) affected by the selected findings, or genuinely new requirements the findings surface. For each: the exact finding ids it responds to, the exact existing requirement text being targeted (empty string only if this is a new requirement), the proposed change in plain language, a rationale, and the full proposed requirement object (including its own acceptance criteria). This is a proposal only; never imply the requirement has already changed.',
  },
}

export const READINESS_TASK_INSTRUCTION: Record<'discover' | 'define' | 'ideate' | 'solution' | 'validate' | 'iterate', string> = {
  discover:
    'Assess this project\'s Discover-stage readiness. Evaluate: problem context, target users, research questions, evidence, assumptions, and research gaps. Give a 0-100 score, strengths, gaps, critical unvalidated assumptions, a short recommendation written to the user, and a recommendedAction of "proceed" or "resolve_gaps". Do not hard-block — "resolve_gaps" is a recommendation, not a lock.',
  define:
    'Critique this project\'s Define-stage outputs. Look specifically for: unsupported assumptions, weak evidence, a solution disguised as a problem, missing context, contradictions between outputs, over-generalisation, and a poorly formulated How Might We. Give a 0-100 score, strengths, gaps, critical unvalidated assumptions, a short recommendation, and a recommendedAction of "proceed" or "resolve_gaps".',
  ideate:
    'Assess this project\'s Ideate-stage readiness. Evaluate whether: opportunities were identified, multiple genuinely distinct concepts were explored, concepts were compared/scored, risks were identified, assumptions were identified, and a direction was selected. Give a 0-100 score, strengths, gaps, critical unvalidated assumptions, a short recommendation, and a recommendedAction of "proceed" or "resolve_gaps". Do not require certainty or a perfect score — uncertainty at this stage is normal; the score should reflect how well-explored the options are, not how confident the outcome is.',
  solution:
    'Assess this project\'s Solution-stage readiness. Evaluate whether: the information architecture is coherent, the user flow is practical and covers error/alternate paths, the screen list is complete relative to the flow, wireframe specs cover the primary screens, and product requirements are concrete and prioritised. Give a 0-100 score, strengths, gaps, critical unvalidated assumptions, a short recommendation, and a recommendedAction of "proceed" or "resolve_gaps". This is about how well-specified the solution is, not whether it has been tested with real users.',
  validate:
    'Assess how well-prepared this project is for validation, and — only if evidence has actually been supplied — how well that evidence has been analysed so far. Never claim testing, analysis or a review happened unless the supplied context shows it did. Evaluate whether: a usability test plan exists and is well-scoped, test scenarios and tasks are specific to this project rather than generic, interview questions are neutral and non-leading, success criteria are measurable and tied to the product requirements, a heuristic review checklist covers the relevant screens, and — if evidence has been added — whether it has been analysed (themes/patterns/prioritised issues/insights) and whether any generated findings have actually been reviewed (accepted or rejected) rather than left as drafts. Give a 0-100 score, strengths, gaps, critical unvalidated assumptions, a short recommendation, and a recommendedAction of "proceed" or "resolve_gaps".',
  iterate:
    'Assess how well this project\'s iteration work has progressed — NOT whether the Solution has actually been changed, unless the supplied context shows a proposal was genuinely accepted. Evaluate whether: findings were selected for analysis, an impact analysis was generated identifying genuinely relevant affected deliverables, recommended changes are specific and traceable to findings, and any generated proposals (user flow, screen specifications, product requirements) have actually been reviewed (accepted, edited, or rejected) rather than left as drafts. Give a 0-100 score, strengths, gaps, critical unvalidated assumptions, a short recommendation, and a recommendedAction of "proceed" or "resolve_gaps".',
}

export const READINESS_SCHEMA = readinessResultSchema
