import { Check, FileText, Frame, Trash2, Workflow, X } from 'lucide-react'
import type { ReactNode } from 'react'
import { DeliverableCard } from '@/components/ai/deliverable-card'
import { EditField, EditStack, FieldListView, FieldView, ViewGrid } from '@/components/ai/content-views'
import { FindingTraceList } from '@/components/ai/iterate-analysis'
import { type RecordFieldSpec, RecordListEditor } from '@/components/ai/record-list-editor'
import { StringListEditor } from '@/components/ai/string-list-editor'
import { ContextNote } from '@/components/ai/validate-deliverables'
import { FlowStepList } from '@/components/ai/user-flow-view'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import type {
  FlowStep,
  ProductRequirements,
  RequirementItem,
  RequirementProposalWithId,
  RequirementProposals,
  RequirementProposalsWithIds,
  ScreenSpecProposalWithId,
  ScreenSpecProposals,
  ScreenSpecProposalsWithIds,
  UserFlow,
  UserFlowProposalWithId,
  UserFlowProposals,
  UserFlowProposalsWithIds,
  WireframeSpec,
  WireframeSpecs,
} from '@/ai/schemas'
import { FINDING_STATUS_LABELS, type FindingStatus, markDownstreamStale, type Project } from '@/data/models'
import { useDeliverable } from '@/hooks/use-deliverable'
import { useProjectStore } from '@/store/useProjectStore'

const STATUS_VARIANT: Record<FindingStatus, 'success' | 'destructive' | 'neutral'> = {
  draft: 'neutral',
  accepted: 'success',
  rejected: 'destructive',
}

function CurrentVsProposed({ current, proposed }: { current: ReactNode; proposed: ReactNode }) {
  return (
    <ViewGrid>
      <div className="rounded-lg border border-border p-3.5">
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Current</p>
        {current}
      </div>
      <div className="rounded-lg border border-primary bg-accent/40 p-3.5">
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-primary-text">Proposed</p>
        {proposed}
      </div>
    </ViewGrid>
  )
}

/**
 * Writes accepted proposal content straight into the live Solution
 * deliverable — the only place in Iterate that ever touches Solution data,
 * and only ever from this explicit user action (Section 13/16: accept is
 * the sole path to "active", never automatic). Sets a clean, definite
 * DeliverableState directly rather than reusing `useDeliverable('solution',
 * localId).updateContent`, which would silently no-op the transition out of
 * `idle` when the deliverable had never been generated before.
 */
