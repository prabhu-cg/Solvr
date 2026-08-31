import { CheckCircle2 } from 'lucide-react'
import { DeliverableCard } from '@/components/ai/deliverable-card'
import { EditField, EditStack, FieldListView, FieldView, ViewGrid } from '@/components/ai/content-views'
import { FlowStepList } from '@/components/ai/user-flow-view'
import { IATreeView } from '@/components/ai/ia-tree-view'
import { type RecordFieldSpec, RecordListEditor } from '@/components/ai/record-list-editor'
import { StringListEditor } from '@/components/ai/string-list-editor'
import { Badge } from '@/components/ui/badge'
import type {
  FlowStep,
  InformationArchitecture,
  ProductRequirements,
  RequirementItem,
  ScreenList,
  ScreenListItem,
  UserFlow,
  WireframeSpec,
  WireframeSpecs,
} from '@/ai/schemas'
import { useDeliverable } from '@/hooks/use-deliverable'

export function InformationArchitectureCard() {
  const { deliverable, generate, accept, updateContent, dismissStale, reasoning } = useDeliverable<InformationArchitecture>(
    'solution',
    'informationArchitecture',
  )
  return (
    <DeliverableCard
      label="Information Architecture"
      description="Product areas, sections and pages, built on the selected concept."
      deliverable={deliverable}
      reasoning={reasoning}
      onGenerate={generate}
      onAccept={accept}
      onEditChange={updateContent}
      onDismissStale={dismissStale}
      renderView={(content) => (
        <div className="flex flex-col gap-5">
          <IATreeView nodes={content.tree} />
          <ViewGrid>
            <FieldListView label="Primary navigation" items={content.primaryNavigation} />
            <FieldListView label="Secondary navigation" items={content.secondaryNavigation} />
          </ViewGrid>
        </div>
      )}
      renderEdit={(content, onChange) => (
        <EditStack>
          <div>
            <p className="mb-1.5 text-sm font-semibold text-foreground">Tree</p>
            <p className="mb-2 text-sm text-muted-foreground">
              Regenerate to reshape the tree — only navigation is directly editable here.
            </p>
            <IATreeView nodes={content.tree} />
          </div>
          <EditField label="Primary navigation">
            <StringListEditor
              value={content.primaryNavigation}
              onChange={(v) => onChange({ ...content, primaryNavigation: v })}
              itemLabel="nav item"
            />
          </EditField>
          <EditField label="Secondary navigation">
            <StringListEditor
              value={content.secondaryNavigation}
              onChange={(v) => onChange({ ...content, secondaryNavigation: v })}
              itemLabel="nav item"
            />
          </EditField>
        </EditStack>
      )}
    />
  )
}

const FLOW_STEP_FIELDS: RecordFieldSpec<FlowStep>[] = [
  { key: 'step', label: 'Step', kind: 'text' },
  { key: 'description', label: 'Description', kind: 'textarea' },
  { key: 'screen', label: 'Screen', kind: 'text' },
  { key: 'branches', label: 'Branches (for decision steps)', kind: 'stringList' },
]

export function UserFlowCard() {
  const { deliverable, generate, accept, updateContent, dismissStale, reasoning } = useDeliverable<UserFlow>('solution', 'userFlow')
  return (
    <DeliverableCard
      label="User Flow"
      description="Start to completion, with the decision points and recovery paths along the way."
      deliverable={deliverable}
      reasoning={reasoning}
      onGenerate={generate}
      onAccept={accept}
      onEditChange={updateContent}
      onDismissStale={dismissStale}
      renderView={(content) => (
        <div className="flex flex-col gap-6">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">Main path</p>
            <FlowStepList steps={content.mainPath} />
          </div>
          {content.alternatePaths.map((path, i) => (
            <div key={i}>
              <p className="mb-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">Alternate: {path.name}</p>
              <FlowStepList steps={path.steps} />
            </div>
          ))}
          {content.errorRecoveryPaths.map((path, i) => (
            <div key={i}>
              <p className="mb-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">Error recovery: {path.name}</p>
              <FlowStepList steps={path.steps} />
            </div>
          ))}
        </div>
      )}
      renderEdit={(content, onChange) => (
        <EditStack>
          <div>
            <p className="mb-2 text-sm font-semibold text-foreground">Main path</p>
            <RecordListEditor
              value={content.mainPath}
              onChange={(mainPath) => onChange({ ...content, mainPath })}
              fields={FLOW_STEP_FIELDS}
              itemLabel="Step"
              emptyItem={{ step: '', type: 'action', description: '', screen: '', branches: [] }}
            />
          </div>
          {(content.alternatePaths.length > 0 || content.errorRecoveryPaths.length > 0) && (
            <p className="text-sm text-muted-foreground">
              Alternate and error-recovery paths aren't directly editable yet — regenerate to reshape them.
            </p>
          )}
        </EditStack>
      )}
    />
  )
}

