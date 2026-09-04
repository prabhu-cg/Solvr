import { ClipboardList } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { StatusBadge } from '@/components/app/status-badge'
import type { Project } from '@/data/models'
import {
  computeStageStatus,
  getSetupStatus,
  PROJECT_STAGE_ORDER,
  STAGE_DESCRIPTIONS,
  STAGE_KEYS,
  STAGE_LABELS,
  STAGE_ORDER_NUMBER,
} from '@/data/models'
import { cn } from '@/lib/utils'

interface StageNavProps {
  project: Project
  onNavigate?: () => void
}

export function StageNav({ project, onNavigate }: StageNavProps) {
  const setupStatus = getSetupStatus(project)

  return (
    <div className="flex flex-col">
      <nav aria-label="Design process stages" className="flex flex-col gap-1 p-3">
        <NavLink
          to={`/app/projects/${project.id}/setup`}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              'group flex items-start gap-3 rounded-md px-3 py-2.5 text-sm transition-colors',
              isActive ? 'bg-accent text-accent-foreground' : 'text-foreground hover:bg-muted',
            )
          }
        >
          <ClipboardList className="mt-0.5 size-4 shrink-0" aria-hidden />
          <span className="flex-1">
            <span className="block font-bold">Project Setup</span>
          </span>
          <StatusBadge status={setupStatus} iconOnly className="mt-0.5" />
        </NavLink>

        <div className="my-1 border-t border-border" role="presentation" />

        {STAGE_KEYS.map((key) => {
          const stage = project.stages[key]
          const hasMovedPast = PROJECT_STAGE_ORDER.indexOf(project.currentStage) > PROJECT_STAGE_ORDER.indexOf(key)
          const status = computeStageStatus(stage, hasMovedPast)
          return (
            <NavLink
              key={key}
              to={`/app/projects/${project.id}/${key}`}
              onClick={onNavigate}
              title={STAGE_DESCRIPTIONS[key]}
              className={({ isActive }) =>
                cn(
                  'group flex items-start gap-3 rounded-md px-3 py-2.5 text-sm transition-colors',
                  isActive ? 'bg-accent text-accent-foreground' : 'text-foreground hover:bg-muted',
                )
              }
            >
              <span className="mt-0.5 w-4 shrink-0 text-xs font-bold text-muted-foreground">
                {STAGE_ORDER_NUMBER[key]}
              </span>
              <span className="flex-1">
                <span className="block font-bold">{STAGE_LABELS[key]}</span>
              </span>
              <StatusBadge status={status} iconOnly className="mt-0.5" />
            </NavLink>
          )
        })}
      </nav>
    </div>
  )
}
