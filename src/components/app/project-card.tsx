import { Link } from 'react-router-dom'
import { ProjectMenu } from '@/components/app/project-menu'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import type { ProjectSummary } from '@/data/models'

const STAGE_ROUTE: Record<ProjectSummary['currentStage'], string> = {
  setup: 'setup',
  discover: 'discover',
  define: 'define',
  ideate: 'ideate',
  solution: 'solution',
}

const STAGE_DISPLAY: Record<ProjectSummary['currentStage'], string> = {
  setup: 'Project Setup',
  discover: 'Discover',
  define: 'Define',
  ideate: 'Ideate',
  solution: 'Solution',
}

function formatRelativeDate(iso: string): string {
  const date = new Date(iso)
  const diffMs = Date.now() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  if (diffDays <= 0) return 'Updated today'
  if (diffDays === 1) return 'Updated yesterday'
  if (diffDays < 30) return `Updated ${diffDays} days ago`
  return `Updated ${date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}`
}

export function ProjectCard({ project }: { project: ProjectSummary }) {
  return (
    <div className="group relative rounded-lg border border-border bg-card p-5 shadow-xs transition-shadow hover:shadow-md">
      <Link
        to={`/app/projects/${project.id}/${STAGE_ROUTE[project.currentStage]}`}
        className="absolute inset-0 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        aria-label={`Open ${project.name}`}
      />

      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">{STAGE_DISPLAY[project.currentStage]}</Badge>
          {project.isSample && <Badge variant="primary">Sample project — fictional</Badge>}
        </div>
        <div className="relative z-10">
          <ProjectMenu projectId={project.id} projectName={project.name} isSample={project.isSample} />
        </div>
      </div>

      <h3 className="text-base font-bold text-foreground">{project.name}</h3>
      <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{project.problem}</p>

      <div className="mt-4 flex items-center gap-3">
        <Progress value={project.overallReadiness} className="flex-1" aria-label="Overall readiness" />
        <span className="text-xs font-semibold tabular-nums text-muted-foreground">
          {project.overallReadiness}%
        </span>
      </div>

      <p className="mt-3 text-xs text-muted-foreground">{formatRelativeDate(project.updatedAt)}</p>
    </div>
  )
}
