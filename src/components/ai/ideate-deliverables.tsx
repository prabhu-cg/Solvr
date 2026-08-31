import { DeliverableCard } from '@/components/ai/deliverable-card'
import { EditStack, FieldListView, FieldView, ViewGrid } from '@/components/ai/content-views'
import { type RecordFieldSpec, RecordListEditor } from '@/components/ai/record-list-editor'
import type {
  Concept,
  ConceptsWithIds,
  ConceptWithId,
  OpportunityItem,
  Opportunities,
  Prioritisation,
  PrioritisationItem,
} from '@/ai/schemas'
import { useDeliverable } from '@/hooks/use-deliverable'

const OPPORTUNITY_FIELDS: RecordFieldSpec<OpportunityItem>[] = [
  { key: 'opportunity', label: 'Opportunity', kind: 'textarea' },
  { key: 'userNeed', label: 'User need', kind: 'textarea' },
  { key: 'supportingEvidence', label: 'Supporting evidence', kind: 'textarea' },
  { key: 'potentialImpact', label: 'Potential impact', kind: 'textarea' },
]
const EMPTY_OPPORTUNITY: OpportunityItem = {
  opportunity: '',
  userNeed: '',
  supportingEvidence: '',
  potentialImpact: '',
}

export function OpportunitiesCard() {
  const { deliverable, generate, accept, updateContent, dismissStale, reasoning } = useDeliverable<Opportunities>('ideate', 'opportunities')
  return (
    <DeliverableCard
      label="Opportunities"
      description="Opportunity areas drawn from Define — not solutions yet."
      deliverable={deliverable}
      reasoning={reasoning}
      onGenerate={generate}
      onAccept={accept}
      onEditChange={updateContent}
      onDismissStale={dismissStale}
      renderView={(content) => (
        <div className="flex flex-col gap-4">
          {content.items.map((item, i) => (
            <div key={i} className="rounded-lg border border-border p-4">
              <p className="text-sm font-bold text-foreground">{item.opportunity}</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                <FieldView label="User need" value={item.userNeed} />
                <FieldView label="Supporting evidence" value={item.supportingEvidence} />
                <FieldView label="Potential impact" value={item.potentialImpact} />
              </div>
            </div>
          ))}
        </div>
      )}
      renderEdit={(content, onChange) => (
        <RecordListEditor
          value={content.items}
          onChange={(items) => onChange({ items })}
          fields={OPPORTUNITY_FIELDS}
          itemLabel="Opportunity"
          emptyItem={EMPTY_OPPORTUNITY}
        />
      )}
    />
  )
}

const CONCEPT_FIELDS: RecordFieldSpec<ConceptWithId>[] = [
  { key: 'name', label: 'Name', kind: 'text' },
  { key: 'description', label: 'Description', kind: 'textarea' },
  { key: 'userValue', label: 'User value', kind: 'textarea' },
  { key: 'businessValue', label: 'Business value', kind: 'textarea' },
  { key: 'keyFunctionality', label: 'Key functionality', kind: 'stringList' },
  { key: 'advantages', label: 'Advantages', kind: 'stringList' },
  { key: 'risks', label: 'Risks', kind: 'stringList' },
  { key: 'dependencies', label: 'Dependencies', kind: 'stringList' },
  { key: 'openQuestions', label: 'Open questions', kind: 'stringList' },
  { key: 'supportingEvidence', label: 'Supporting evidence', kind: 'textarea' },
  { key: 'keyAssumptions', label: 'Key assumptions', kind: 'stringList' },
]

function emptyConcept(): ConceptWithId {
  return {
    id: crypto.randomUUID(),
    name: '',
    description: '',
    userValue: '',
    businessValue: '',
    keyFunctionality: [],
    advantages: [],
    risks: [],
    dependencies: [],
    openQuestions: [],
    supportingEvidence: '',
    keyAssumptions: [],
  }
}

function withStableIds(raw: { items: Concept[] }): ConceptsWithIds {
  return { items: raw.items.map((item) => ({ ...item, id: crypto.randomUUID() })) }
}

