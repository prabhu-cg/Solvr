import { ClipboardList, Compass, Eye, Layers, Lightbulb, MessagesSquare, Search, TriangleAlert } from 'lucide-react'
import { DeliverableCard } from '@/components/ai/deliverable-card'
import { Badge } from '@/components/ui/badge'
import { EditField, EditStack, FieldListView, FieldView, ViewGrid } from '@/components/ai/content-views'
import { EvidenceBadge } from '@/components/ai/evidence-badge'
import { type RecordFieldSpec, RecordListEditor } from '@/components/ai/record-list-editor'
import { StringListEditor } from '@/components/ai/string-list-editor'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import type { AssumptionItem, Assumptions, InterviewQuestions, ResearchPlan, ResearchSynthesis, SurveyQuestions } from '@/ai/schemas'
import type { EvidenceType } from '@/data/models'
import { useDeliverable } from '@/hooks/use-deliverable'

export function ResearchPlanCard() {
  const { deliverable, generate, accept, updateContent, dismissStale, reasoning } = useDeliverable<ResearchPlan>('discover', 'researchPlan')
  return (
    <DeliverableCard
      label="Research Plan"
      description="What this research needs to establish, and how to go about it."
      icon={ClipboardList}
      deliverable={deliverable}
      reasoning={reasoning}
      onGenerate={generate}
      onAccept={accept}
      onEditChange={updateContent}
      onDismissStale={dismissStale}
      renderView={(content) => (
        <ViewGrid>
          <FieldListView label="Objectives" items={content.objectives} />
          <FieldListView label="Key questions" items={content.keyQuestions} />
          <FieldListView label="Recommended methods" items={content.recommendedMethods} />
          <FieldView label="Target participants" value={content.targetParticipants} />
          <FieldView label="Suggested sample size" value={content.suggestedSampleSize} />
          <FieldListView label="Evidence required" items={content.evidenceRequired} />
          <FieldListView label="Expected outputs" items={content.expectedOutputs} />
        </ViewGrid>
      )}
      renderEdit={(content, onChange) => (
        <EditStack>
          <EditField label="Objectives">
            <StringListEditor value={content.objectives} onChange={(v) => onChange({ ...content, objectives: v })} itemLabel="objective" />
          </EditField>
          <EditField label="Key questions">
            <StringListEditor value={content.keyQuestions} onChange={(v) => onChange({ ...content, keyQuestions: v })} itemLabel="question" />
          </EditField>
          <EditField label="Recommended methods">
            <StringListEditor
              value={content.recommendedMethods}
              onChange={(v) => onChange({ ...content, recommendedMethods: v })}
              itemLabel="method"
            />
          </EditField>
          <EditField label="Target participants">
            <Textarea
              rows={2}
              value={content.targetParticipants}
              onChange={(e) => onChange({ ...content, targetParticipants: e.target.value })}
            />
          </EditField>
          <EditField label="Suggested sample size">
            <Input
              value={content.suggestedSampleSize}
              onChange={(e) => onChange({ ...content, suggestedSampleSize: e.target.value })}
            />
          </EditField>
          <EditField label="Evidence required">
            <StringListEditor
              value={content.evidenceRequired}
              onChange={(v) => onChange({ ...content, evidenceRequired: v })}
              itemLabel="evidence item"
            />
          </EditField>
          <EditField label="Expected outputs">
            <StringListEditor
              value={content.expectedOutputs}
              onChange={(v) => onChange({ ...content, expectedOutputs: v })}
              itemLabel="output"
            />
          </EditField>
        </EditStack>
      )}
    />
  )
}

const INTERVIEW_CATEGORIES: { key: keyof InterviewQuestions; label: string }[] = [
  { key: 'opening', label: 'Opening' },
  { key: 'context', label: 'Context' },
  { key: 'behaviour', label: 'Behaviour' },
  { key: 'currentExperience', label: 'Current experience' },
  { key: 'painPoints', label: 'Pain points' },
  { key: 'motivation', label: 'Motivation' },
  { key: 'closing', label: 'Closing' },
]

