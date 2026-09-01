import { FileText, Frown, HelpCircle, Lightbulb, Route, Target, UserRound } from 'lucide-react'
import { DeliverableCard } from '@/components/ai/deliverable-card'
import { EditField, EditStack, FieldListView, FieldView, ViewGrid } from '@/components/ai/content-views'
import { type RecordFieldSpec, RecordListEditor } from '@/components/ai/record-list-editor'
import { StringListEditor } from '@/components/ai/string-list-editor'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import type {
  HMW,
  InsightItem,
  Insights,
  PainPointItem,
  PainPoints,
  Persona,
  ProblemStatement,
  UserJourney,
  UserJourneyStage,
  UserNeedItem,
  UserNeeds,
} from '@/ai/schemas'
import { useDeliverable } from '@/hooks/use-deliverable'

const INSIGHT_FIELDS: RecordFieldSpec<InsightItem>[] = [
  { key: 'insight', label: 'Insight', kind: 'textarea' },
  { key: 'evidence', label: 'Based on', kind: 'textarea' },
  { key: 'relatedUserNeed', label: 'Related user need', kind: 'text' },
  { key: 'confidence', label: 'Confidence', kind: 'confidence' },
]
const EMPTY_INSIGHT: InsightItem = { insight: '', evidence: '', relatedUserNeed: '', confidence: 'medium' }

export function InsightsCard() {
  const { deliverable, generate, accept, updateContent, dismissStale, reasoning } = useDeliverable<Insights>('define', 'insights')
  return (
    <DeliverableCard
      label="Insights"
      description="What we now understand, and what it's based on."
      icon={Lightbulb}
      deliverable={deliverable}
      reasoning={reasoning}
      onGenerate={generate}
      onAccept={accept}
      onEditChange={updateContent}
      onDismissStale={dismissStale}
      renderView={(content) => (
        <div className="flex flex-col gap-4">
          {content.items.map((item, i) => (
            <div key={i} className="rounded-lg border border-border p-4">
              <p className="text-sm font-bold text-foreground">{item.insight}</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <FieldView label="Based on" value={item.evidence} />
                <FieldView label="Related user need" value={item.relatedUserNeed} />
              </div>
              <p className="mt-2 text-xs font-semibold capitalize text-muted-foreground">{item.confidence} confidence</p>
            </div>
          ))}
        </div>
      )}
      renderEdit={(content, onChange) => (
        <RecordListEditor
          value={content.items}
          onChange={(items) => onChange({ items })}
          fields={INSIGHT_FIELDS}
          itemLabel="Insight"
          emptyItem={EMPTY_INSIGHT}
        />
      )}
    />
  )
}

const USER_NEED_FIELDS: RecordFieldSpec<UserNeedItem>[] = [
  { key: 'user', label: 'User', kind: 'text' },
  { key: 'need', label: 'Need', kind: 'textarea' },
  { key: 'context', label: 'Context', kind: 'textarea' },
  { key: 'importance', label: 'Importance', kind: 'confidence' },
  { key: 'evidence', label: 'Evidence', kind: 'textarea' },
]
const EMPTY_USER_NEED: UserNeedItem = { user: '', need: '', context: '', importance: 'medium', evidence: '' }

export function UserNeedsCard() {
  const { deliverable, generate, accept, updateContent, dismissStale, reasoning } = useDeliverable<UserNeeds>('define', 'userNeeds')
  return (
    <DeliverableCard
      label="User Needs"
      description="What people need, for whom, and why."
      icon={Target}
      deliverable={deliverable}
      reasoning={reasoning}
      onGenerate={generate}
      onAccept={accept}
      onEditChange={updateContent}
      onDismissStale={dismissStale}
      renderView={(content) => (
        <div className="flex flex-col gap-4">
          {content.items.map((item, i) => (
            <div key={i} className="rounded-lg border border-border p-4">
              <div className="mb-2 flex items-center justify-between gap-2">
                <p className="text-sm font-bold text-foreground">{item.user}</p>
                <span className="shrink-0 rounded-full border border-border bg-muted px-2 py-0.5 text-xs font-semibold capitalize text-muted-foreground">
                  {item.importance} importance
                </span>
              </div>
              <FieldView label="Need" value={item.need} />
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <FieldView label="Context" value={item.context} />
                <FieldView label="Evidence" value={item.evidence} />
              </div>
            </div>
          ))}
        </div>
      )}
      renderEdit={(content, onChange) => (
        <RecordListEditor
          value={content.items}
          onChange={(items) => onChange({ items })}
          fields={USER_NEED_FIELDS}
          itemLabel="User need"
          emptyItem={EMPTY_USER_NEED}
        />
      )}
    />
  )
}

const PAIN_POINT_FIELDS: RecordFieldSpec<PainPointItem>[] = [
  { key: 'painPoint', label: 'Pain point', kind: 'textarea' },
  { key: 'user', label: 'User', kind: 'text' },
  { key: 'impact', label: 'Impact', kind: 'textarea' },
  { key: 'evidence', label: 'Evidence', kind: 'textarea' },
]
const EMPTY_PAIN_POINT: PainPointItem = { painPoint: '', user: '', impact: '', evidence: '' }

