import { Check, Pencil, RotateCcw, Sparkles, X } from 'lucide-react'
import { type ReactNode, useState } from 'react'
import { GenerationStateBadge } from '@/components/ai/generation-state-badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { DeliverableState } from '@/data/models'

interface DeliverableCardProps<T> {
  label: string
  description: string
  deliverable: DeliverableState<T>
  onGenerate: () => Promise<void>
  onAccept: () => void
  renderView: (content: T) => ReactNode
  renderEdit: (content: T, onChange: (next: T) => void) => ReactNode
  onEditChange: (next: T) => void
}

export function DeliverableCard<T>({
  label,
  description,
  deliverable,
  onGenerate,
  onAccept,
  renderView,
  renderEdit,
  onEditChange,
}: DeliverableCardProps<T>) {
  const [editing, setEditing] = useState(false)
  const [confirmRegenerateOpen, setConfirmRegenerateOpen] = useState(false)

  const isBusy = deliverable.status === 'preparing' || deliverable.status === 'generating'
  const hasContent = deliverable.content !== undefined

  async function handleGenerateClick() {
    // Content already exists (generated, edited, or accepted) — never silently replace it.
    if (hasContent) {
      setConfirmRegenerateOpen(true)
      return
    }
    setEditing(false)
    await onGenerate()
  }

  async function confirmRegenerate() {
    setConfirmRegenerateOpen(false)
    setEditing(false)
    await onGenerate()
  }

  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between gap-4 space-y-0">
        <div>
          <CardTitle>{label}</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
        <GenerationStateBadge status={deliverable.status} className="mt-0.5 shrink-0" />
      </CardHeader>

      <CardContent>
        {deliverable.status === 'idle' && (
          <div className="flex flex-col items-start gap-3 rounded-lg border border-dashed border-border-strong p-5">
            <p className="text-sm text-muted-foreground">Nothing generated yet.</p>
            <Button onClick={handleGenerateClick}>
              <Sparkles className="size-4" />
              Generate
            </Button>
          </div>
        )}

        {isBusy && (
          <div className="flex items-center gap-2 rounded-lg border border-dashed border-border-strong p-5 text-sm text-muted-foreground">
            <GenerationStateBadge status={deliverable.status} />
          </div>
        )}

        {!isBusy && deliverable.status === 'failed' && (
          <div className="mb-4 rounded-lg border border-destructive-soft bg-destructive-soft p-4">
            <p className="text-sm font-semibold text-destructive">{deliverable.error ?? 'Generation failed.'}</p>
            <Button variant="secondary" size="sm" className="mt-3" onClick={handleGenerateClick}>
              <RotateCcw className="size-3.5" />
              Retry
            </Button>
          </div>
        )}

        {!isBusy && hasContent && (
          <>
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <Button variant="secondary" size="sm" onClick={() => setEditing((v) => !v)}>
                {editing ? <X className="size-3.5" /> : <Pencil className="size-3.5" />}
                {editing ? 'Done editing' : 'Edit'}
              </Button>
              <Button variant="secondary" size="sm" onClick={handleGenerateClick}>
                <RotateCcw className="size-3.5" />
                Regenerate
              </Button>
              {!deliverable.accepted && (
                <Button size="sm" onClick={onAccept}>
                  <Check className="size-3.5" />
                  Accept
                </Button>
              )}
              {deliverable.accepted && (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-success">
                  <Check className="size-3.5" />
                  Accepted
                </span>
              )}
            </div>

            {editing ? renderEdit(deliverable.content as T, onEditChange) : renderView(deliverable.content as T)}
          </>
        )}
      </CardContent>

      <Dialog open={confirmRegenerateOpen} onOpenChange={setConfirmRegenerateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Regenerate {label.toLowerCase()}?</DialogTitle>
            <DialogDescription>
              This replaces the current content, including any edits you've made. This can't be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setConfirmRegenerateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmRegenerate}>Regenerate</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
