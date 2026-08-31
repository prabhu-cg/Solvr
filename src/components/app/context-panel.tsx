import { Gauge, Lightbulb, ListTodo, Sparkles, TriangleAlert } from 'lucide-react'
import type { Project, ProjectStage } from '@/data/models'
import { STAGE_LABELS } from '@/data/models'

interface ContextPanelProps {
  project: Project
  stage: ProjectStage
}

/**
 * Live guidance for Discover/Define once a readiness check has run; a
 * placeholder everywhere else (Project Setup, Ideate, Solution) where no AI
 * assessment exists yet.
 */
export function ContextPanel({ project, stage }: ContextPanelProps) {
  const stageLabel = stage === 'setup' ? 'Project Setup' : STAGE_LABELS[stage]
  const readiness = stage === 'discover' || stage === 'define' ? project.stages[stage].readiness : undefined

  return (
    <div className="flex h-full flex-col gap-6 overflow-y-auto p-5">
      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Guidance</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {readiness ? (
            readiness.recommendation
          ) : (
            <>
              Once you run a readiness check, Solvr will use what you've entered for{' '}
              <span className="font-semibold text-foreground">{project.name}</span> to suggest what to
              do next in {stageLabel}.
            </>
          )}
        </p>
      </div>

      <PanelSection
        icon={Gauge}
        title="Readiness"
        emptyText="A readiness breakdown for this stage will appear here once you run a check."
        items={readiness ? [`${readiness.score}% — ${readiness.recommendedAction === 'proceed' ? 'ready to proceed' : 'gaps to resolve'}`] : undefined}
      />
      <PanelSection
        icon={Sparkles}
        title="Strengths"
        emptyText="Recommendations will appear here once this stage is generating."
        items={readiness?.strengths}
      />
      <PanelSection icon={TriangleAlert} title="Gaps" emptyText="Solvr will flag missing information here." items={readiness?.gaps} />
      <PanelSection
        icon={ListTodo}
        title="Critical assumptions"
        emptyText="Assumptions worth confirming will be listed here."
        items={readiness?.criticalAssumptions}
      />
    </div>
  )
}

function PanelSection({
  icon: Icon,
  title,
  emptyText,
  items,
}: {
  icon: typeof Sparkles
  title: string
  emptyText: string
  items?: string[]
}) {
  return (
    <div className="rounded-lg border border-dashed border-border p-4">
      <div className="mb-1.5 flex items-center gap-2">
        <Icon className="size-4 text-muted-foreground" aria-hidden />
        <p className="text-sm font-bold text-foreground">{title}</p>
      </div>
      {!items || items.length === 0 ? (
        <p className="text-sm text-muted-foreground">{emptyText}</p>
      ) : (
        <ul className="flex flex-col gap-1.5">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-1.5 text-sm text-foreground">
              <Lightbulb className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" aria-hidden />
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