export function InterviewQuestionsCard() {
  const { deliverable, generate, accept, updateContent, dismissStale, reasoning } = useDeliverable<InterviewQuestions>('discover', 'interviewQuestions')
  return (
    <DeliverableCard
      label="Interview Questions"
      description="Neutral, non-leading questions organised by conversation flow."
      icon={MessagesSquare}
      deliverable={deliverable}
      reasoning={reasoning}
      onGenerate={generate}
      onAccept={accept}
      onEditChange={updateContent}
      onDismissStale={dismissStale}
      renderView={(content) => (
        <ViewGrid>
          {INTERVIEW_CATEGORIES.map(({ key, label }) => (
            <FieldListView key={key} label={label} items={content[key]} />
          ))}
        </ViewGrid>
      )}
      renderEdit={(content, onChange) => (
        <EditStack>
          {INTERVIEW_CATEGORIES.map(({ key, label }) => (
            <EditField key={key} label={label}>
              <StringListEditor value={content[key]} onChange={(v) => onChange({ ...content, [key]: v })} itemLabel="question" />
            </EditField>
          ))}
        </EditStack>
      )}
    />
  )
}

const SURVEY_CATEGORIES: { key: keyof SurveyQuestions; label: string }[] = [
  { key: 'screening', label: 'Screening' },
  { key: 'behaviour', label: 'Behaviour' },
  { key: 'experience', label: 'Experience' },
  { key: 'painPoints', label: 'Pain points' },
  { key: 'satisfaction', label: 'Satisfaction' },
  { key: 'openEnded', label: 'Open-ended' },
]

export function SurveyQuestionsCard() {
  const { deliverable, generate, accept, updateContent, dismissStale, reasoning } = useDeliverable<SurveyQuestions>('discover', 'surveyQuestions')
  return (
    <DeliverableCard
      label="Survey Questions"
      description="Unbiased questions ready to adapt into a survey."
      icon={Compass}
      deliverable={deliverable}
      reasoning={reasoning}
      onGenerate={generate}
      onAccept={accept}
      onEditChange={updateContent}
      onDismissStale={dismissStale}
      renderView={(content) => (
        <ViewGrid>
          {SURVEY_CATEGORIES.map(({ key, label }) => (
            <FieldListView key={key} label={label} items={content[key]} />
          ))}
        </ViewGrid>
      )}
      renderEdit={(content, onChange) => (
        <EditStack>
          {SURVEY_CATEGORIES.map(({ key, label }) => (
            <EditField key={key} label={label}>
              <StringListEditor value={content[key]} onChange={(v) => onChange({ ...content, [key]: v })} itemLabel="question" />
            </EditField>
          ))}
        </EditStack>
      )}
    />
  )
}

const CONFIDENCE_VARIANT = {
  high: 'success',
  medium: 'neutral',
  low: 'warning',
} as const

const ASSUMPTION_FIELDS: RecordFieldSpec<AssumptionItem>[] = [
  { key: 'assumption', label: 'Assumption', kind: 'textarea' },
  { key: 'whyItMatters', label: 'Why it matters', kind: 'textarea' },
  { key: 'confidence', label: 'Confidence', kind: 'confidence' },
  { key: 'potentialImpact', label: 'Potential impact', kind: 'textarea' },
  { key: 'validationApproach', label: 'How to validate it', kind: 'textarea' },
]

const EMPTY_ASSUMPTION: AssumptionItem = {
  assumption: '',
  whyItMatters: '',
  confidence: 'medium',
  potentialImpact: '',
  validationApproach: '',
}