function acceptIntoSolution(project: Project, patchActiveProject: (patch: Partial<Omit<Project, 'id' | 'createdAt'>>) => void, localId: string, nextContent: unknown) {
  const existing = project.stages.solution.content[localId]
  const stagesWithStale = markDownstreamStale(project.stages, 'solution')
  patchActiveProject({
    stages: {
      ...stagesWithStale,
      solution: {
        ...stagesWithStale.solution,
        content: {
          ...stagesWithStale.solution.content,
          [localId]: {
            status: 'complete',
            content: nextContent,
            accepted: true,
            generatedAt: existing?.generatedAt ?? new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        },
      },
    },
  })
}

const FLOW_STEP_FIELDS: RecordFieldSpec<FlowStep>[] = [
  { key: 'step', label: 'Step', kind: 'text' },
  { key: 'description', label: 'Description', kind: 'textarea' },
  { key: 'screen', label: 'Screen', kind: 'text' },
  { key: 'branches', label: 'Branches (for decision steps)', kind: 'stringList' },
]

export function UserFlowProposalsCard() {
  const project = useProjectStore((state) => state.activeProject)
  const patchActiveProject = useProjectStore((state) => state.patchActiveProject)
  const currentUserFlow = project?.stages.solution.content.userFlow?.content as UserFlow | undefined
  const { deliverable, generate, accept, updateContent, dismissStale, reasoning } = useDeliverable<UserFlowProposalsWithIds>(
    'iterate',
    'userFlowProposals',
    { transformContent: (raw) => withIdsAndDraftStatus(raw as UserFlowProposals) },
  )

  function setStatus(content: UserFlowProposalsWithIds, id: string, status: FindingStatus) {
    updateContent({ ...content, items: content.items.map((item) => (item.id === id ? { ...item, status } : item)) })
  }

  function handleAccept(content: UserFlowProposalsWithIds, item: UserFlowProposalWithId) {
    if (!project) return
    acceptIntoSolution(project, patchActiveProject, 'userFlow', item.proposedContent)
    setStatus(content, item.id, 'accepted')
  }

  return (
    <DeliverableCard
      label="Updated User Flow"
      description="A proposed revision of the current user flow — nothing changes until you accept it."
      icon={Workflow}
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
              <div className="mb-3 flex items-center justify-between gap-2">
                <Badge variant={STATUS_VARIANT[item.status]}>{FINDING_STATUS_LABELS[item.status]}</Badge>
              </div>
              <FieldView label="Rationale" value={item.rationale} />
              <div className="mt-3">
                <CurrentVsProposed
                  current={currentUserFlow ? <FlowStepList steps={currentUserFlow.mainPath} /> : <p className="text-sm text-muted-foreground">Not yet generated.</p>}
                  proposed={<FlowStepList steps={item.proposedContent.mainPath} />}
                />
              </div>
              <div className="mt-3">
                <FindingTraceList ids={item.findingIds} />
              </div>
              <ProposalActions status={item.status} onAccept={() => handleAccept(content, item)} onReject={() => setStatus(content, item.id, 'rejected')} onResetToDraft={() => setStatus(content, item.id, 'draft')} />
            </div>
          ))}
        </div>
      )}
      renderEdit={(content, onChange) => (
        <div className="flex flex-col gap-4">
          {content.items.map((item, i) => (
            <div key={item.id} className="rounded-lg border border-border p-4">
              <EditStack>
                <EditField label="Rationale">
                  <Textarea
                    rows={2}
                    value={item.rationale}
                    onChange={(e) =>
                      onChange({ ...content, items: content.items.map((it, idx) => (idx === i ? { ...it, rationale: e.target.value } : it)) })
                    }
                  />
                </EditField>
                <EditField label="Proposed main path">
                  <RecordListEditor
                    value={item.proposedContent.mainPath}
                    onChange={(mainPath) =>
                      onChange({
                        ...content,
                        items: content.items.map((it, idx) => (idx === i ? { ...it, proposedContent: { ...it.proposedContent, mainPath } } : it)),
                      })
                    }
                    fields={FLOW_STEP_FIELDS}
                    itemLabel="Step"
                    emptyItem={{ step: '', type: 'action', description: '', screen: '', branches: [] }}
                  />
                </EditField>
              </EditStack>
            </div>
          ))}
        </div>
      )}
    />
  )
}

const SCREEN_SPEC_STATE_LABEL: Record<string, string> = {
  default: 'Default',
  loading: 'Loading',
  empty: 'Empty',
  error: 'Error',
  success: 'Success',
  disabled: 'Disabled',
}

function ScreenSpecView({ spec }: { spec: WireframeSpec | undefined }) {
  if (!spec) return <p className="text-sm text-muted-foreground">No current specification for this screen.</p>
  return (
    <div className="flex flex-col gap-2">
      <FieldView label="Purpose" value={spec.purpose} />
      <FieldView label="Layout" value={spec.layout} />
      <FieldListView label="Content" items={spec.content} />
      <FieldListView label="Components" items={spec.components} />
      <FieldListView label="Interactions" items={spec.interactions} />
      <FieldListView label="Accessibility" items={spec.accessibility} />
      <div className="flex flex-wrap gap-1.5">
        {spec.relevantStates.map((state) => (
          <Badge key={state} variant="outline">
            {SCREEN_SPEC_STATE_LABEL[state] ?? state}
          </Badge>
        ))}
      </div>
    </div>
  )
}