const SCREEN_LIST_FIELDS: RecordFieldSpec<ScreenListItem>[] = [
  { key: 'screen', label: 'Screen', kind: 'text' },
  { key: 'purpose', label: 'Purpose', kind: 'textarea' },
  { key: 'userGoal', label: 'User goal', kind: 'textarea' },
  { key: 'primaryAction', label: 'Primary action', kind: 'text' },
  { key: 'keyContent', label: 'Key content', kind: 'textarea' },
  { key: 'flowStep', label: 'Flow step', kind: 'text' },
]
const EMPTY_SCREEN: ScreenListItem = { screen: '', purpose: '', userGoal: '', primaryAction: '', keyContent: '', flowStep: '' }

export function ScreenListCard() {
  const { deliverable, generate, accept, updateContent, dismissStale, reasoning } = useDeliverable<ScreenList>('solution', 'screenList')
  return (
    <DeliverableCard
      label="Screen List"
      description="Every screen implied by the IA and flow."
      deliverable={deliverable}
      reasoning={reasoning}
      onGenerate={generate}
      onAccept={accept}
      onEditChange={updateContent}
      onDismissStale={dismissStale}
      renderView={(content) => (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs font-bold uppercase tracking-wide text-muted-foreground">
                <th className="py-2 pr-4">Screen</th>
                <th className="py-2 pr-4">Purpose</th>
                <th className="py-2 pr-4">User goal</th>
                <th className="py-2 pr-4">Primary action</th>
                <th className="py-2 pr-4">Key content</th>
                <th className="py-2 pr-4">Flow step</th>
              </tr>
            </thead>
            <tbody>
              {content.items.map((item, i) => (
                <tr key={i} className="border-b border-border align-top last:border-0">
                  <td className="py-3 pr-4 font-semibold text-foreground">{item.screen}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{item.purpose}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{item.userGoal}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{item.primaryAction}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{item.keyContent}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{item.flowStep}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      renderEdit={(content, onChange) => (
        <RecordListEditor
          value={content.items}
          onChange={(items) => onChange({ items })}
          fields={SCREEN_LIST_FIELDS}
          itemLabel="Screen"
          emptyItem={EMPTY_SCREEN}
        />
      )}
    />
  )
}

const WIREFRAME_STATE_LABELS: Record<string, string> = {
  default: 'Default',
  loading: 'Loading',
  empty: 'Empty',
  error: 'Error',
  success: 'Success',
  disabled: 'Disabled',
}

const WIREFRAME_FIELDS: RecordFieldSpec<WireframeSpec>[] = [
  { key: 'screen', label: 'Screen', kind: 'text' },
  { key: 'purpose', label: 'Purpose', kind: 'textarea' },
  { key: 'layout', label: 'Layout', kind: 'textarea' },
  { key: 'content', label: 'Content', kind: 'stringList' },
  { key: 'components', label: 'Components', kind: 'stringList' },
  { key: 'interactions', label: 'Interactions', kind: 'stringList' },
  { key: 'relevantStates', label: 'Relevant states', kind: 'stringList' },
  { key: 'accessibility', label: 'Accessibility', kind: 'stringList' },
]

export function WireframeSpecsCard() {
  const { deliverable, generate, accept, updateContent, dismissStale, reasoning } = useDeliverable<WireframeSpecs>(
    'solution',
    'wireframeSpecs',
  )
  return (
    <DeliverableCard
      label="Wireframe Specification"
      description="A structured spec for each primary screen — not a visual wireframe."
      deliverable={deliverable}
      reasoning={reasoning}
      onGenerate={generate}
      onAccept={accept}
      onEditChange={updateContent}
      onDismissStale={dismissStale}
      renderView={(content) => (
        <div className="flex flex-col gap-4">
          {content.items.map((spec, i) => (
            <div key={i} className="rounded-lg border border-border p-4">
              <p className="text-base font-bold text-foreground">{spec.screen}</p>
              <p className="mt-1 text-sm text-muted-foreground">{spec.purpose}</p>
              <div className="mt-3">
                <FieldView label="Layout" value={spec.layout} />
              </div>
              <ViewGrid>
                <FieldListView label="Content" items={spec.content} />
                <FieldListView label="Components" items={spec.components} />
                <FieldListView label="Interactions" items={spec.interactions} />
                <FieldListView label="Accessibility" items={spec.accessibility} />
              </ViewGrid>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {spec.relevantStates.map((state) => (
                  <Badge key={state} variant="outline">
                    {WIREFRAME_STATE_LABELS[state] ?? state}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      renderEdit={(content, onChange) => (
        <RecordListEditor
          value={content.items}
          onChange={(items) => onChange({ items })}
          fields={WIREFRAME_FIELDS}
          itemLabel="Spec"
          emptyItem={{
            screen: '',
            purpose: '',
            layout: '',
            content: [],
            components: [],
            interactions: [],
            relevantStates: ['default'],
            accessibility: [],
          }}
        />
      )}
    />
  )
}

const REQUIREMENT_FIELDS: RecordFieldSpec<RequirementItem>[] = [
  { key: 'requirement', label: 'Requirement', kind: 'text' },
  { key: 'userNeed', label: 'User need', kind: 'textarea' },
  { key: 'description', label: 'Description', kind: 'textarea' },
  { key: 'priority', label: 'Priority', kind: 'priority' },
  { key: 'acceptanceCriteria', label: 'Acceptance criteria', kind: 'stringList' },
  { key: 'dependencies', label: 'Dependencies', kind: 'stringList' },
  { key: 'assumptions', label: 'Assumptions', kind: 'stringList' },
]
const EMPTY_REQUIREMENT: RequirementItem = {
  requirement: '',
  userNeed: '',
  description: '',
  priority: 'should',
  acceptanceCriteria: [],
  dependencies: [],
  assumptions: [],
}

const PRIORITY_GROUPS: { key: RequirementItem['priority']; label: string }[] = [
  { key: 'must', label: 'Must have' },
  { key: 'should', label: 'Should have' },
  { key: 'could', label: 'Could have' },
]

export function ProductRequirementsCard() {
  const { deliverable, generate, accept, updateContent, dismissStale, reasoning } = useDeliverable<ProductRequirements>(
    'solution',
    'productRequirements',
  )
  return (
    <DeliverableCard
      label="Product Requirements"
      description="Concise, implementation-oriented requirements, grouped by priority."
      deliverable={deliverable}
      reasoning={reasoning}
      onGenerate={generate}
      onAccept={accept}
      onEditChange={updateContent}
      onDismissStale={dismissStale}
      renderView={(content) => (
        <div className="flex flex-col gap-6">
          {PRIORITY_GROUPS.map((group) => {
            const items = content.items.filter((item) => item.priority === group.key)
            if (items.length === 0) return null
            return (
              <div key={group.key}>
                <p className="mb-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  {group.label} ({items.length})
                </p>
                <div className="flex flex-col gap-3">
                  {items.map((item, i) => (
                    <div key={i} className="rounded-lg border border-border p-4">
                      <div className="mb-2 flex items-start justify-between gap-2">
                        <p className="text-sm font-bold text-foreground">{item.requirement}</p>
                        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
                      </div>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                      <ViewGrid>
                        <FieldView label="User need" value={item.userNeed} />
                        <FieldListView label="Acceptance criteria" items={item.acceptanceCriteria} />
                        <FieldListView label="Dependencies" items={item.dependencies} />
                        <FieldListView label="Assumptions" items={item.assumptions} />
                      </ViewGrid>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
      renderEdit={(content, onChange) => (
        <RecordListEditor
          value={content.items}
          onChange={(items) => onChange({ items })}
          fields={REQUIREMENT_FIELDS}
          itemLabel="Requirement"
          emptyItem={EMPTY_REQUIREMENT}
        />
      )}
    />
  )
}
