import { Check, ClipboardCheck, Square } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { EVIDENCE_SEVERITY_LABELS } from '@/data/models'
import { useIterateFindings } from '@/hooks/use-iterate-findings'
import { cn } from '@/lib/utils'

const PRIORITY_VARIANT = { high: 'destructive', medium: 'warning', low: 'neutral' } as const

/**
 * Only accepted findings are ever shown here (Section 4/7) — draft and
 * rejected findings never appear, so there's no way to accidentally
 * iterate from something the user hasn't actually validated.
 */
export function IterateFindingSelection() {
  const { acceptedFindings, selectedIds, toggleSelect, selectAll, clearSelection } = useIterateFindings()

  if (acceptedFindings.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border-strong bg-muted/40 p-8 text-center">
        <span className="flex size-10 items-center justify-center rounded-full bg-card text-muted-foreground shadow-xs">
          <ClipboardCheck className="size-5" aria-hidden />
        </span>
        <p className="text-sm text-muted-foreground">
          No accepted findings are available. Return to Validate to review and accept findings before starting iteration.
        </p>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between gap-4 space-y-0">
        <div>
          <CardTitle>Accepted Findings</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            Select one or more findings to analyse their impact on the solution.
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button variant="secondary" size="sm" onClick={selectAll}>
            Select all
          </Button>
          <Button variant="secondary" size="sm" onClick={clearSelection}>
            Clear
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {acceptedFindings.map((finding) => {
          const selected = selectedIds.includes(finding.id)
          return (
            <button
              key={finding.id}
              type="button"
              onClick={() => toggleSelect(finding.id)}
              aria-pressed={selected}
              className={cn(
                'flex items-start gap-3 rounded-lg border p-4 text-left transition-colors',
                selected ? 'border-primary bg-accent' : 'border-border hover:bg-muted',
              )}
            >
              <span
                className={cn(
                  'mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border',
                  selected ? 'border-primary bg-primary text-primary-foreground' : 'border-border-strong text-transparent',
                )}
              >
                {selected ? <Check className="size-3.5" aria-hidden /> : <Square className="size-3.5" aria-hidden />}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-bold text-foreground">{finding.title}</p>
                  {finding.theme && <Badge variant="info">{finding.theme}</Badge>}
                  <Badge variant={PRIORITY_VARIANT[finding.priority]} className="capitalize">
                    {finding.priority} priority
                  </Badge>
                  <Badge variant="outline">{EVIDENCE_SEVERITY_LABELS[finding.severity]}</Badge>
                </div>
                <p className="mt-1.5 text-sm text-muted-foreground">{finding.description}</p>
              </div>
            </button>
          )
        })}
      </CardContent>
    </Card>
  )
}