export function ScreenSpecProposalsCard() {
  const project = useProjectStore((state) => state.activeProject)
  const patchActiveProject = useProjectStore((state) => state.patchActiveProject)
  const currentSpecs = project?.stages.solution.content.wireframeSpecs?.content as WireframeSpecs | undefined
  const { deliverable, generate, accept, updateContent, dismissStale, reasoning } = useDeliverable<ScreenSpecProposalsWithIds>(
    'iterate',
    'screenSpecProposals',
    { transformContent: (raw) => withIdsAndDraftStatus(raw as ScreenSpecProposals) },
  )

  function setStatus(content: ScreenSpecProposalsWithIds, id: string, status: FindingStatus) {
    updateContent({ ...content, items: content.items.map((item) => (item.id === id ? { ...item, status } : item)) })
  }

  function handleAccept(content: ScreenSpecProposalsWithIds, item: ScreenSpecProposalWithId) {
    if (!project) return
    const items = currentSpecs?.items ?? []
    const idx = items.findIndex((s) => s.screen === item.screen)
    const nextItems = idx >= 0 ? items.map((s, i) => (i === idx ? item.proposedContent : s)) : [...items, item.proposedContent]
    acceptIntoSolution(project, patchActiveProject, 'wireframeSpecs', { items: nextItems })
    setStatus(content, item.id, 'accepted')
  }

  return (
    <DeliverableCard
      label="Updated Screen Specifications"
      description="Proposed changes to affected screens — nothing changes until you accept them."
      icon={Frame}
      deliverable={deliverable}
      reasoning={reasoning}
      onGenerate={generate}
      onAccept={accept}
      onEditChange={updateContent}
      onDismissStale={dismissStale}
      renderView={(content) => (
        <div className="flex flex-col gap-4">
          <ContextNote text={content.contextNote} />
          {content.items.map((item) => {
            const current = currentSpecs?.items.find((s) => s.screen === item.screen)
            return (
              <div key={item.id} className="rounded-lg border border-border p-4">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-foreground">{item.screen}</p>
                    <Badge variant="outline" className="capitalize">
                      {item.changeType.replace(/_/g, ' ')}
                    </Badge>
                  </div>
                  <Badge variant={STATUS_VARIANT[item.status]}>{FINDING_STATUS_LABELS[item.status]}</Badge>
                </div>
                <FieldView label="Rationale" value={item.rationale} />
                <div className="mt-3">
                  <CurrentVsProposed current={<ScreenSpecView spec={current} />} proposed={<ScreenSpecView spec={item.proposedContent} />} />
                </div>
                <div className="mt-3">
                  <FindingTraceList ids={item.findingIds} />
                </div>
                <ProposalActions status={item.status} onAccept={() => handleAccept(content, item)} onReject={() => setStatus(content, item.id, 'rejected')} onResetToDraft={() => setStatus(content, item.id, 'draft')} />
              </div>
            )
          })}
        </div>
      )}
      renderEdit={(content, onChange) => (
        <div className="flex flex-col gap-4">
          {content.items.map((item, i) => (
            <div key={item.id} className="rounded-lg border border-border p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Screen {i + 1}</p>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Remove proposal ${i + 1}`}
                  onClick={() => onChange({ ...content, items: content.items.filter((_, idx) => idx !== i) })}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
              <EditStack>
                <EditField label="Screen">
                  <Input
                    value={item.screen}
                    onChange={(e) => onChange({ ...content, items: content.items.map((it, idx) => (idx === i ? { ...it, screen: e.target.value } : it)) })}
                  />
                </EditField>
                <EditField label="Rationale">
                  <Textarea
                    rows={2}
                    value={item.rationale}
                    onChange={(e) => onChange({ ...content, items: content.items.map((it, idx) => (idx === i ? { ...it, rationale: e.target.value } : it)) })}
                  />
                </EditField>
                {(
                  [
                    ['purpose', 'Purpose', 'textarea'],
                    ['layout', 'Layout', 'textarea'],
                    ['content', 'Content', 'stringList'],
                    ['components', 'Components', 'stringList'],
                    ['interactions', 'Interactions', 'stringList'],
                    ['accessibility', 'Accessibility', 'stringList'],
                  ] as const
                ).map(([key, label, kind]) => (
                  <EditField key={key} label={`Proposed ${label.toLowerCase()}`}>
                    {kind === 'textarea' ? (
                      <Textarea
                        rows={2}
                        value={item.proposedContent[key] as string}
                        onChange={(e) =>
                          onChange({
                            ...content,
                            items: content.items.map((it, idx) => (idx === i ? { ...it, proposedContent: { ...it.proposedContent, [key]: e.target.value } } : it)),
                          })
                        }
                      />
                    ) : (
                      <StringListEditor
                        value={item.proposedContent[key] as string[]}
                        onChange={(v) =>
                          onChange({
                            ...content,
                            items: content.items.map((it, idx) => (idx === i ? { ...it, proposedContent: { ...it.proposedContent, [key]: v } } : it)),
                          })
                        }
                        itemLabel={label.toLowerCase()}
                      />
                    )}
                  </EditField>
                ))}
              </EditStack>
            </div>
          ))}
        </div>
      )}
    />
  )
}

