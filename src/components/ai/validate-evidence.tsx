import { ClipboardList, Eye, Lightbulb, MessageCircle, Pencil, Plus, Trash2, TriangleAlert } from 'lucide-react'
import { useEffect, useState } from 'react'
import { SegmentedControl } from '@/components/ai/segmented-control'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  EVIDENCE_SEVERITY_LABELS,
  type EvidenceSeverity,
  VALIDATION_EVIDENCE_TYPE_LABELS,
  type ValidationEvidenceItem,
  type ValidationEvidenceType,
} from '@/data/models'
import { useValidationEvidence } from '@/hooks/use-validation-evidence'
import { useProjectStore } from '@/store/useProjectStore'

const EVIDENCE_TYPES: ValidationEvidenceType[] = ['observation', 'feedback', 'issue', 'finding']

const TYPE_ICON: Record<ValidationEvidenceType, typeof Eye> = {
  observation: Eye,
  feedback: MessageCircle,
  issue: TriangleAlert,
  finding: Lightbulb,
}

const TYPE_BADGE_VARIANT: Record<ValidationEvidenceType, 'info' | 'neutral' | 'warning' | 'success'> = {
  observation: 'info',
  feedback: 'neutral',
  issue: 'warning',
  finding: 'success',
}

const FILTER_OPTIONS: { value: ValidationEvidenceType | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  ...EVIDENCE_TYPES.map((value) => ({ value, label: VALIDATION_EVIDENCE_TYPE_LABELS[value] })),
]

const SEVERITY_OPTIONS: { value: EvidenceSeverity | ''; label: string }[] = [
  { value: '', label: 'None' },
  ...(['critical', 'high', 'medium', 'low'] as EvidenceSeverity[]).map((value) => ({ value, label: EVIDENCE_SEVERITY_LABELS[value] })),
]

type EvidenceDraft = Omit<ValidationEvidenceItem, 'id' | 'createdAt' | 'updatedAt'>

function emptyDraft(type: ValidationEvidenceType = 'observation'): EvidenceDraft {
  return { type, title: '', description: '', context: '', relatedTask: '', notes: '', severity: undefined, supportingEvidence: '' }
}

