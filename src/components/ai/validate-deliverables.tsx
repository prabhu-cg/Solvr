import { ClipboardList, ListChecks, MessagesSquare, Route, ShieldCheck, Target } from 'lucide-react'
import { DeliverableCard } from '@/components/ai/deliverable-card'
import { EditField, EditStack, FieldListView, FieldView, ViewGrid } from '@/components/ai/content-views'
import { type RecordFieldSpec, RecordListEditor } from '@/components/ai/record-list-editor'
import { StringListEditor } from '@/components/ai/string-list-editor'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import type {
  HeuristicReview,
  HeuristicReviewItem,
  SuccessCriteria,
  SuccessCriterionItem,
  TestScenarioItem,
  TestScenarios,
  TestTaskItem,
  TestTasks,
  UsabilityTestPlan,
  ValidationInterviewQuestions,
} from '@/ai/schemas'
import { useDeliverable } from '@/hooks/use-deliverable'

/** Shown above the view whenever the model flagged that project context was thin — never a fabricated fact, just an honest caveat (Section 9). */
export function ContextNote({ text }: { text: string | null }) {
  if (!text) return null
  return (
    <div className="mb-4 rounded-lg border border-warning-soft bg-warning-soft p-3 text-sm font-medium text-warning">{text}</div>
  )
}

export function UsabilityTestPlanCard() {
  const { deliverable, generate, accept, updateContent, dismissStale, reasoning } = useDeliverable<UsabilityTestPlan>(
    'validate',
    'testPlan',
  )
  return (
    <DeliverableCard
      label="Usability Test Plan"
      description="Objective, participants, method and logistics for testing this solution outside Solvr."
      icon={ClipboardList}
      deliverable={deliverable}
      reasoning={reasoning}
      onGenerate={generate}
      onAccept={accept}
      onEditChange={updateContent}
      onDismissStale={dismissStale}
      renderView={(content) => (
        <>
          <ContextNote text={content.contextNote} />
          <div className="flex flex-col gap-4">
            <FieldView label="Objective" value={content.objective} />
            <ViewGrid>
              <FieldListView label="Research goals" items={content.researchGoals} />
              <FieldListView label="Validation goals" items={content.validationGoals} />
              <FieldView label="Target participants" value={content.targetParticipants} />
              <FieldView label="Suggested number of participants" value={content.suggestedNumberOfParticipants} />
              <FieldView label="Testing method" value={content.testingMethod} />
              <FieldView label="Test format" value={content.testFormat} />
              <FieldView label="Session duration" value={content.sessionDuration} />
            </ViewGrid>
            <FieldListView label="Moderator guidance" items={content.moderatorGuidance} />
            <ViewGrid>
              <FieldListView label="Materials required" items={content.materialsRequired} />
              <FieldListView label="Risks or considerations" items={content.risksOrConsiderations} />
            </ViewGrid>
          </div>
        </>
      )}
      renderEdit={(content, onChange) => (
        <EditStack>
          <EditField label="Objective">
            <Textarea rows={2} value={content.objective} onChange={(e) => onChange({ ...content, objective: e.target.value })} />
          </EditField>
          <EditField label="Research goals">
            <StringListEditor value={content.researchGoals} onChange={(v) => onChange({ ...content, researchGoals: v })} itemLabel="goal" />
          </EditField>
          <EditField label="Validation goals">
            <StringListEditor
              value={content.validationGoals}
              onChange={(v) => onChange({ ...content, validationGoals: v })}
              itemLabel="goal"
            />
          </EditField>
          <EditField label="Target participants">
            <Textarea
              rows={2}
              value={content.targetParticipants}
              onChange={(e) => onChange({ ...content, targetParticipants: e.target.value })}
            />
          </EditField>
          <EditField label="Suggested number of participants">
            <Input
              value={content.suggestedNumberOfParticipants}
              onChange={(e) => onChange({ ...content, suggestedNumberOfParticipants: e.target.value })}
            />
          </EditField>
          <EditField label="Testing method">
            <Input value={content.testingMethod} onChange={(e) => onChange({ ...content, testingMethod: e.target.value })} />
          </EditField>
          <EditField label="Test format">
            <Input value={content.testFormat} onChange={(e) => onChange({ ...content, testFormat: e.target.value })} />
          </EditField>
          <EditField label="Session duration">
            <Input value={content.sessionDuration} onChange={(e) => onChange({ ...content, sessionDuration: e.target.value })} />
          </EditField>
          <EditField label="Moderator guidance">
            <StringListEditor
              value={content.moderatorGuidance}
              onChange={(v) => onChange({ ...content, moderatorGuidance: v })}
              itemLabel="guidance point"
            />
          </EditField>
          <EditField label="Materials required">
            <StringListEditor
              value={content.materialsRequired}
              onChange={(v) => onChange({ ...content, materialsRequired: v })}
              itemLabel="material"
            />
          </EditField>
          <EditField label="Risks or considerations">
            <StringListEditor
              value={content.risksOrConsiderations}
              onChange={(v) => onChange({ ...content, risksOrConsiderations: v })}
              itemLabel="risk"
            />
          </EditField>
        </EditStack>
      )}
    />
  )
}