const REQUIREMENT_PRIORITY_LABEL: Record<RequirementItem['priority'], string> = { must: 'Must have', should: 'Should have', could: 'Could have' }

function RequirementView({ item }: { item: RequirementItem | undefined }) {
  if (!item) return <p className="text-sm text-muted-foreground">No matching current requirement — this is new.</p>
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <p className="text-sm font-bold text-foreground">{item.requirement}</p>
        <Badge variant="outline">{REQUIREMENT_PRIORITY_LABEL[item.priority]}</Badge>
      </div>
      <FieldView label="Description" value={item.description} />
      <FieldListView label="Acceptance criteria" items={item.acceptanceCriteria} />
    </div>
  )
}

export function RequirementProposalsCard() {
  const project = useProjectStore((state) => state.activeProject)
  const patchActiveProject = useProjectStore((state) => state.patchActiveProject)
  const currentRequirements = project?.stages.solution.content.productRequirements?.content as ProductRequirements | undefined
  const { deliverable, generate, accept, updateContent, dismissStale, reasoning } = useDeliverable<RequirementProposalsWithIds>(
    'iterate',
    'requirementProposals',
    { transformContent: (raw) => withIdsAndDraftStatus(raw as RequirementProposals) },
  )

  function setStatus(content: RequirementProposalsWithIds, id: string, status: FindingStatus) {
    updateContent({ ...content, items: content.items.map((item) => (item.id === id ? { ...item, status } : item)) })
  }

  function handleAccept(content: RequirementProposalsWithIds, item: RequirementProposalWithId) {
    if (!project) return
    const items = currentRequirements?.items ?? []
    const idx = item.requirement ? items.findIndex((r) => r.requirement === item.requirement) : -1
    const nextItems = idx >= 0 ? items.map((r, i) => (i === idx ? item.proposedContent : r)) : [...items, item.proposedContent]
    acceptIntoSolution(project, patchActiveProject, 'productRequirements', { items: nextItems })
    setStatus(content, item.id, 'accepted')
  }

  return (
    <DeliverableCard
      label="Updated Product Requirements"
      description="Proposed requirement changes — nothing changes until you accept them."
      icon={FileText}
      deliverable={deliverable}
      reasoning={reasoning}
      onGenerate={generate}
      onAccept={accept}
      onEditChange={updateContent}
      onDismissStale={dismissStale}
      renderView={(content) => (
        <div className="flex flex-col gap-4">
          <ContextNote text={content.contextNote} />
          {content.items.map((item) => {
            const current = item.requirement ? currentRequirements?.items.find((r) => r.requirement === item.requirement) : undefined
            return (
              <div key={item.id} className="rounded-lg border border-border p-4">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <p className="text-sm font-bold text-foreground">{item.requirement || 'New requirement'}</p>
                  <Badge variant={STATUS_VARIANT[item.status]}>{FINDING_STATUS_LABELS[item.status]}</Badge>
                </div>
                <ViewGrid>
                  <FieldView label="Proposed change" value={item.proposedChange} />
                  <FieldView label="Rationale" value={item.rationale} />
                </ViewGrid>
                <div className="mt-3">
                  <CurrentVsProposed current={<RequirementView item={current} />} proposed={<RequirementView item={item.proposedContent} />} />
                </div>
                <div className="mt-3">
                  <FindingTraceList ids={item.findingIds} />
                </div>
                <ProposalActions status={item.status} onAccept={() => handleAccept(content, item)} onReject={() => setStatus(content, item.id, 'rejected')} onResetToDraft={() => setStatus(content, item.id, 'draft')} />
              </div>
            )
          })}
        </div>
      )}
      renderEdit={(content, onChange) => (
        <div className="flex flex-col gap-4">
          {content.items.map((item, i) => (
            <div key={item.id} className="rounded-lg border border-border p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Requirement {i + 1}</p>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Remove proposal ${i + 1}`}
                  onClick={() => onChange({ ...content, items: content.items.filter((_, idx) => idx !== i) })}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
              <EditStack>
                <EditField label="Proposed change">
                  <Textarea
                    rows={2}
                    value={item.proposedChange}
                    onChange={(e) => onChange({ ...content, items: content.items.map((it, idx) => (idx === i ? { ...it, proposedChange: e.target.value } : it)) })}
                  />
                </EditField>
                <EditField label="Rationale">
                  <Textarea
                    rows={2}
                    value={item.rationale}
                    onChange={(e) => onChange({ ...content, items: content.items.map((it, idx) => (idx === i ? { ...it, rationale: e.target.value } : it)) })}
                  />
                </EditField>
                <EditField label="Proposed requirement">
                  <Input
                    value={item.proposedContent.requirement}
                    onChange={(e) =>
                      onChange({
                        ...content,
                        items: content.items.map((it, idx) => (idx === i ? { ...it, proposedContent: { ...it.proposedContent, requirement: e.target.value } } : it)),
                      })
                    }
                  />
                </EditField>
                <EditField label="Proposed description">
                  <Textarea
                    rows={2}
                    value={item.proposedContent.description}
                    onChange={(e) =>
                      onChange({
                        ...content,
                        items: content.items.map((it, idx) => (idx === i ? { ...it, proposedContent: { ...it.proposedContent, description: e.target.value } } : it)),
                      })
                    }
                  />
                </EditField>
                <EditField label="Proposed acceptance criteria">
                  <StringListEditor
                    value={item.proposedContent.acceptanceCriteria}
                    onChange={(v) =>
                      onChange({
                        ...content,
                        items: content.items.map((it, idx) => (idx === i ? { ...it, proposedContent: { ...it.proposedContent, acceptanceCriteria: v } } : it)),
                      })
                    }
                    itemLabel="criterion"
                  />
                </EditField>
              </EditStack>
            </div>
          ))}
        </div>
      )}
    />
  )
}

