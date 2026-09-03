import { Check, ClipboardCheck, X } from 'lucide-react'
import { DeliverableCard } from '@/components/ai/deliverable-card'
import { type RecordFieldSpec, RecordListEditor } from '@/components/ai/record-list-editor'
import { EvidenceTraceList } from '@/components/ai/validate-analysis'
import { ContextNote } from '@/components/ai/validate-deliverables'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Findings, FindingsWithIds, FindingWithId } from '@/ai/schemas'
import { EVIDENCE_SEVERITY_LABELS, FINDING_STATUS_LABELS, type FindingStatus } from '@/data/models'
import { useDeliverable } from '@/hooks/use-deliverable'
import { useProjectStore } from '@/store/useProjectStore'

function withIdsAndDraftStatus(raw: unknown): FindingsWithIds {
  const { items, contextNote } = raw as Findings
  return { items: items.map((item) => ({ ...item, id: crypto.randomUUID(), status: 'draft' as const })), contextNote }
}

const FINDING_FIELDS: RecordFieldSpec<FindingWithId>[] = [
  { key: 'title', label: 'Title', kind: 'text' },
  { key: 'description', label: 'Description', kind: 'textarea' },
  { key: 'theme', label: 'Theme', kind: 'text' },
  { key: 'severity', label: 'Severity', kind: 'severity' },
  { key: 'priority', label: 'Priority', kind: 'priorityLevel' },
  { key: 'insight', label: 'Insight', kind: 'textarea' },
  { key: 'status', label: 'Status', kind: 'findingStatus' },
  { key: 'supportingEvidenceIds', label: 'Supporting evidence ids', kind: 'stringList' },
]

function emptyFinding(): FindingWithId {
  return {
    id: crypto.randomUUID(),
    title: '',
    description: '',
    theme: '',
    severity: 'medium',
    priority: 'medium',
    supportingEvidenceIds: [],
    insight: '',
    status: 'draft',
  }
}

const PRIORITY_VARIANT = { high: 'destructive', medium: 'warning', low: 'neutral' } as const
const STATUS_VARIANT: Record<FindingStatus, 'success' | 'destructive' | 'neutral'> = {
  draft: 'neutral',
  accepted: 'success',
  rejected: 'destructive',
}

/**
 * Findings start as drafts and stay editable via the card's normal Edit
 * mode (including status, via the `findingStatus` field). The Accept/Reject
 * buttons here are the fast path for the common case — one click, no need
 * to open the full editor (Section 19: Accept / Edit / Reject).
 */
export function FindingsCard() {
  const { deliverable, generate, accept, updateContent, dismissStale, reasoning } = useDeliverable<FindingsWithIds>(
    'validate',
    'findings',
    { transformContent: withIdsAndDraftStatus },
  )
  const readOnly = useProjectStore((state) => state.activeProject?.isSample ?? false)

  function setStatus(content: FindingsWithIds, id: string, status: FindingStatus) {
    updateContent({ ...content, items: content.items.map((item) => (item.id === id ? { ...item, status } : item)) })
  }

  return (
    <DeliverableCard
      label="Findings"
      description="Draft findings synthesised from the evidence and analysis — reviewed one by one, never auto-accepted."
      icon={ClipboardCheck}
      deliverable={deliverable}
      reasoning={reasoning}
      onGenerate={generate}
      onAccept={accept}
      onEditChange={updateContent}
      onDismissStale={dismissStale}
      renderView={(content) => (
        <div className="flex flex-col gap-4">
          <ContextNote text={content.contextNote} />
          {content.items.map((item) => (
            <div key={item.id} className="rounded-lg border border-border p-4">
              <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
                <p className="text-sm font-bold text-foreground">{item.title}</p>
                <div className="flex shrink-0 flex-wrap gap-1.5">
                  <Badge variant={STATUS_VARIANT[item.status]}>{FINDING_STATUS_LABELS[item.status]}</Badge>
                  <Badge variant={PRIORITY_VARIANT[item.priority]} className="capitalize">
                    {item.priority} priority
                  </Badge>
                  <Badge variant="outline">{EVIDENCE_SEVERITY_LABELS[item.severity]}</Badge>
                  {item.theme && <Badge variant="info">{item.theme}</Badge>}
                </div>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
              <p className="mt-2 text-sm leading-relaxed text-foreground">
                <span className="font-semibold">Insight: </span>
                {item.insight}
              </p>
              <div className="mt-3">
                <EvidenceTraceList ids={item.supportingEvidenceIds} />
              </div>
              {!readOnly && item.status === 'draft' && (
                <div className="mt-3 flex gap-2">
                  <Button size="sm" onClick={() => setStatus(content, item.id, 'accepted')}>
                    <Check className="size-3.5" />
                    Accept
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => setStatus(content, item.id, 'rejected')}>
                    <X className="size-3.5" />
                    Reject
                  </Button>
                </div>
              )}
              {!readOnly && item.status !== 'draft' && (
                <div className="mt-3">
                  <Button variant="ghost" size="sm" onClick={() => setStatus(content, item.id, 'draft')}>
                    Reset to draft
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      renderEdit={(content, onChange) => (
        <RecordListEditor
          value={content.items}
          onChange={(items) => onChange({ ...content, items })}
          fields={FINDING_FIELDS}
          itemLabel="Finding"
          emptyItem={emptyFinding}
        />
      )}
    />
  )
}
