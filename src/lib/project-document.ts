import type {
  Assumptions,
  Concepts,
  DesignConfidence,
  HMW,
  InformationArchitecture,
  InsightItem,
  Insights,
  InterviewQuestions,
  Opportunities,
  PainPointItem,
  PainPoints,
  Persona,
  Prioritisation,
  ProblemStatement,
  ProductRequirements,
  Recommendation,
  RequirementItem,
  ResearchPlan,
  ResearchSynthesis,
  ScreenList,
  SurveyQuestions,
  UserFlow,
  UserJourney,
  UserNeedItem,
  UserNeeds,
  WireframeSpecs,
} from '@/ai/schemas'
import type { IAProductArea } from '@/ai/schemas'
import { heading, keyValue, list, note, paragraph, table, type DocBlock, NOT_GENERATED_NOTE } from '@/lib/doc-blocks'
import type { Project, Stage } from '@/data/models'

function getContent<T>(stage: Stage, localId: string): T | undefined {
  const deliverable = stage.content[localId]
  return deliverable?.content as T | undefined
}

function flattenIA(areas: IAProductArea[]): string[] {
  return areas.flatMap((area) => [
    `${area.label} (product area)`,
    ...area.sections.flatMap((section) => [
      `  ${section.label} (section)`,
      ...section.pages.map((page) => `    ${page.label} (page)`),
    ]),
  ])
}

// ---------------------------------------------------------------------------
// Discover
// ---------------------------------------------------------------------------

function discoverSection(stage: Stage): DocBlock[] {
  const blocks: DocBlock[] = [heading(2, 'Discover')]

  blocks.push(heading(3, 'Research Plan'))
  const plan = getContent<ResearchPlan>(stage, 'researchPlan')
  if (!plan) blocks.push(note(NOT_GENERATED_NOTE))
  else {
    blocks.push(
      list(plan.objectives),
      keyValue([
        { label: 'Target participants', value: plan.targetParticipants },
        { label: 'Suggested sample size', value: plan.suggestedSampleSize },
      ]),
      list(plan.keyQuestions),
      list(plan.recommendedMethods),
      list(plan.evidenceRequired),
      list(plan.expectedOutputs),
    )
  }

  blocks.push(heading(3, 'Interview Questions'))
  const iq = getContent<InterviewQuestions>(stage, 'interviewQuestions')
  if (!iq) blocks.push(note(NOT_GENERATED_NOTE))
  else {
    for (const [key, items] of Object.entries(iq)) {
      blocks.push(paragraph(`**${key}**`), list(items as string[]))
    }
  }

  blocks.push(heading(3, 'Survey Questions'))
  const sq = getContent<SurveyQuestions>(stage, 'surveyQuestions')
  if (!sq) blocks.push(note(NOT_GENERATED_NOTE))
  else {
    for (const [key, items] of Object.entries(sq)) {
      blocks.push(paragraph(`**${key}**`), list(items as string[]))
    }
  }

  blocks.push(heading(3, 'Assumptions'))
  const assumptions = getContent<Assumptions>(stage, 'assumptions')
  if (!assumptions) blocks.push(note(NOT_GENERATED_NOTE))
  else {
    blocks.push(
      table(
        ['Assumption', 'Why it matters', 'Confidence', 'Potential impact', 'Validation approach'],
        assumptions.items.map((a) => [a.assumption, a.whyItMatters, a.confidence, a.potentialImpact, a.validationApproach]),
      ),
    )
  }

  blocks.push(heading(3, 'Research Synthesis'))
  const synthesis = getContent<ResearchSynthesis>(stage, 'researchSynthesis')
  if (!synthesis) blocks.push(note(NOT_GENERATED_NOTE))
  else {
    if (!synthesis.hasEvidence && synthesis.disclaimer) blocks.push(note(synthesis.disclaimer))
    for (const key of ['observations', 'findings', 'themes', 'insights'] as const) {
      blocks.push(paragraph(`**${key}**`), list(synthesis[key].map((item) => `${item.text} (${item.type})`)))
    }
  }

  return blocks
}

// ---------------------------------------------------------------------------
// Define
// ---------------------------------------------------------------------------