export function PainPointsCard() {
  const { deliverable, generate, accept, updateContent, dismissStale, reasoning } = useDeliverable<PainPoints>('define', 'painPoints')
  return (
    <DeliverableCard
      label="Pain Points"
      description="Where things go wrong for people today."
      icon={Frown}
      deliverable={deliverable}
      reasoning={reasoning}
      onGenerate={generate}
      onAccept={accept}
      onEditChange={updateContent}
      onDismissStale={dismissStale}
      renderView={(content) => (
        <div className="flex flex-col gap-4">
          {content.items.map((item, i) => (
            <div key={i} className="rounded-lg border border-border p-4">
              <p className="text-sm font-bold text-foreground">{item.painPoint}</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                <FieldView label="User" value={item.user} />
                <FieldView label="Impact" value={item.impact} />
                <FieldView label="Evidence" value={item.evidence} />
              </div>
            </div>
          ))}
        </div>
      )}
      renderEdit={(content, onChange) => (
        <RecordListEditor
          value={content.items}
          onChange={(items) => onChange({ items })}
          fields={PAIN_POINT_FIELDS}
          itemLabel="Pain point"
          emptyItem={EMPTY_PAIN_POINT}
        />
      )}
    />
  )
}

export function PersonaCard() {
  const { deliverable, generate, accept, updateContent, dismissStale, reasoning } = useDeliverable<Persona>('define', 'persona')
  return (
    <DeliverableCard
      label="Persona"
      description="A lightweight, evidence-based persona — not a demographic guess."
      icon={UserRound}
      deliverable={deliverable}
      reasoning={reasoning}
      onGenerate={generate}
      onAccept={accept}
      onEditChange={updateContent}
      onDismissStale={dismissStale}
      renderView={(content) => (
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-base font-bold text-foreground">{content.userType}</p>
            <p className="mt-1 text-sm text-muted-foreground">{content.context}</p>
          </div>
          <ViewGrid>
            <FieldListView label="Goals" items={content.goals} />
            <FieldListView label="Needs" items={content.needs} />
            <FieldListView label="Behaviours" items={content.behaviours} />
            <FieldListView label="Pain points" items={content.painPoints} />
            <FieldListView label="Motivations" items={content.motivations} />
          </ViewGrid>
          <FieldView label="Grounded in" value={content.evidence} />
        </div>
      )}
      renderEdit={(content, onChange) => (
        <EditStack>
          <EditField label="User type">
            <Input value={content.userType} onChange={(e) => onChange({ ...content, userType: e.target.value })} />
          </EditField>
          <EditField label="Context">
            <Textarea rows={2} value={content.context} onChange={(e) => onChange({ ...content, context: e.target.value })} />
          </EditField>
          <EditField label="Goals">
            <StringListEditor value={content.goals} onChange={(v) => onChange({ ...content, goals: v })} itemLabel="goal" />
          </EditField>
          <EditField label="Needs">
            <StringListEditor value={content.needs} onChange={(v) => onChange({ ...content, needs: v })} itemLabel="need" />
          </EditField>
          <EditField label="Behaviours">
            <StringListEditor value={content.behaviours} onChange={(v) => onChange({ ...content, behaviours: v })} itemLabel="behaviour" />
          </EditField>
          <EditField label="Pain points">
            <StringListEditor value={content.painPoints} onChange={(v) => onChange({ ...content, painPoints: v })} itemLabel="pain point" />
          </EditField>
          <EditField label="Motivations">
            <StringListEditor value={content.motivations} onChange={(v) => onChange({ ...content, motivations: v })} itemLabel="motivation" />
          </EditField>
          <EditField label="Grounded in">
            <Textarea rows={2} value={content.evidence} onChange={(e) => onChange({ ...content, evidence: e.target.value })} />
          </EditField>
        </EditStack>
      )}
    />
  )
}

const JOURNEY_FIELDS: RecordFieldSpec<UserJourneyStage>[] = [
  { key: 'stage', label: 'Stage', kind: 'text' },
  { key: 'userGoal', label: "User's goal", kind: 'textarea' },
  { key: 'userAction', label: "User's action", kind: 'textarea' },
  { key: 'experience', label: 'Experience', kind: 'textarea' },
  { key: 'painPoint', label: 'Pain point', kind: 'textarea' },
  { key: 'opportunity', label: 'Opportunity', kind: 'textarea' },
]
const EMPTY_JOURNEY_STAGE: UserJourneyStage = {
  stage: '',
  userGoal: '',
  userAction: '',
  experience: '',
  painPoint: '',
  opportunity: '',
}