const SCENARIO_FIELDS: RecordFieldSpec<TestScenarioItem>[] = [
  { key: 'title', label: 'Scenario title', kind: 'text' },
  { key: 'userContext', label: 'User context', kind: 'textarea' },
  { key: 'situation', label: 'Situation', kind: 'textarea' },
  { key: 'goal', label: 'Goal', kind: 'textarea' },
  { key: 'assumptions', label: 'Relevant assumptions', kind: 'stringList' },
]
const EMPTY_SCENARIO: TestScenarioItem = { title: '', userContext: '', situation: '', goal: '', assumptions: [] }

export function TestScenariosCard() {
  const { deliverable, generate, accept, updateContent, dismissStale, reasoning } = useDeliverable<TestScenarios>(
    'validate',
    'testScenarios',
  )
  return (
    <DeliverableCard
      label="Test Scenarios"
      description="Realistic situations, specific to this project, to run testing against."
      icon={Route}
      deliverable={deliverable}
      reasoning={reasoning}
      onGenerate={generate}
      onAccept={accept}
      onEditChange={updateContent}
      onDismissStale={dismissStale}
      renderView={(content) => (
        <>
          <ContextNote text={content.contextNote} />
          <div className="flex flex-col gap-3">
            {content.items.map((item, i) => (
              <div key={i} className="rounded-lg border border-border p-4">
                <p className="text-sm font-bold text-foreground">{item.title}</p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <FieldView label="User context" value={item.userContext} />
                  <FieldView label="Situation" value={item.situation} />
                  <FieldView label="Goal" value={item.goal} />
                  <FieldListView label="Relevant assumptions" items={item.assumptions} />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      renderEdit={(content, onChange) => (
        <RecordListEditor
          value={content.items}
          onChange={(items) => onChange({ ...content, items })}
          fields={SCENARIO_FIELDS}
          itemLabel="Scenario"
          emptyItem={EMPTY_SCENARIO}
        />
      )}
    />
  )
}

const TASK_FIELDS: RecordFieldSpec<TestTaskItem>[] = [
  { key: 'title', label: 'Task title', kind: 'text' },
  { key: 'userInstruction', label: 'User instruction', kind: 'textarea' },
  { key: 'expectedOutcome', label: 'Expected outcome', kind: 'textarea' },
  { key: 'evaluates', label: 'What this evaluates', kind: 'textarea' },
]
const EMPTY_TASK: TestTaskItem = { title: '', userInstruction: '', expectedOutcome: '', evaluates: '' }

export function TestTasksCard() {
  const { deliverable, generate, accept, updateContent, dismissStale, reasoning } = useDeliverable<TestTasks>('validate', 'testTasks')
  return (
    <DeliverableCard
      label="Test Tasks"
      description="Practical tasks for participants — described by goal, never by the exact UI step."
      icon={ListChecks}
      deliverable={deliverable}
      reasoning={reasoning}
      onGenerate={generate}
      onAccept={accept}
      onEditChange={updateContent}
      onDismissStale={dismissStale}
      renderView={(content) => (
        <>
          <ContextNote text={content.contextNote} />
          <div className="flex flex-col gap-3">
            {content.items.map((item, i) => (
              <div key={i} className="rounded-lg border border-border p-4">
                <p className="mb-2 text-sm font-bold text-foreground">
                  Task {i + 1}: {item.title}
                </p>
                <FieldView label="User instruction" value={item.userInstruction} />
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <FieldView label="Expected outcome" value={item.expectedOutcome} />
                  <FieldView label="What this evaluates" value={item.evaluates} />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      renderEdit={(content, onChange) => (
        <RecordListEditor
          value={content.items}
          onChange={(items) => onChange({ ...content, items })}
          fields={TASK_FIELDS}
          itemLabel="Task"
          emptyItem={EMPTY_TASK}
        />
      )}
    />
  )
}

const VALIDATION_INTERVIEW_GROUPS: { key: keyof Omit<ValidationInterviewQuestions, 'contextNote'>; label: string }[] = [
  { key: 'beforeTesting', label: 'Before testing' },
  { key: 'duringTesting', label: 'During testing' },
  { key: 'afterTesting', label: 'After testing' },
]

export function ValidationInterviewQuestionsCard() {
  const { deliverable, generate, accept, updateContent, dismissStale, reasoning } = useDeliverable<ValidationInterviewQuestions>(
    'validate',
    'interviewQuestions',
  )
  return (
    <DeliverableCard
      label="Interview Questions"
      description="Neutral, non-leading questions to ask before, during and after a session."
      icon={MessagesSquare}
      deliverable={deliverable}
      reasoning={reasoning}
      onGenerate={generate}
      onAccept={accept}
      onEditChange={updateContent}
      onDismissStale={dismissStale}
      renderView={(content) => (
        <>
          <ContextNote text={content.contextNote} />
          <ViewGrid>
            {VALIDATION_INTERVIEW_GROUPS.map(({ key, label }) => (
              <FieldListView key={key} label={label} items={content[key]} />
            ))}
          </ViewGrid>
        </>
      )}
      renderEdit={(content, onChange) => (
        <EditStack>
          {VALIDATION_INTERVIEW_GROUPS.map(({ key, label }) => (
            <EditField key={key} label={label}>
              <StringListEditor value={content[key]} onChange={(v) => onChange({ ...content, [key]: v })} itemLabel="question" />
            </EditField>
          ))}
        </EditStack>
      )}
    />
  )
}

const SUCCESS_CRITERION_FIELDS: RecordFieldSpec<SuccessCriterionItem>[] = [
  { key: 'criterion', label: 'Criterion', kind: 'text' },
  { key: 'measurement', label: 'Measurement', kind: 'text' },
  { key: 'target', label: 'Target', kind: 'text' },
  { key: 'reason', label: 'Reason', kind: 'textarea' },
]
const EMPTY_SUCCESS_CRITERION: SuccessCriterionItem = { criterion: '', measurement: '', target: '', reason: '' }

export function SuccessCriteriaCard() {
  const { deliverable, generate, accept, updateContent, dismissStale, reasoning } = useDeliverable<SuccessCriteria>(
    'validate',
    'successCriteria',
  )
  return (
    <DeliverableCard
      label="Success Criteria"
      description="Measurable targets to test against — not results, since testing hasn't happened yet."
      icon={Target}
      deliverable={deliverable}
      reasoning={reasoning}
      onGenerate={generate}
      onAccept={accept}
      onEditChange={updateContent}
      onDismissStale={dismissStale}
      renderView={(content) => (
        <>
          <ContextNote text={content.contextNote} />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  <th className="py-2 pr-4">Criterion</th>
                  <th className="py-2 pr-4">Measurement</th>
                  <th className="py-2 pr-4">Target</th>
                  <th className="py-2 pr-4">Reason</th>
                </tr>
              </thead>
              <tbody>
                {content.items.map((item, i) => (
                  <tr key={i} className="border-b border-border align-top last:border-0">
                    <td className="py-3 pr-4 font-semibold text-foreground">{item.criterion}</td>
                    <td className="py-3 pr-4 text-muted-foreground">{item.measurement}</td>
                    <td className="py-3 pr-4 text-muted-foreground">{item.target}</td>
                    <td className="py-3 pr-4 text-muted-foreground">{item.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      renderEdit={(content, onChange) => (
        <RecordListEditor
          value={content.items}
          onChange={(items) => onChange({ ...content, items })}
          fields={SUCCESS_CRITERION_FIELDS}
          itemLabel="Criterion"
          emptyItem={EMPTY_SUCCESS_CRITERION}
        />
      )}
    />
  )
}

const HEURISTIC_FIELDS: RecordFieldSpec<HeuristicReviewItem>[] = [
  { key: 'heuristic', label: 'Heuristic', kind: 'text' },
  { key: 'reviewQuestion', label: 'Review question', kind: 'textarea' },
  { key: 'relevantScreenOrFlow', label: 'Relevant screen or flow', kind: 'text' },
  { key: 'potentialRisk', label: 'Potential risk', kind: 'textarea' },
]
const EMPTY_HEURISTIC: HeuristicReviewItem = { heuristic: '', reviewQuestion: '', relevantScreenOrFlow: '', potentialRisk: '' }

export function HeuristicReviewCard() {
  const { deliverable, generate, accept, updateContent, dismissStale, reasoning } = useDeliverable<HeuristicReview>(
    'validate',
    'heuristicReview',
  )
  return (
    <DeliverableCard
      label="Heuristic Review"
      description="A preparation checklist for a heuristic review to run outside Solvr — not a completed review."
      icon={ShieldCheck}
      deliverable={deliverable}
      reasoning={reasoning}
      onGenerate={generate}
      onAccept={accept}
      onEditChange={updateContent}
      onDismissStale={dismissStale}
      renderView={(content) => (
        <>
          <ContextNote text={content.contextNote} />
          <div className="flex flex-col gap-3">
            {content.items.map((item, i) => (
              <div key={i} className="rounded-lg border border-border p-4">
                <p className="text-sm font-bold text-foreground">{item.heuristic}</p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <FieldView label="Review question" value={item.reviewQuestion} />
                  <FieldView label="Relevant screen or flow" value={item.relevantScreenOrFlow} />
                </div>
                <div className="mt-3">
                  <FieldView label="Potential risk" value={item.potentialRisk} />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      renderEdit={(content, onChange) => (
        <RecordListEditor
          value={content.items}
          onChange={(items) => onChange({ ...content, items })}
          fields={HEURISTIC_FIELDS}
          itemLabel="Item"
          emptyItem={EMPTY_HEURISTIC}
        />
      )}
    />
  )
}
