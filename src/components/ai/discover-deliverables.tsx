import { DeliverableCard } from '@/components/ai/deliverable-card'
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
  const { deliverable, generate, accept, updateContent, dismissStale } = useDeliverable<ResearchPlan>('discover', 'researchPlan')
  return (
    <DeliverableCard
      label="Research Plan"
      description="What this research needs to establish, and how to go about it."
      deliverable={deliverable}
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
  const { deliverable, generate, accept, updateContent, dismissStale } = useDeliverable<InterviewQuestions>('discover', 'interviewQuestions')
  return (
    <DeliverableCard
      label="Interview Questions"
      description="Neutral, non-leading questions organised by conversation flow."
      deliverable={deliverable}
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
  const { deliverable, generate, accept, updateContent, dismissStale } = useDeliverable<SurveyQuestions>('discover', 'surveyQuestions')
  return (
    <DeliverableCard
      label="Survey Questions"
      description="Unbiased questions ready to adapt into a survey."
      deliverable={deliverable}
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
  const { deliverable, generate, accept, updateContent, dismissStale } = useDeliverable<Assumptions>('discover', 'assumptions')
  return (
    <DeliverableCard
      label="Assumptions"
      description="What's currently being assumed about this problem, and how confident that is."
      deliverable={deliverable}
      onGenerate={generate}
      onAccept={accept}
      onEditChange={updateContent}
      onDismissStale={dismissStale}
      renderView={(content) => (
        <div className="flex flex-col gap-4">
          {content.items.map((item, i) => (
            <div key={i} className="rounded-lg border border-border p-4">
              <div className="mb-2 flex items-center justify-between gap-2">
                <p className="text-sm font-bold text-foreground">{item.assumption}</p>
                <span className="shrink-0 rounded-full border border-border bg-muted px-2 py-0.5 text-xs font-semibold capitalize text-muted-foreground">
                  {item.confidence} confidence
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{item.whyItMatters}</p>
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

function SynthesisSection({ title, items }: { title: string; items: { text: string; type: EvidenceType }[] }) {
  return (
    <div>
      <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">{title}</p>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">None.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {items.map((item, i) => (
            <li key={i} className="flex flex-wrap items-start gap-2 text-sm text-foreground">
              <EvidenceBadge type={item.type} />
              <span className="flex-1">{item.text}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function ResearchSynthesisCard() {
  const { deliverable, generate, accept, updateContent, dismissStale } = useDeliverable<ResearchSynthesis>('discover', 'researchSynthesis')
  return (
    <DeliverableCard
      label="Research Synthesis"
      description="Evidence pulled together into observations, findings, themes and insights."
      deliverable={deliverable}
      onGenerate={generate}
      onAccept={accept}
      onEditChange={updateContent}
      onDismissStale={dismissStale}
      renderView={(content) => (
        <div className="flex flex-col gap-5">
          {!content.hasEvidence && content.disclaimer && (
            <div className="rounded-lg border border-warning-soft bg-warning-soft p-3 text-sm font-medium text-warning">
              {content.disclaimer}
            </div>
          )}
          <div className="grid gap-5 sm:grid-cols-2">
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
              <StringListEditor
                value={content[key].map((item) => item.text)}
                onChange={(texts) =>
                  onChange({
                    ...content,
                    [key]: texts.map((text, i) => ({ text, type: content[key][i]?.type ?? 'inference' })),
                  })
                }
                itemLabel="item"
              />
            </EditField>
          ))}
        </EditStack>
      )}
    />
  )
}
