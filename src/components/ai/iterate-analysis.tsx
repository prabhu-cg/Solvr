import { Layers, Sparkles } from 'lucide-react'
import { DeliverableCard } from '@/components/ai/deliverable-card'
import { FieldView } from '@/components/ai/content-views'
import { ContextNote } from '@/components/ai/validate-deliverables'
import { type RecordFieldSpec, RecordListEditor } from '@/components/ai/record-list-editor'
import { Badge } from '@/components/ui/badge'
import { AFFECTED_DELIVERABLE_LABELS } from '@/ai/schemas'
import type {
  AffectedDeliverable,
  FindingsWithIds,
  ImpactAnalysis,
  ImpactAnalysisItem,
  IterationRecommendations,
  RecommendationChangeItem,
} from '@/ai/schemas'
import { useDeliverable } from '@/hooks/use-deliverable'
import { useProjectStore } from '@/store/useProjectStore'

/** Renders exactly which selected findings a generated item is grounded in — the same transparency principle as Validate's evidence traces (Section 20). Ids that no longer resolve are skipped rather than shown as broken. */
export function FindingTraceList({ ids }: { ids: string[] }) {
  const findingsContent = useProjectStore(
    (state) => state.activeProject?.stages.validate.content.findings?.content as FindingsWithIds | undefined,
  )
  const resolved = ids
    .map((id) => findingsContent?.items.find((item) => item.id === id))
    .filter((item): item is NonNullable<typeof item> => !!item)

  if (resolved.length === 0) {
    return <p className="text-xs italic text-muted-foreground">Related finding no longer available.</p>
  }

  return (
    <div className="rounded-lg bg-muted/60 p-3">
      <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">From finding</p>
      <ul className="flex flex-col gap-1.5">
        {resolved.map((item) => (
          <li key={item.id} className="text-sm text-foreground">
            <span className="font-semibold">{item.title}:</span> {item.description}
          </li>
        ))}
      </ul>
    </div>
  )
}

function AffectedDeliverableBadges({ items }: { items: AffectedDeliverable[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((d) => (
        <Badge key={d} variant="info">
          {AFFECTED_DELIVERABLE_LABELS[d]}
        </Badge>
      ))}
    </div>
  )
}

const IMPACT_FIELDS: RecordFieldSpec<ImpactAnalysisItem>[] = [
  { key: 'impact', label: 'Impact', kind: 'textarea' },
  { key: 'reason', label: 'Reason', kind: 'textarea' },
  { key: 'findingIds', label: 'Related finding ids', kind: 'stringList' },
]
const EMPTY_IMPACT: ImpactAnalysisItem = {
  affectedDeliverable: 'userFlow',
  impact: '',
  reason: '',
  findingIds: [],
}

export function ImpactAnalysisCard() {
  const { deliverable, generate, accept, updateContent, dismissStale, reasoning } = useDeliverable<ImpactAnalysis>(
    'iterate',
    'impactAnalysis',
  )
  return (
    <DeliverableCard
      label="Impact Analysis"
      description="Which existing Solution deliverables the selected findings may affect, and why."
      icon={Layers}
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
              <div className="mb-2">
                <Badge variant="primary">{AFFECTED_DELIVERABLE_LABELS[item.affectedDeliverable]}</Badge>
              </div>
              <FieldView label="Impact" value={item.impact} />
              <div className="mt-3">
                <FieldView label="Reason" value={item.reason} />
              </div>
              <div className="mt-3">
                <FindingTraceList ids={item.findingIds} />
              </div>
            </div>
          ))}
        </div>
      )}
      renderEdit={(content, onChange) => (
        <RecordListEditor
          value={content.items}
          onChange={(items) => onChange({ ...content, items })}
          fields={IMPACT_FIELDS}
          itemLabel="Impact"
          emptyItem={EMPTY_IMPACT}
        />
      )}
    />
  )
}

const RECOMMENDATION_FIELDS: RecordFieldSpec<RecommendationChangeItem>[] = [
  { key: 'title', label: 'Title', kind: 'text' },
  { key: 'description', label: 'Description', kind: 'textarea' },
  { key: 'problemAddressed', label: 'Problem addressed', kind: 'textarea' },
  { key: 'expectedBenefit', label: 'Expected benefit', kind: 'textarea' },
  { key: 'findingIds', label: 'Related finding ids', kind: 'stringList' },
]
const EMPTY_RECOMMENDATION: RecommendationChangeItem = {
  title: '',
  description: '',
  problemAddressed: '',
  findingIds: [],
  expectedBenefit: '',
  affectedDeliverables: [],
}

export function IterationRecommendationsCard() {
  const { deliverable, generate, accept, updateContent, dismissStale, reasoning } = useDeliverable<IterationRecommendations>(
    'iterate',
    'recommendations',
  )
  return (
    <DeliverableCard
      label="Recommended Changes"
      description="Specific, actionable changes grounded in the selected findings — never generic advice."
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
              <p className="text-sm font-bold text-foreground">{item.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <FieldView label="Problem addressed" value={item.problemAddressed} />
                <FieldView label="Expected benefit" value={item.expectedBenefit} />
              </div>
              <div className="mt-3">
                <p className="mb-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">Affected deliverables</p>
                <AffectedDeliverableBadges items={item.affectedDeliverables} />
              </div>
              <div className="mt-3">
                <FindingTraceList ids={item.findingIds} />
              </div>
            </div>
          ))}
        </div>
      )}
      renderEdit={(content, onChange) => (
        <RecordListEditor
          value={content.items}
          onChange={(items) => onChange({ ...content, items })}
          fields={RECOMMENDATION_FIELDS}
          itemLabel="Recommendation"
          emptyItem={EMPTY_RECOMMENDATION}
        />
      )}
    />
  )
}
