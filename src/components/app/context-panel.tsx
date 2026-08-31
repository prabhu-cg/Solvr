import { Lightbulb, ListTodo, Sparkles, TriangleAlert } from 'lucide-react'
import type { Project, StageKey } from '@/data/models'
import { STAGE_LABELS } from '@/data/models'

interface ContextPanelProps {
  project: Project
  stage: StageKey | 'setup'
}

/**
 * Placeholder for AI guidance, readiness, gaps, assumptions and
 * recommendations. Phase 1 reserves the layout and structure only — no AI
 * runs yet, so every section explains what will appear here later.
 */
export function ContextPanel({ project, stage }: ContextPanelProps) {
  const stageLabel = stage === 'setup' ? 'Project Setup' : STAGE_LABELS[stage]

  return (
    <div className="flex h-full flex-col gap-6 overflow-y-auto p-5">
      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Guidance</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Once AI guidance is enabled, Solvr will use what you’ve entered for{' '}
          <span className="font-semibold text-foreground">{project.name}</span> to suggest what to
          do next in {stageLabel}.
        </p>
      </div>

      <PanelSection icon={Sparkles} title="Recommendations" emptyText="Recommendations will appear here once this stage is generating." />
      <PanelSection icon={TriangleAlert} title="Gaps" emptyText="Solvr will flag missing information here." />
      <PanelSection icon={ListTodo} title="Assumptions" emptyText="Assumptions worth confirming will be listed here." />
      <PanelSection icon={Lightbulb} title="Readiness" emptyText="A readiness breakdown for this stage will appear here." />
    </div>
  )
}

function PanelSection({
  icon: Icon,
  title,
  emptyText,
}: {
  icon: typeof Sparkles
  title: string
  emptyText: string
}) {
  return (
    <div className="rounded-lg border border-dashed border-border p-4">
      <div className="mb-1.5 flex items-center gap-2">
        <Icon className="size-4 text-muted-foreground" aria-hidden />
        <p className="text-sm font-bold text-foreground">{title}</p>
      </div>
      <p className="text-sm text-muted-foreground">{emptyText}</p>
    </div>
  )
}
