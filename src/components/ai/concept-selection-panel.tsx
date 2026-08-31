import { Check, Compass } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { ConceptsWithIds, Recommendation } from '@/ai/schemas'
import type { Project } from '@/data/models'
import { cn } from '@/lib/utils'

interface ConceptSelectionPanelProps {
  project: Project
  patchProject: (patch: Partial<Omit<Project, 'id' | 'createdAt'>>) => void
}

/**
 * Persists `selectedConceptId` — the source Phase 4 (Solution) reads from.
 * Distinct from the Recommendation deliverable's own Accept (which just
 * marks that generated text reviewed): this is what actually decides which
 * concept the project moves forward with, and the user can override the
 * AI's recommendation at any time (Section 5, 7).
 */
export function ConceptSelectionPanel({ project, patchProject }: ConceptSelectionPanelProps) {
  const ideateStage = project.stages.ideate
  const concepts = ideateStage.content.concepts?.content as ConceptsWithIds | undefined
  const recommendation = ideateStage.content.recommendation?.content as Recommendation | undefined
  const selectedId = ideateStage.selectedConceptId
  const selectedConcept = concepts?.items.find((c) => c.id === selectedId)
  const recommendedConcept = recommendation
    ? concepts?.items.find((c) => c.name === recommendation.recommendedConceptName)
    : undefined
  const readOnly = !!project.isSample

  function selectConcept(id: string) {
    if (readOnly) return
    patchProject({
      stages: {
        ...project.stages,
        ideate: { ...ideateStage, selectedConceptId: id },
      },
    })
  }

  if (!concepts || concepts.items.length === 0) {
    return null
  }

  return (
    <Card className="border-border-strong">
      <CardHeader>
        <CardTitle>Selected direction</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {selectedConcept ? (
          <div className="rounded-lg border border-primary bg-accent p-4">
            <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-primary-text">
              <Check className="size-3.5" aria-hidden />
              Selected concept
            </p>
            <p className="mt-1 text-base font-bold text-foreground">{selectedConcept.name}</p>
            <p className="mt-1 text-sm text-muted-foreground">{selectedConcept.description}</p>
          </div>
        ) : recommendedConcept ? (
          <div className="flex flex-col items-start gap-3 rounded-lg border border-dashed border-border-strong p-4">
            <p className="text-sm text-muted-foreground">
              Solvr recommends <span className="font-semibold text-foreground">{recommendedConcept.name}</span>.
            </p>
            {!readOnly && (
              <Button onClick={() => selectConcept(recommendedConcept.id)}>
                <Check className="size-4" />
                Accept recommendation
              </Button>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2 rounded-lg border border-dashed border-border-strong p-4 text-sm text-muted-foreground">
            <Compass className="size-4 shrink-0" aria-hidden />
            Generate concepts (and optionally a recommendation) to choose a direction.
          </div>
        )}

        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">Choose another concept</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {concepts.items.map((concept) => (
              <button
                key={concept.id}
                type="button"
                onClick={() => selectConcept(concept.id)}
                disabled={readOnly}
                aria-pressed={concept.id === selectedId}
                className={cn(
                  'rounded-md border p-3 text-left text-sm transition-colors',
                  concept.id === selectedId
                    ? 'border-primary bg-accent font-semibold text-accent-foreground'
                    : 'border-border hover:bg-muted',
                  readOnly && 'cursor-default hover:bg-transparent',
                )}
              >
                {concept.name}
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