export function AssumptionsCard() {
  const { deliverable, generate, accept, updateContent, dismissStale, reasoning } = useDeliverable<Assumptions>('discover', 'assumptions')
  return (
    <DeliverableCard
      label="Assumptions"
      description="What's currently being assumed about this problem, and how confident that is."
      icon={TriangleAlert}
      deliverable={deliverable}
      reasoning={reasoning}
      onGenerate={generate}
      onAccept={accept}
      onEditChange={updateContent}
      onDismissStale={dismissStale}
      renderView={(content) => (
        <div className="flex flex-col gap-3">
          {content.items.map((item, i) => (
            <div key={i} className="rounded-lg border border-border p-4">
              <div className="mb-2 flex items-start justify-between gap-2">
                <p className="text-sm font-bold text-foreground">{item.assumption}</p>
                <Badge variant={CONFIDENCE_VARIANT[item.confidence]} className="shrink-0 capitalize">
                  {item.confidence} confidence
                </Badge>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">{item.whyItMatters}</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <FieldView label="Potential impact" value={item.potentialImpact} />
                <FieldView label="How to validate it" value={item.validationApproach} />
              </div>
            </div>
          ))}
        </div>
      )}
      renderEdit={(content, onChange) => (
        <RecordListEditor
          value={content.items}
          onChange={(items) => onChange({ items })}
          fields={ASSUMPTION_FIELDS}
          itemLabel="Assumption"
          emptyItem={EMPTY_ASSUMPTION}
        />
      )}
    />
  )
}

const SYNTHESIS_SECTION_ICON: Record<string, typeof Eye> = {
  Observations: Eye,
  Findings: Search,
  Themes: Compass,
  Insights: Lightbulb,
}

function SynthesisSection({ title, items }: { title: string; items: { text: string; type: EvidenceType }[] }) {
  const Icon = SYNTHESIS_SECTION_ICON[title] ?? Layers
  return (
    <div className="rounded-lg bg-muted/60 p-3.5">
      <p className="mb-2.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
        <Icon className="size-3.5" aria-hidden />
        {title}
      </p>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">None.</p>
      ) : (
        <ul className="flex flex-col gap-2.5">
          {items.map((item, i) => (
            <li key={i} className="flex flex-wrap items-start gap-2 text-sm leading-relaxed text-foreground">
              <EvidenceBadge type={item.type} />
              <span className="flex-1">{item.text}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

type SynthesisItem = { text: string; type: EvidenceType }

const SYNTHESIS_ITEM_FIELDS: RecordFieldSpec<SynthesisItem>[] = [
  { key: 'text', label: 'Text', kind: 'textarea' },
  { key: 'type', label: 'Type', kind: 'evidenceType' },
]

const EMPTY_SYNTHESIS_ITEM = (): SynthesisItem => ({ text: '', type: 'inference' })

export function ResearchSynthesisCard() {
  const { deliverable, generate, accept, updateContent, dismissStale, reasoning } = useDeliverable<ResearchSynthesis>('discover', 'researchSynthesis')
  return (
    <DeliverableCard
      label="Research Synthesis"
      description="Evidence pulled together into observations, findings, themes and insights."
      icon={Layers}
      deliverable={deliverable}
      reasoning={reasoning}
      onGenerate={generate}
      onAccept={accept}
      onEditChange={updateContent}
      onDismissStale={dismissStale}
      renderView={(content) => (
        <div className="flex flex-col gap-4">
          {!content.hasEvidence && content.disclaimer && (
            <div className="rounded-lg border border-warning-soft bg-warning-soft p-3 text-sm font-medium text-warning">
              {content.disclaimer}
            </div>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <SynthesisSection title="Observations" items={content.observations} />
            <SynthesisSection title="Findings" items={content.findings} />
            <SynthesisSection title="Themes" items={content.themes} />
            <SynthesisSection title="Insights" items={content.insights} />
          </div>
        </div>
      )}
      renderEdit={(content, onChange) => (
        <EditStack>
          {(['observations', 'findings', 'themes', 'insights'] as const).map((key) => (
            <EditField key={key} label={key.charAt(0).toUpperCase() + key.slice(1)}>
              <RecordListEditor
                value={content[key]}
                onChange={(items) => onChange({ ...content, [key]: items })}
                fields={SYNTHESIS_ITEM_FIELDS}
                itemLabel="Item"
                emptyItem={EMPTY_SYNTHESIS_ITEM}
              />
            </EditField>
          ))}
        </EditStack>
      )}
    />
  )
}
