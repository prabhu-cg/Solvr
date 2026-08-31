import { ArrowDown } from 'lucide-react'
import { Link } from 'react-router-dom'
import { StatusBadge } from '@/components/app/status-badge'
import {
  computeSetupCompleteness,
  computeStageStatus,
  getSetupStatus,
  PROJECT_STAGE_ORDER,
  STAGE_KEYS,
  STAGE_LABELS,
  type Project,
  type ProjectStage,
  type StageStatus,
} from '@/data/models'

function stageAcceptedCount(project: Project, stage: (typeof STAGE_KEYS)[number]): { accepted: number; total: number } {
  const content = Object.values(project.stages[stage].content)
  const total = content.filter((d) => d.status !== 'idle').length
  const accepted = content.filter((d) => d.accepted).length
  return { accepted, total }
}

interface RowProps {
  label: string
  href: string
  status: StageStatus
  readiness?: number
  keyOutput: string
  isLast: boolean
}

function ProcessRow({ label, href, status, readiness, keyOutput, isLast }: RowProps) {
  return (
    <div className="flex flex-col items-center">
      <Link
        to={href}
        className="flex w-full max-w-md items-center justify-between gap-4 rounded-lg border border-border bg-card px-4 py-3 transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <div className="min-w-0">
          <p className="text-sm font-bold text-foreground">{label}</p>
          <p className="truncate text-xs text-muted-foreground">{keyOutput}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {typeof readiness === 'number' && (
            <span className="text-xs font-semibold tabular-nums text-muted-foreground">{readiness}%</span>
          )}
          <StatusBadge status={status} iconOnly />
        </div>
      </Link>
      {!isLast && <ArrowDown className="my-1.5 size-4 text-muted-foreground" aria-hidden />}
    </div>
  )
}

/** The full Setup -> Discover -> Define -> Ideate -> Solution pipeline, each stage linking back so the user can revisit and edit anything already done (Section 8). */
export function CompleteProcessView({ project }: { project: Project }) {
  const setupStatus = getSetupStatus(project)
  const setupCompleteness = computeSetupCompleteness(project)

  return (
    <div className="flex flex-col items-center">
      <ProcessRow
        label="Project Setup"
        href={`/app/projects/${project.id}/setup`}
        status={setupStatus}
        readiness={setupCompleteness}
        keyOutput={project.name}
        isLast={false}
      />
      {STAGE_KEYS.map((key, index) => {
        const hasMovedPast = PROJECT_STAGE_ORDER.indexOf(project.currentStage) > PROJECT_STAGE_ORDER.indexOf(key as ProjectStage)
        const status = computeStageStatus(project.stages[key], hasMovedPast)
        const { accepted, total } = stageAcceptedCount(project, key)
        const keyOutput = total === 0 ? 'Not started' : `${accepted} of ${total} output${total === 1 ? '' : 's'} accepted`
        return (
          <ProcessRow
            key={key}
            label={STAGE_LABELS[key]}
            href={`/app/projects/${project.id}/${key}`}
            status={status}
            readiness={project.stages[key].readinessScore || undefined}
            keyOutput={keyOutput}
            isLast={index === STAGE_KEYS.length - 1}
          />
        )
      })}
    </div>
  )
}