export function UserJourneyCard() {
  const { deliverable, generate, accept, updateContent, dismissStale, reasoning } = useDeliverable<UserJourney>('define', 'userJourney')
  return (
    <DeliverableCard
      label="User Journey"
      description="How the experience unfolds today, stage by stage."
      icon={Route}
      deliverable={deliverable}
      reasoning={reasoning}
      onGenerate={generate}
      onAccept={accept}
      onEditChange={updateContent}
      onDismissStale={dismissStale}
      renderView={(content) => (
        <div className="flex flex-col gap-3">
          {content.stages.map((stage, i) => (
            <div key={i} className="rounded-lg border border-border p-4">
              <p className="mb-2 text-sm font-bold text-foreground">
                {i + 1}. {stage.stage}
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <FieldView label="User's goal" value={stage.userGoal} />
                <FieldView label="User's action" value={stage.userAction} />
                <FieldView label="Experience" value={stage.experience} />
                <FieldView label="Pain point" value={stage.painPoint} />
              </div>
              <div className="mt-3">
                <FieldView label="Opportunity" value={stage.opportunity} />
              </div>
            </div>
          ))}
        </div>
      )}
      renderEdit={(content, onChange) => (
        <RecordListEditor
          value={content.stages}
          onChange={(stages) => onChange({ stages })}
          fields={JOURNEY_FIELDS}
          itemLabel="Stage"
          emptyItem={EMPTY_JOURNEY_STAGE}
        />
      )}
    />
  )
}

export function ProblemStatementCard() {
  const { deliverable, generate, accept, updateContent, dismissStale, reasoning } = useDeliverable<ProblemStatement>('define', 'problemStatement')
  return (
    <DeliverableCard
      label="Problem Statement"
      description="A concise, agreed statement of the problem worth solving."
      icon={FileText}
      deliverable={deliverable}
      reasoning={reasoning}
      onGenerate={generate}
      onAccept={accept}
      onEditChange={updateContent}
      onDismissStale={dismissStale}
      renderView={(content) => (
        <div className="flex flex-col gap-4">
          <ViewGrid>
            <FieldView label="User" value={content.user} />
            <FieldView label="Context" value={content.context} />
          </ViewGrid>
          <FieldView label="Problem" value={content.problem} />
          <FieldView label="Impact" value={content.impact} />
          <FieldView label="Rationale" value={content.rationale} />
        </div>
      )}
      renderEdit={(content, onChange) => (
        <EditStack>
          <EditField label="User">
            <Textarea rows={2} value={content.user} onChange={(e) => onChange({ ...content, user: e.target.value })} />
          </EditField>
          <EditField label="Context">
            <Textarea rows={2} value={content.context} onChange={(e) => onChange({ ...content, context: e.target.value })} />
          </EditField>
          <EditField label="Problem">
            <Textarea rows={3} value={content.problem} onChange={(e) => onChange({ ...content, problem: e.target.value })} />
          </EditField>
          <EditField label="Impact">
            <Textarea rows={2} value={content.impact} onChange={(e) => onChange({ ...content, impact: e.target.value })} />
          </EditField>
          <EditField label="Rationale">
            <Textarea rows={2} value={content.rationale} onChange={(e) => onChange({ ...content, rationale: e.target.value })} />
          </EditField>
        </EditStack>
      )}
    />
  )
}

export function HMWCard() {
  const { deliverable, generate, accept, updateContent, dismissStale, reasoning } = useDeliverable<HMW>('define', 'hmw')
  return (
    <DeliverableCard
      label="How Might We"
      description="Solution-neutral questions to carry into Ideate."
      icon={HelpCircle}
      deliverable={deliverable}
      reasoning={reasoning}
      onGenerate={generate}
      onAccept={accept}
      onEditChange={updateContent}
      onDismissStale={dismissStale}
      renderView={(content) => (
        <div className="flex flex-col gap-4">
          <ul className="flex flex-col gap-2">
            {content.questions.map((question, i) => (
              <li
                key={i}
                className={
                  question === content.recommendedQuestion
                    ? 'rounded-lg border border-primary bg-accent p-3 text-sm font-semibold text-accent-foreground'
                    : 'rounded-lg border border-border p-3 text-sm text-foreground'
                }
              >
                {question === content.recommendedQuestion && (
                  <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-primary-text">
                    Recommended
                  </span>
                )}
                {question}
              </li>
            ))}
          </ul>
          <FieldView label="Rationale" value={content.rationale} />
        </div>
      )}
      renderEdit={(content, onChange) => (
        <EditStack>
          <EditField label="Questions">
            <StringListEditor
              value={content.questions}
              onChange={(v) => onChange({ ...content, questions: v })}
              itemLabel="question"
            />
          </EditField>
          <EditField label="Recommended question">
            <Textarea
              rows={2}
              value={content.recommendedQuestion}
              onChange={(e) => onChange({ ...content, recommendedQuestion: e.target.value })}
            />
          </EditField>
          <EditField label="Rationale">
            <Textarea rows={2} value={content.rationale} onChange={(e) => onChange({ ...content, rationale: e.target.value })} />
          </EditField>
        </EditStack>
      )}
    />
  )
}
