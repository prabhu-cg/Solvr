import { DeliverableCard } from '@/components/ai/deliverable-card'
import { EditField, EditStack, FieldListView } from '@/components/ai/content-views'
import { StringListEditor } from '@/components/ai/string-list-editor'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import type { Recommendation } from '@/ai/schemas'
import { useDeliverable } from '@/hooks/use-deliverable'

export function RecommendationCard() {
  const { deliverable, generate, accept, updateContent, dismissStale } = useDeliverable<Recommendation>('ideate', 'recommendation')
  return (
    <DeliverableCard
      label="Recommendation"
      description="One recommended concept, with the reasoning behind it — you decide whether to follow it."
      deliverable={deliverable}
      onGenerate={generate}
      onAccept={accept}
      onEditChange={updateContent}
      onDismissStale={dismissStale}
      renderView={(content) => (
        <div className="flex flex-col gap-4">
          <div className="rounded-lg border border-primary bg-accent p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-primary-text">Recommended</p>
            <p className="mt-1 text-base font-bold text-foreground">{content.recommendedConceptName}</p>
            <p className="mt-2 text-sm leading-relaxed text-foreground">{content.reasoning}</p>
          </div>
          <FieldListView label="Evidence supporting it" items={content.evidenceSupporting} />
          <FieldListView label="Assumptions" items={content.assumptions} />
          <FieldListView label="Risks" items={content.risks} />
          <FieldListView label="Open questions" items={content.openQuestions} />
        </div>
      )}
      renderEdit={(content, onChange) => (
        <EditStack>
          <EditField label="Recommended concept name">
            <Input
              value={content.recommendedConceptName}
              onChange={(e) => onChange({ ...content, recommendedConceptName: e.target.value })}
            />
          </EditField>
          <EditField label="Reasoning">
            <Textarea rows={3} value={content.reasoning} onChange={(e) => onChange({ ...content, reasoning: e.target.value })} />
          </EditField>
          <EditField label="Evidence supporting it">
            <StringListEditor
              value={content.evidenceSupporting}
              onChange={(v) => onChange({ ...content, evidenceSupporting: v })}
              itemLabel="item"
            />
          </EditField>
          <EditField label="Assumptions">
            <StringListEditor
              value={content.assumptions}
              onChange={(v) => onChange({ ...content, assumptions: v })}
              itemLabel="assumption"
            />
          </EditField>
          <EditField label="Risks">
            <StringListEditor value={content.risks} onChange={(v) => onChange({ ...content, risks: v })} itemLabel="risk" />
          </EditField>
          <EditField label="Open questions">
            <StringListEditor
              value={content.openQuestions}
              onChange={(v) => onChange({ ...content, openQuestions: v })}
              itemLabel="question"
            />
          </EditField>
        </EditStack>
      )}
    />
  )
}
