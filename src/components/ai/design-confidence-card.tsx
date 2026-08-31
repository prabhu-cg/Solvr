import { AlertTriangle } from 'lucide-react'
import { DeliverableCard } from '@/components/ai/deliverable-card'
import { EditField, EditStack } from '@/components/ai/content-views'
import { Textarea } from '@/components/ui/textarea'
import type { DesignConfidence } from '@/ai/schemas'
import { useDeliverable } from '@/hooks/use-deliverable'
import { cn } from '@/lib/utils'

const METERS: { key: keyof DesignConfidence; label: string }[] = [
  { key: 'problemClarity', label: 'Problem clarity' },
  { key: 'evidenceStrength', label: 'Evidence strength' },
  { key: 'solutionFit', label: 'Solution fit' },
  { key: 'feasibilityConfidence', label: 'Feasibility confidence' },
]

function ConfidenceMeter({ label, value }: { label: string; value: number }) {
  const tone = value >= 70 ? 'bg-success' : value >= 40 ? 'bg-warning' : 'bg-destructive'
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="font-semibold text-foreground">{label}</span>
        <span className="tabular-nums text-muted-foreground">{value}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div className={cn('h-full rounded-full', tone)} style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}

export function DesignConfidenceCard() {
  const { deliverable, generate, accept, updateContent, dismissStale } = useDeliverable<DesignConfidence>(
    'solution',
    'designConfidence',
  )
  return (
    <DeliverableCard
      label="Design Confidence"
      description="Not a validation score — a breakdown of how well-grounded this solution is so far."
      deliverable={deliverable}
      onGenerate={generate}
      onAccept={accept}
      onEditChange={updateContent}
      onDismissStale={dismissStale}
      renderView={(content) => (
        <div className="flex flex-col gap-5">
          <div className="rounded-lg border border-warning-soft bg-warning-soft p-3">
            <p className="flex items-start gap-2 text-sm font-semibold text-warning">
              <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden />
              This solution has not been usability tested in V1.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {METERS.map((meter) => (
              <ConfidenceMeter key={meter.key} label={meter.label} value={content[meter.key] as number} />
            ))}
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Validation status</p>
            <p className="mt-1 text-sm leading-relaxed text-foreground">{content.validationStatus}</p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Summary</p>
            <p className="mt-1 text-sm leading-relaxed text-foreground">{content.summary}</p>
          </div>
        </div>
      )}
      renderEdit={(content, onChange) => (
        <EditStack>
          {METERS.map((meter) => (
            <EditField key={meter.key} label={`${meter.label} (0-100)`}>
              <input
                type="range"
                min={0}
                max={100}
                value={content[meter.key] as number}
                onChange={(e) => onChange({ ...content, [meter.key]: Number(e.target.value) })}
                className="w-full accent-primary"
              />
            </EditField>
          ))}
          <EditField label="Validation status">
            <Textarea
              rows={2}
              value={content.validationStatus}
              onChange={(e) => onChange({ ...content, validationStatus: e.target.value })}
            />
          </EditField>
          <EditField label="Summary">
            <Textarea rows={2} value={content.summary} onChange={(e) => onChange({ ...content, summary: e.target.value })} />
          </EditField>
        </EditStack>
      )}
    />
  )
}