function EvidenceFormDialog({
  open,
  onOpenChange,
  initial,
  onSave,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  initial: ValidationEvidenceItem | null
  onSave: (draft: EvidenceDraft) => void
}) {
  const [draft, setDraft] = useState<EvidenceDraft>(() => (initial ? { ...initial } : emptyDraft()))

  // Re-seed the form whenever a different target opens — a fresh add, or editing a different item.
  useEffect(() => {
    if (open) setDraft(initial ? { ...initial } : emptyDraft())
  }, [open, initial])

  const mainLabel = draft.type === 'feedback' ? 'Feedback' : 'Description'
  const showRelatedTask = draft.type === 'observation' || draft.type === 'feedback' || draft.type === 'issue'
  const showNotes = draft.type === 'observation' || draft.type === 'feedback'
  const showSeverity = draft.type === 'issue' || draft.type === 'finding'
  const showSupportingEvidence = draft.type === 'finding'
  const canSave = draft.title.trim().length > 0 && draft.description.trim().length > 0

  function handleSave() {
    if (!canSave) return
    onSave(draft)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{initial ? 'Edit evidence' : 'Add evidence'}</DialogTitle>
          <DialogDescription>Capture what you observed, heard, or found while testing outside Solvr.</DialogDescription>
        </DialogHeader>

        <div className="flex max-h-[65vh] flex-col gap-4 overflow-y-auto py-1 pr-1">
          <div className="flex flex-col gap-1.5">
            <Label>Type</Label>
            <SegmentedControl
              aria-label="Evidence type"
              value={draft.type}
              onChange={(type) => setDraft((d) => ({ ...d, type: type as ValidationEvidenceType }))}
              options={EVIDENCE_TYPES.map((value) => ({ value, label: VALIDATION_EVIDENCE_TYPE_LABELS[value] }))}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="evidence-title">Title</Label>
            <Input id="evidence-title" value={draft.title} onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="evidence-description">{mainLabel}</Label>
            <Textarea
              id="evidence-description"
              rows={3}
              value={draft.description}
              onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="evidence-context">Context</Label>
            <Textarea
              id="evidence-context"
              rows={2}
              value={draft.context ?? ''}
              onChange={(e) => setDraft((d) => ({ ...d, context: e.target.value }))}
            />
          </div>

          {showSupportingEvidence && (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="evidence-supporting">Supporting evidence</Label>
              <Textarea
                id="evidence-supporting"
                rows={2}
                value={draft.supportingEvidence ?? ''}
                onChange={(e) => setDraft((d) => ({ ...d, supportingEvidence: e.target.value }))}
              />
            </div>
          )}

          {showRelatedTask && (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="evidence-related-task">{draft.type === 'issue' ? 'Related task or screen' : 'Related task'}</Label>
              <Input
                id="evidence-related-task"
                value={draft.relatedTask ?? ''}
                onChange={(e) => setDraft((d) => ({ ...d, relatedTask: e.target.value }))}
              />
            </div>
          )}

          {showSeverity && (
            <div className="flex flex-col gap-1.5">
              <Label>Severity (optional)</Label>
              <SegmentedControl
                aria-label="Severity"
                value={draft.severity ?? ''}
                onChange={(v) => setDraft((d) => ({ ...d, severity: v === '' ? undefined : (v as EvidenceSeverity) }))}
                options={SEVERITY_OPTIONS}
              />
            </div>
          )}

          {showNotes && (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="evidence-notes">Notes (optional)</Label>
              <Textarea
                id="evidence-notes"
                rows={2}
                value={draft.notes ?? ''}
                onChange={(e) => setDraft((d) => ({ ...d, notes: e.target.value }))}
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!canSave}>
            {initial ? 'Save changes' : 'Add evidence'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function ValidateEvidenceSection() {
  const { evidence, addEvidence, updateEvidence, deleteEvidence } = useValidationEvidence()
  const readOnly = useProjectStore((state) => state.activeProject?.isSample ?? false)
  const [filter, setFilter] = useState<ValidationEvidenceType | 'all'>('all')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<ValidationEvidenceItem | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<ValidationEvidenceItem | null>(null)

  const filtered = filter === 'all' ? evidence : evidence.filter((item) => item.type === filter)
  const sorted = [...filtered].sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  function openAdd() {
    setEditingItem(null)
    setDialogOpen(true)
  }

  function openEdit(item: ValidationEvidenceItem) {
    setEditingItem(item)
    setDialogOpen(true)
  }

  function handleSave(draft: EvidenceDraft) {
    if (editingItem) updateEvidence(editingItem.id, draft)
    else addEvidence(draft)
  }

  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between gap-4 space-y-0">
        <div>
          <CardTitle>Evidence</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            Observations, feedback, issues and findings collected while testing outside Solvr.
          </p>
        </div>
        {!readOnly && (
          <Button onClick={openAdd}>
            <Plus className="size-4" />
            Add evidence
          </Button>
        )}
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        {evidence.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border-strong bg-muted/40 p-6 text-center">
            <span className="flex size-10 items-center justify-center rounded-full bg-card text-muted-foreground shadow-xs">
              <ClipboardList className="size-5" aria-hidden />
            </span>
            <p className="text-sm text-muted-foreground">
              No validation evidence yet. Add observations, feedback, issues, or findings collected during testing.
            </p>
          </div>
        ) : (
          <>
            <SegmentedControl aria-label="Filter by evidence type" value={filter} onChange={setFilter} options={FILTER_OPTIONS} />

            {sorted.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No {filter === 'all' ? 'evidence' : VALIDATION_EVIDENCE_TYPE_LABELS[filter].toLowerCase()} yet.
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {sorted.map((item) => {
                  const Icon = TYPE_ICON[item.type]
                  return (
                    <div key={item.id} className="rounded-lg border border-border p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 items-start gap-2.5">
                          <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                            <Icon className="size-3.5" aria-hidden />
                          </span>
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <Badge variant={TYPE_BADGE_VARIANT[item.type]}>{VALIDATION_EVIDENCE_TYPE_LABELS[item.type]}</Badge>
                              {item.severity && <Badge variant="outline">{EVIDENCE_SEVERITY_LABELS[item.severity]}</Badge>}
                              <span className="text-xs text-muted-foreground">{new Date(item.createdAt).toLocaleDateString()}</span>
                            </div>
                            <p className="mt-1.5 text-sm font-bold text-foreground">{item.title}</p>
                            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                            {(item.relatedTask || item.context) && (
                              <p className="mt-1.5 text-xs text-muted-foreground">
                                {item.relatedTask && <span className="font-semibold text-foreground">{item.relatedTask}</span>}
                                {item.relatedTask && item.context && ' · '}
                                {item.context}
                              </p>
                            )}
                          </div>
                        </div>
                        {!readOnly && (
                          <div className="flex shrink-0 gap-1">
                            <Button variant="ghost" size="icon" aria-label={`Edit ${item.title}`} onClick={() => openEdit(item)}>
                              <Pencil className="size-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label={`Delete ${item.title}`}
                              onClick={() => setDeleteTarget(item)}
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}
      </CardContent>

      <EvidenceFormDialog open={dialogOpen} onOpenChange={setDialogOpen} initial={editingItem} onSave={handleSave} />

      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this evidence?</DialogTitle>
            <DialogDescription>This removes "{deleteTarget?.title}" permanently. This can't be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (deleteTarget) deleteEvidence(deleteTarget.id)
                setDeleteTarget(null)
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
