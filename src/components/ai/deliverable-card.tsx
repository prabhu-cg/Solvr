import { Check, Pencil, RotateCcw, Sparkles, TriangleAlert, X } from 'lucide-react'
import { type ReactNode, useState } from 'react'
import { GenerationStateBadge } from '@/components/ai/generation-state-badge'
import { ReasoningStream } from '@/components/ai/reasoning-stream'
import { Badge } from '@/components/ui/badge'
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
import { useProjectStore } from '@/store/useProjectStore'

interface DeliverableCardProps<T> {
  label: string
  description: string
  /** Small identifying glyph shown in the header badge — makes each deliverable recognizable at a glance. */
  icon?: typeof Sparkles
  deliverable: DeliverableState<T>
  onGenerate: () => Promise<void>
  onAccept: () => void
  renderView: (content: T) => ReactNode
  renderEdit: (content: T, onChange: (next: T) => void) => ReactNode
  onEditChange: (next: T) => void
  /** Clears the "may be affected" flag without regenerating — the user reviewed it and it's still fine. */
  onDismissStale?: () => void
  /** The model's live reasoning trace while generating — see `reasoning-stream.tsx`. */
  reasoning?: string
}

export function DeliverableCard<T>({
  label,
  description,
  icon: Icon = Sparkles,
  deliverable,
  onGenerate,
  onAccept,
  renderView,
  renderEdit,
  onEditChange,
  onDismissStale,
  reasoning,
}: DeliverableCardProps<T>) {
  const [editing, setEditing] = useState(false)
  const [confirmRegenerateOpen, setConfirmRegenerateOpen] = useState(false)
  const readOnly = useProjectStore((state) => state.activeProject?.isSample ?? false)

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
    <Card className="overflow-hidden">
      <CardHeader className="flex-row items-start justify-between gap-4 space-y-0">
        <div className="flex items-start gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
            <Icon className="size-4.5" aria-hidden />
          </span>
          <div>
            <CardTitle>{label}</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        <GenerationStateBadge status={deliverable.status} className="mt-0.5 shrink-0" />
      </CardHeader>

      <CardContent>
        {deliverable.status === 'idle' && (
          <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border-strong bg-muted/40 p-6 text-center">
            <span className="flex size-10 items-center justify-center rounded-full bg-card text-muted-foreground shadow-xs">
              <Icon className="size-5" aria-hidden />
            </span>
            <p className="text-sm text-muted-foreground">
              {readOnly ? 'Nothing generated.' : `Generate ${label.toLowerCase()} from what you've entered so far.`}
            </p>
            {!readOnly && (
              <Button onClick={handleGenerateClick}>
                <Sparkles className="size-4" />
                Generate
              </Button>
            )}
          </div>
        )}

        {isBusy && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <GenerationStateBadge status={deliverable.status} />
            </div>
            {deliverable.status === 'generating' && <ReasoningStream text={reasoning ?? ''} />}
          </div>
        )}

        {!isBusy && deliverable.status === 'failed' && (
          <div className="mb-4 rounded-lg border border-destructive-soft bg-destructive-soft p-4">
            <p className="text-sm font-semibold text-destructive">{deliverable.error ?? 'Generation failed.'}</p>
            {!readOnly && (
              <Button variant="secondary" size="sm" className="mt-3" onClick={handleGenerateClick}>
                <RotateCcw className="size-3.5" />
                Retry
              </Button>
            )}
          </div>
        )}

        {!isBusy && hasContent && !readOnly && deliverable.possiblyStale && (
          <div className="mb-4 flex flex-wrap items-center gap-3 rounded-lg border border-warning-soft bg-warning-soft p-3">
            <TriangleAlert className="size-4 shrink-0 text-warning" aria-hidden />
            <p className="flex-1 text-sm font-medium text-warning">
              An earlier-stage edit may affect this output. Review it, then regenerate if needed.
            </p>
            {onDismissStale && (
              <Button variant="secondary" size="sm" onClick={onDismissStale}>
                Still fine — dismiss
              </Button>
            )}
          </div>
        )}

        {!isBusy && hasContent && (
          <>
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {!readOnly && (
                <>
                  <Button variant="secondary" size="sm" onClick={() => setEditing((v) => !v)}>
                    {editing ? <X className="size-3.5" /> : <Pencil className="size-3.5" />}
                    {editing ? 'Done editing' : 'Edit'}
                  </Button>
                  <Button variant="secondary" size="sm" onClick={handleGenerateClick}>
                    <RotateCcw className="size-3.5" />
                    Regenerate
                  </Button>
                </>
              )}
              {!readOnly && !deliverable.accepted && (
                <Button size="sm" onClick={onAccept}>
                  <Check className="size-3.5" />
                  Accept
                </Button>
              )}
              {deliverable.accepted && (
                <Badge variant="success">
                  <Check className="size-3.5" />
                  Accepted
                </Badge>
              )}
            </div>

            {editing && !readOnly ? renderEdit(deliverable.content as T, onEditChange) : renderView(deliverable.content as T)}
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