function defineSection(stage: Stage): DocBlock[] {
  const blocks: DocBlock[] = [heading(2, 'Define')]

  blocks.push(heading(3, 'Insights'))
  const insights = getContent<Insights>(stage, 'insights')
  blocks.push(
    insights
      ? list(
          insights.items.map(
            (item: InsightItem) => `${item.insight} — based on ${item.evidence} (${item.confidence} confidence)`,
          ),
        )
      : note(NOT_GENERATED_NOTE),
  )

  blocks.push(heading(3, 'User Needs'))
  const userNeeds = getContent<UserNeeds>(stage, 'userNeeds')
  blocks.push(
    userNeeds
      ? table(
          ['User', 'Need', 'Context', 'Importance', 'Evidence'],
          userNeeds.items.map((item: UserNeedItem) => [item.user, item.need, item.context, item.importance, item.evidence]),
        )
      : note(NOT_GENERATED_NOTE),
  )

  blocks.push(heading(3, 'Pain Points'))
  const painPoints = getContent<PainPoints>(stage, 'painPoints')
  blocks.push(
    painPoints
      ? table(
          ['Pain point', 'User', 'Impact', 'Evidence'],
          painPoints.items.map((item: PainPointItem) => [item.painPoint, item.user, item.impact, item.evidence]),
        )
      : note(NOT_GENERATED_NOTE),
  )

  blocks.push(heading(3, 'Persona'))
  const persona = getContent<Persona>(stage, 'persona')
  if (!persona) blocks.push(note(NOT_GENERATED_NOTE))
  else {
    blocks.push(
      keyValue([
        { label: 'User type', value: persona.userType },
        { label: 'Context', value: persona.context },
        { label: 'Grounded in', value: persona.evidence },
      ]),
      paragraph('**Goals**'),
      list(persona.goals),
      paragraph('**Needs**'),
      list(persona.needs),
      paragraph('**Behaviours**'),
      list(persona.behaviours),
      paragraph('**Pain points**'),
      list(persona.painPoints),
      paragraph('**Motivations**'),
      list(persona.motivations),
    )
  }

  blocks.push(heading(3, 'User Journey'))
  const journey = getContent<UserJourney>(stage, 'userJourney')
  blocks.push(
    journey
      ? table(
          ['Stage', "User's goal", "User's action", 'Experience', 'Pain point', 'Opportunity'],
          journey.stages.map((s) => [s.stage, s.userGoal, s.userAction, s.experience, s.painPoint, s.opportunity]),
        )
      : note(NOT_GENERATED_NOTE),
  )

  blocks.push(heading(3, 'Problem Statement'))
  const problemStatement = getContent<ProblemStatement>(stage, 'problemStatement')
  blocks.push(
    problemStatement
      ? keyValue([
          { label: 'User', value: problemStatement.user },
          { label: 'Context', value: problemStatement.context },
          { label: 'Problem', value: problemStatement.problem },
          { label: 'Impact', value: problemStatement.impact },
          { label: 'Rationale', value: problemStatement.rationale },
        ])
      : note(NOT_GENERATED_NOTE),
  )

  blocks.push(heading(3, 'HMW'))
  const hmw = getContent<HMW>(stage, 'hmw')
  if (!hmw) blocks.push(note(NOT_GENERATED_NOTE))
  else {
    blocks.push(
      list(hmw.questions.map((q) => (q === hmw.recommendedQuestion ? `${q} (recommended)` : q))),
      paragraph(`**Rationale:** ${hmw.rationale}`),
    )
  }

  return blocks
}

// ---------------------------------------------------------------------------
// Ideate
// ---------------------------------------------------------------------------

