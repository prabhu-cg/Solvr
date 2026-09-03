import { Eye, Lightbulb, ListOrdered, MessageCircle, Sparkles, Tags, TriangleAlert } from 'lucide-react'
import { DeliverableCard } from '@/components/ai/deliverable-card'
import { FieldView } from '@/components/ai/content-views'
import { type RecordFieldSpec, RecordListEditor } from '@/components/ai/record-list-editor'
import { ContextNote } from '@/components/ai/validate-deliverables'
import { Badge } from '@/components/ui/badge'
import type { PatternItem, Patterns, PrioritisedIssueItem, PrioritisedIssues, ThemeItem, Themes, ValidationInsightItem, ValidationInsights } from '@/ai/schemas'
import { EVIDENCE_SEVERITY_LABELS, type ValidationEvidenceItem, type ValidationEvidenceType } from '@/data/models'
import { useDeliverable } from '@/hooks/use-deliverable'
import { useProjectStore } from '@/store/useProjectStore'

const TRACE_ICON: Record<ValidationEvidenceType, typeof Eye> = {
  observation: Eye,
  feedback: MessageCircle,
  issue: TriangleAlert,
  finding: Lightbulb,
}

/** Renders exactly which evidence a generated item is grounded in — Section 15's core transparency requirement. Ids that no longer resolve (deleted evidence) are skipped rather than shown as broken. */
export function EvidenceTraceList({ ids }: { ids: string[] }) {
  const evidence = useProjectStore((state) => state.activeProject?.stages.validate.evidence ?? [])
  const resolved = ids.map((id) => evidence.find((item) => item.id === id)).filter((item): item is ValidationEvidenceItem => !!item)

  if (resolved.length === 0) {
    return <p className="text-xs italic text-muted-foreground">Supporting evidence no longer available.</p>
  }

  return (
    <div className="rounded-lg bg-muted/60 p-3">
      <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Supporting evidence</p>
      <ul className="flex flex-col gap-1.5">
        {resolved.map((item) => {
          const Icon = TRACE_ICON[item.type]
          return (
            <li key={item.id} className="flex items-start gap-1.5 text-sm text-foreground">
              <Icon className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" aria-hidden />
              <span>
                <span className="font-semibold">{item.title}:</span> {item.description}
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

const THEME_FIELDS: RecordFieldSpec<ThemeItem>[] = [
  { key: 'theme', label: 'Theme', kind: 'text' },
  { key: 'description', label: 'Description', kind: 'textarea' },
  { key: 'supportingEvidenceIds', label: 'Supporting evidence ids', kind: 'stringList' },
]
const EMPTY_THEME: ThemeItem = { theme: '', description: '', supportingEvidenceIds: [] }

export function ThemesCard() {
  const { deliverable, generate, accept, updateContent, dismissStale, reasoning } = useDeliverable<Themes>('validate', 'themes')
  return (
    <DeliverableCard
      label="Themes"
      description="Meaningful themes identified across the validation evidence."
      icon={Tags}
      deliverable={deliverable}
      reasoning={reasoning}
      onGenerate={generate}
      onAccept={accept}
      onEditChange={updateContent}
      onDismissStale={dismissStale}
      renderView={(content) => (
        <div className="flex flex-col gap-4">
          <ContextNote text={content.contextNote} />
          {content.items.map((item, i) => (
            <div key={i} className="rounded-lg border border-border p-4">
              <p className="text-sm font-bold text-foreground">{item.theme}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
              <div className="mt-3">
                <EvidenceTraceList ids={item.supportingEvidenceIds} />
              </div>
            </div>
          ))}
        </div>
      )}
      renderEdit={(content, onChange) => (
        <RecordListEditor
          value={content.items}
          onChange={(items) => onChange({ ...content, items })}
          fields={THEME_FIELDS}
          itemLabel="Theme"
          emptyItem={EMPTY_THEME}
        />
      )}
    />
  )
}

const PATTERN_FIELDS: RecordFieldSpec<PatternItem>[] = [
  { key: 'title', label: 'Pattern title', kind: 'text' },
  { key: 'description', label: 'Description', kind: 'textarea' },
  { key: 'confidence', label: 'Confidence', kind: 'confidence' },
  { key: 'supportingEvidenceIds', label: 'Supporting evidence ids', kind: 'stringList' },
]
const EMPTY_PATTERN: PatternItem = { title: '', description: '', confidence: 'medium', supportingEvidenceIds: [] }

const CONFIDENCE_VARIANT = { high: 'success', medium: 'neutral', low: 'warning' } as const

export function PatternsCard() {
  const { deliverable, generate, accept, updateContent, dismissStale, reasoning } = useDeliverable<Patterns>('validate', 'patterns')
  return (
    <DeliverableCard
      label="Patterns"
      description="Repeated or related behaviours and problems across the evidence."
      icon={ListOrdered}
      deliverable={deliverable}
      reasoning={reasoning}
      onGenerate={generate}
      onAccept={accept}
      onEditChange={updateContent}
      onDismissStale={dismissStale}
      renderView={(content) => (
        <div className="flex flex-col gap-4">
          <ContextNote text={content.contextNote} />
          {content.items.map((item, i) => (
            <div key={i} className="rounded-lg border border-border p-4">
              <div className="mb-1 flex items-start justify-between gap-2">
                <p className="text-sm font-bold text-foreground">{item.title}</p>
                <Badge variant={CONFIDENCE_VARIANT[item.confidence]} className="shrink-0 capitalize">
                  {item.confidence} confidence
                </Badge>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
              <div className="mt-3">
                <EvidenceTraceList ids={item.supportingEvidenceIds} />
              </div>
            </div>
          ))}
        </div>
      )}
      renderEdit={(content, onChange) => (
        <RecordListEditor
          value={content.items}
          onChange={(items) => onChange({ ...content, items })}
          fields={PATTERN_FIELDS}
          itemLabel="Pattern"
          emptyItem={EMPTY_PATTERN}
        />
      )}
    />
  )
}

const PRIORITISED_ISSUE_FIELDS: RecordFieldSpec<PrioritisedIssueItem>[] = [
  { key: 'issue', label: 'Issue', kind: 'textarea' },
  { key: 'priority', label: 'Priority', kind: 'priorityLevel' },
  { key: 'severity', label: 'Severity', kind: 'severity' },
  { key: 'rationale', label: 'Rationale', kind: 'textarea' },
  { key: 'supportingEvidenceIds', label: 'Supporting evidence ids', kind: 'stringList' },
]
const EMPTY_PRIORITISED_ISSUE: PrioritisedIssueItem = {
  issue: '',
  priority: 'medium',
  severity: 'medium',
  supportingEvidenceIds: [],
  rationale: '',
}

const PRIORITY_VARIANT = { high: 'destructive', medium: 'warning', low: 'neutral' } as const

export function PrioritisedIssuesCard() {
  const { deliverable, generate, accept, updateContent, dismissStale, reasoning } = useDeliverable<PrioritisedIssues>(
    'validate',
    'prioritisedIssues',
  )
  return (
    <DeliverableCard
      label="Prioritised Issues"
      description="Issues ranked by severity, impact, frequency and relevance to the project goal."
      icon={TriangleAlert}
      deliverable={deliverable}
      reasoning={reasoning}
      onGenerate={generate}
      onAccept={accept}
      onEditChange={updateContent}
      onDismissStale={dismissStale}
      renderView={(content) => (
        <div className="flex flex-col gap-4">
          <ContextNote text={content.contextNote} />
          {content.items.map((item, i) => (
            <div key={i} className="rounded-lg border border-border p-4">
              <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
                <p className="text-sm font-bold text-foreground">{item.issue}</p>
                <div className="flex shrink-0 gap-1.5">
                  <Badge variant={PRIORITY_VARIANT[item.priority]} className="capitalize">
                    {item.priority} priority
                  </Badge>
                  <Badge variant="outline">{EVIDENCE_SEVERITY_LABELS[item.severity]}</Badge>
                </div>
              </div>
              <FieldView label="Rationale" value={item.rationale} />
              <div className="mt-3">
                <EvidenceTraceList ids={item.supportingEvidenceIds} />
              </div>
            </div>
          ))}
        </div>
      )}
      renderEdit={(content, onChange) => (
        <RecordListEditor
          value={content.items}
          onChange={(items) => onChange({ ...content, items })}
          fields={PRIORITISED_ISSUE_FIELDS}
          itemLabel="Issue"
          emptyItem={EMPTY_PRIORITISED_ISSUE}
        />
      )}
    />
  )
}

const VALIDATION_INSIGHT_FIELDS: RecordFieldSpec<ValidationInsightItem>[] = [
  { key: 'insight', label: 'Insight', kind: 'textarea' },
  { key: 'supportingEvidenceIds', label: 'Supporting evidence ids', kind: 'stringList' },
]
const EMPTY_VALIDATION_INSIGHT: ValidationInsightItem = { insight: '', supportingEvidenceIds: [] }

export function ValidationInsightsCard() {
  const { deliverable, generate, accept, updateContent, dismissStale, reasoning } = useDeliverable<ValidationInsights>(
    'validate',
    'insights',
  )
  return (
    <DeliverableCard
      label="Insights"
      description="Synthesised explanations of what the evidence means — not a restatement of it."
      icon={Sparkles}
      deliverable={deliverable}
      reasoning={reasoning}
      onGenerate={generate}
      onAccept={accept}
      onEditChange={updateContent}
      onDismissStale={dismissStale}
      renderView={(content) => (
        <div className="flex flex-col gap-4">
          <ContextNote text={content.contextNote} />
          {content.items.map((item, i) => (
            <div key={i} className="rounded-lg border border-border p-4">
              <p className="text-sm font-bold text-foreground">{item.insight}</p>
              <div className="mt-3">
                <EvidenceTraceList ids={item.supportingEvidenceIds} />
              </div>
            </div>
          ))}
        </div>
      )}
      renderEdit={(content, onChange) => (
        <RecordListEditor
          value={content.items}
          onChange={(items) => onChange({ ...content, items })}
          fields={VALIDATION_INSIGHT_FIELDS}
          itemLabel="Insight"
          emptyItem={EMPTY_VALIDATION_INSIGHT}
        />
      )}
    />
  )
}