export function ConceptsCard() {
  const { deliverable, generate, accept, updateContent, dismissStale, reasoning } = useDeliverable<ConceptsWithIds>('ideate', 'concepts', {
    transformContent: (raw) => withStableIds(raw as { items: Concept[] }),
  })
  return (
    <DeliverableCard
      label="Concepts"
      description="3-5 substantially different approaches — not variations of the same idea."
      deliverable={deliverable}
      reasoning={reasoning}
      onGenerate={generate}
      onAccept={accept}
      onEditChange={updateContent}
      onDismissStale={dismissStale}
      renderView={(content) => (
        <div className="flex flex-col gap-4">
          {content.items.map((item) => (
            <div key={item.id} className="rounded-lg border border-border p-4">
              <p className="text-base font-bold text-foreground">{item.name}</p>
              <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
              <ViewGrid>
                <FieldView label="User value" value={item.userValue} />
                <FieldView label="Business value" value={item.businessValue} />
                <FieldListView label="Key functionality" items={item.keyFunctionality} />
                <FieldListView label="Advantages" items={item.advantages} />
                <FieldListView label="Risks" items={item.risks} />
                <FieldListView label="Dependencies" items={item.dependencies} />
                <FieldListView label="Open questions" items={item.openQuestions} />
                <FieldListView label="Key assumptions" items={item.keyAssumptions} />
              </ViewGrid>
              <div className="mt-3">
                <FieldView label="Supporting evidence" value={item.supportingEvidence} />
              </div>
            </div>
          ))}
        </div>
      )}
      renderEdit={(content, onChange) => (
        <RecordListEditor
          value={content.items}
          onChange={(items) => onChange({ items })}
          fields={CONCEPT_FIELDS}
          itemLabel="Concept"
          emptyItem={emptyConcept}
        />
      )}
    />
  )
}

const PRIORITISATION_FIELDS: RecordFieldSpec<PrioritisationItem>[] = [
  { key: 'conceptName', label: 'Concept', kind: 'text' },
  { key: 'userValue', label: 'User value (1-10)', kind: 'number' },
  { key: 'businessValue', label: 'Business value (1-10)', kind: 'number' },
  { key: 'feasibility', label: 'Feasibility (1-10)', kind: 'number' },
  { key: 'complexityRisk', label: 'Complexity/risk (1-10, higher = riskier)', kind: 'number' },
  { key: 'reasoning', label: 'Reasoning', kind: 'textarea' },
]
const EMPTY_PRIORITISATION_ITEM: PrioritisationItem = {
  conceptName: '',
  userValue: 5,
  businessValue: 5,
  feasibility: 5,
  complexityRisk: 5,
  reasoning: '',
}

export function PrioritisationCard() {
  const { deliverable, generate, accept, updateContent, dismissStale, reasoning } = useDeliverable<Prioritisation>('ideate', 'prioritisation')
  return (
    <DeliverableCard
      label="Prioritisation"
      description="Concepts scored for comparison — not objective measurements."
      deliverable={deliverable}
      reasoning={reasoning}
      onGenerate={generate}
      onAccept={accept}
      onEditChange={updateContent}
      onDismissStale={dismissStale}
      renderView={(content) => (
        <div className="flex flex-col gap-3">
          <p className="text-xs italic text-muted-foreground">
            These scores are AI-assisted assessments, not objective measurements.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  <th className="py-2 pr-4">Concept</th>
                  <th className="py-2 pr-4">User value</th>
                  <th className="py-2 pr-4">Business value</th>
                  <th className="py-2 pr-4">Feasibility</th>
                  <th className="py-2 pr-4">Complexity/risk</th>
                </tr>
              </thead>
              <tbody>
                {content.items.map((item, i) => (
                  <tr key={i} className="border-b border-border align-top last:border-0">
                    <td className="py-3 pr-4 font-semibold text-foreground">{item.conceptName}</td>
                    <td className="py-3 pr-4 tabular-nums">{item.userValue}/10</td>
                    <td className="py-3 pr-4 tabular-nums">{item.businessValue}/10</td>
                    <td className="py-3 pr-4 tabular-nums">{item.feasibility}/10</td>
                    <td className="py-3 pr-4 tabular-nums">{item.complexityRisk}/10</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-col gap-3">
            {content.items.map((item, i) => (
              <div key={i} className="rounded-lg border border-dashed border-border p-3">
                <p className="text-xs font-bold text-foreground">{item.conceptName} — reasoning</p>
                <p className="mt-1 text-sm text-muted-foreground">{item.reasoning}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      renderEdit={(content, onChange) => (
        <EditStack>
          <RecordListEditor
            value={content.items}
            onChange={(items) => onChange({ items })}
            fields={PRIORITISATION_FIELDS}
            itemLabel="Score"
            emptyItem={EMPTY_PRIORITISATION_ITEM}
          />
        </EditStack>
      )}
    />
  )
}