function ProposalActions({
  status,
  onAccept,
  onReject,
  onResetToDraft,
}: {
  status: FindingStatus
  onAccept: () => void
  onReject: () => void
  onResetToDraft: () => void
}) {
  const readOnly = useProjectStore((state) => state.activeProject?.isSample ?? false)
  if (readOnly) return null
  if (status === 'draft') {
    return (
      <div className="mt-3 flex gap-2">
        <Button size="sm" onClick={onAccept}>
          <Check className="size-3.5" />
          Accept
        </Button>
        <Button variant="secondary" size="sm" onClick={onReject}>
          <X className="size-3.5" />
          Reject
        </Button>
      </div>
    )
  }
  return (
    <div className="mt-3">
      <Button variant="ghost" size="sm" onClick={onResetToDraft}>
        Reset to draft
      </Button>
    </div>
  )
}

function withIdsAndDraftStatus<T extends { items: unknown[]; contextNote: string | null }>(
  raw: T,
): { items: (T['items'][number] & { id: string; status: 'draft' })[]; contextNote: string | null } {
  return {
    items: raw.items.map((item) => ({ ...(item as object), id: crypto.randomUUID(), status: 'draft' as const })) as (T['items'][number] & {
      id: string
      status: 'draft'
    })[],
    contextNote: raw.contextNote,
  }
}