function ideateSection(project: Project): DocBlock[] {
  const stage = project.stages.ideate
  const blocks: DocBlock[] = [heading(2, 'Ideate')]

  blocks.push(heading(3, 'Opportunities'))
  const opportunities = getContent<Opportunities>(stage, 'opportunities')
  blocks.push(
    opportunities
      ? table(
          ['Opportunity', 'User need', 'Supporting evidence', 'Potential impact'],
          opportunities.items.map((o) => [o.opportunity, o.userNeed, o.supportingEvidence, o.potentialImpact]),
        )
      : note(NOT_GENERATED_NOTE),
  )

  blocks.push(heading(3, 'Concepts'))
  const concepts = getContent<Concepts>(stage, 'concepts')
  if (!concepts) blocks.push(note(NOT_GENERATED_NOTE))
  else {
    for (const concept of concepts.items) {
      const isSelected = (concept as { id?: string }).id === stage.selectedConceptId
      blocks.push(
        paragraph(`**${concept.name}**${isSelected ? ' — _selected_' : ''}`),
        paragraph(concept.description),
        keyValue([
          { label: 'User value', value: concept.userValue },
          { label: 'Business value', value: concept.businessValue },
          { label: 'Supporting evidence', value: concept.supportingEvidence },
        ]),
        paragraph('Key functionality:'),
        list(concept.keyFunctionality),
        paragraph('Advantages:'),
        list(concept.advantages),
        paragraph('Risks:'),
        list(concept.risks),
        paragraph('Dependencies:'),
        list(concept.dependencies),
        paragraph('Open questions:'),
        list(concept.openQuestions),
        paragraph('Key assumptions:'),
        list(concept.keyAssumptions),
      )
    }
  }

  blocks.push(heading(3, 'Prioritisation'))
  const prioritisation = getContent<Prioritisation>(stage, 'prioritisation')
  if (!prioritisation) blocks.push(note(NOT_GENERATED_NOTE))
  else {
    blocks.push(
      note('These scores are AI-assisted assessments, not objective measurements.'),
      table(
        ['Concept', 'User value', 'Business value', 'Feasibility', 'Complexity/risk'],
        prioritisation.items.map((p) => [
          p.conceptName,
          String(p.userValue),
          String(p.businessValue),
          String(p.feasibility),
          String(p.complexityRisk),
        ]),
      ),
    )
  }

  blocks.push(heading(3, 'Recommended Solution'))
  const recommendation = getContent<Recommendation>(stage, 'recommendation')
  if (!recommendation) blocks.push(note(NOT_GENERATED_NOTE))
  else {
    blocks.push(
      keyValue([
        { label: 'Recommended concept', value: recommendation.recommendedConceptName },
        { label: 'Reasoning', value: recommendation.reasoning },
      ]),
      paragraph('Evidence supporting it:'),
      list(recommendation.evidenceSupporting),
      paragraph('Assumptions:'),
      list(recommendation.assumptions),
      paragraph('Risks:'),
      list(recommendation.risks),
      paragraph('Open questions:'),
      list(recommendation.openQuestions),
    )
  }

  return blocks
}

// ---------------------------------------------------------------------------
// Solution
// ---------------------------------------------------------------------------

function solutionSection(stage: Stage): DocBlock[] {
  const blocks: DocBlock[] = [heading(2, 'Solution')]

  blocks.push(heading(3, 'Information Architecture'))
  const ia = getContent<InformationArchitecture>(stage, 'informationArchitecture')
  if (!ia) blocks.push(note(NOT_GENERATED_NOTE))
  else {
    blocks.push(
      list(flattenIA(ia.tree)),
      paragraph('**Primary navigation**'),
      list(ia.primaryNavigation),
      paragraph('**Secondary navigation**'),
      list(ia.secondaryNavigation),
    )
  }

  blocks.push(heading(3, 'User Flow'))
  const flow = getContent<UserFlow>(stage, 'userFlow')
  if (!flow) blocks.push(note(NOT_GENERATED_NOTE))
  else {
    blocks.push(
      paragraph('**Main path**'),
      list(flow.mainPath.map((s) => `${s.step} (${s.type}) — ${s.description}`)),
    )
    for (const path of flow.alternatePaths) {
      blocks.push(paragraph(`**Alternate: ${path.name}**`), list(path.steps.map((s) => `${s.step} — ${s.description}`)))
    }
    for (const path of flow.errorRecoveryPaths) {
      blocks.push(paragraph(`**Error recovery: ${path.name}**`), list(path.steps.map((s) => `${s.step} — ${s.description}`)))
    }
  }

  blocks.push(heading(3, 'Screen List'))
  const screens = getContent<ScreenList>(stage, 'screenList')
  blocks.push(
    screens
      ? table(
          ['Screen', 'Purpose', 'User Goal', 'Primary Action', 'Key Content', 'Flow Step'],
          screens.items.map((s) => [s.screen, s.purpose, s.userGoal, s.primaryAction, s.keyContent, s.flowStep]),
        )
      : note(NOT_GENERATED_NOTE),
  )

  blocks.push(heading(3, 'Wireframe Specification'))
  const wireframes = getContent<WireframeSpecs>(stage, 'wireframeSpecs')
  if (!wireframes) blocks.push(note(NOT_GENERATED_NOTE))
  else {
    for (const spec of wireframes.items) {
      blocks.push(
        paragraph(`**${spec.screen}**`),
        keyValue([
          { label: 'Purpose', value: spec.purpose },
          { label: 'Layout', value: spec.layout },
        ]),
        paragraph('Content:'),
        list(spec.content),
        paragraph('Components:'),
        list(spec.components),
        paragraph('Interactions:'),
        list(spec.interactions),
        paragraph(`States: ${spec.relevantStates.join(', ')}`),
        paragraph('Accessibility:'),
        list(spec.accessibility),
      )
    }
  }

  blocks.push(heading(3, 'Product Requirements'))
  const requirements = getContent<ProductRequirements>(stage, 'productRequirements')
  if (!requirements) blocks.push(note(NOT_GENERATED_NOTE))
  else {
    for (const priority of ['must', 'should', 'could'] as const) {
      const items = requirements.items.filter((item: RequirementItem) => item.priority === priority)
      if (items.length === 0) continue
      blocks.push(
        paragraph(`**${priority === 'must' ? 'Must have' : priority === 'should' ? 'Should have' : 'Could have'}**`),
        table(
          ['Requirement', 'User need', 'Description', 'Acceptance criteria'],
          items.map((item) => [item.requirement, item.userNeed, item.description, item.acceptanceCriteria.join('; ')]),
        ),
      )
    }
  }

  return blocks
}

// ---------------------------------------------------------------------------
// Final Review
// ---------------------------------------------------------------------------

function finalReviewSection(project: Project): DocBlock[] {
  const ideate = project.stages.ideate
  const solution = project.stages.solution
  const define = project.stages.define
  const discover = project.stages.discover

  const problemStatement = getContent<ProblemStatement>(define, 'problemStatement')
  const concepts = getContent<Concepts>(ideate, 'concepts')
  const selectedConcept = concepts?.items.find((c) => (c as { id?: string }).id === ideate.selectedConceptId)
  const opportunities = getContent<Opportunities>(ideate, 'opportunities')
  const requirements = getContent<ProductRequirements>(solution, 'productRequirements')
  const recommendation = getContent<Recommendation>(ideate, 'recommendation')
  const discoverAssumptions = getContent<Assumptions>(discover, 'assumptions')
  const designConfidence = getContent<DesignConfidence>(solution, 'designConfidence')

  const blocks: DocBlock[] = [heading(2, 'Final Review')]

  blocks.push(
    heading(3, 'Summary'),
    keyValue([
      { label: 'Original problem', value: project.problem },
      { label: 'Product/service', value: project.productService },
      { label: 'Target user', value: project.targetUsers },
      { label: 'Business goal', value: project.businessGoal },
      { label: 'Defined problem', value: problemStatement?.problem ?? '' },
      { label: 'Selected concept', value: selectedConcept?.name ?? 'Not yet selected' },
    ]),
    paragraph('**Key opportunities**'),
    list(opportunities?.items.map((o) => o.opportunity) ?? []),
    paragraph('**Major requirements (must have)**'),
    list(requirements?.items.filter((r) => r.priority === 'must').map((r) => r.requirement) ?? []),
  )

  blocks.push(
    heading(3, 'Assumptions'),
    list(
      [
        ...(discoverAssumptions?.items.map((a) => a.assumption) ?? []),
        ...(selectedConcept?.keyAssumptions ?? []),
        ...(recommendation?.assumptions ?? []),
      ],
    ),
  )

  blocks.push(
    heading(3, 'Risks'),
    list([...(selectedConcept?.risks ?? []), ...(recommendation?.risks ?? [])]),
  )

  blocks.push(heading(3, 'Design Confidence'))
  if (!designConfidence) blocks.push(note(NOT_GENERATED_NOTE))
  else {
    blocks.push(
      keyValue([
        { label: 'Problem clarity', value: `${designConfidence.problemClarity}%` },
        { label: 'Evidence strength', value: `${designConfidence.evidenceStrength}%` },
        { label: 'Solution fit', value: `${designConfidence.solutionFit}%` },
        { label: 'Feasibility confidence', value: `${designConfidence.feasibilityConfidence}%` },
        { label: 'Validation status', value: designConfidence.validationStatus },
      ]),
      paragraph(designConfidence.summary),
    )
  }
  blocks.push(note('This solution has not been usability tested in V1.'))

  return blocks
}

// ---------------------------------------------------------------------------
// Top level
// ---------------------------------------------------------------------------

export function compileProjectDocument(project: Project): DocBlock[] {
  return [
    heading(1, project.name),
    heading(2, 'Project Brief'),
    keyValue([
      { label: 'Problem', value: project.problem },
      { label: 'Product / Service', value: project.productService },
      { label: 'Target Users', value: project.targetUsers },
      { label: 'Business Goal', value: project.businessGoal },
      { label: 'Constraints', value: project.constraints ?? '' },
      { label: 'Existing Evidence', value: project.evidence ?? '' },
    ]),
    ...discoverSection(project.stages.discover),
    ...defineSection(project.stages.define),
    ...ideateSection(project),
    ...solutionSection(project.stages.solution),
    ...finalReviewSection(project),
  ]
}
