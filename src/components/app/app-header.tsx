import { ChevronDown, FolderKanban, Info, Menu } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Logo } from '@/components/brand/logo'
import { ProjectMenu } from '@/components/app/project-menu'
import { SaveIndicator } from '@/components/app/save-indicator'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Project } from '@/data/models'
import { computeOverallReadiness } from '@/data/models'
import type { SaveStatus } from '@/store/useProjectStore'

interface AppHeaderProps {
  project?: Project | null
  saveStatus?: SaveStatus
  onOpenMobileNav?: () => void
  onOpenContextDrawer?: () => void
}

export function AppHeader({ project, saveStatus = 'idle', onOpenMobileNav, onOpenContextDrawer }: AppHeaderProps) {
  const readiness = project ? computeOverallReadiness(project) : null

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-card px-4">
      {project && onOpenMobileNav && (
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          aria-label="Open project navigation"
          onClick={onOpenMobileNav}
        >
          <Menu className="size-4" />
        </Button>
      )}

      <Link to="/" className="flex items-center" aria-label="Solvr — marketing site">
        <Logo size="sm" />
      </Link>

      {project && (
        <>
          <span className="h-5 w-px bg-border" aria-hidden />
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex min-w-0 items-center gap-1 rounded-md px-1.5 py-1 text-sm font-bold text-foreground transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  <span className="truncate">{project.name}</span>
                  <ChevronDown className="size-3.5 shrink-0 text-muted-foreground" aria-hidden />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem asChild>
                  <Link to="/app">
                    <FolderKanban className="size-4" />
                    Back to projects
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {project.isSample && (
              <Badge variant="primary" className="hidden shrink-0 sm:inline-flex">
                Sample project — fictional
              </Badge>
            )}
          </div>
        </>
      )}

      {!project && <div className="flex-1" />}

      <div className="flex items-center gap-3">
        <SaveIndicator status={saveStatus} className="hidden sm:inline-flex" />

        {readiness !== null && (
          <div
            className="hidden items-center gap-2 sm:flex"
            aria-label={`Overall readiness ${readiness} percent`}
          >
            <div className="h-1.5 w-24 overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-primary" style={{ width: `${readiness}%` }} />
            </div>
            <span className="text-xs font-semibold tabular-nums text-muted-foreground">{readiness}%</span>
          </div>
        )}

        {project && onOpenContextDrawer && (
          <Button
            variant="ghost"
            size="icon"
            aria-label="Open guidance panel"
            onClick={onOpenContextDrawer}
            className="xl:hidden"
          >
            <Info className="size-4" />
          </Button>
        )}

        {project && <ProjectMenu projectId={project.id} projectName={project.name} isSample={project.isSample} />}
      </div>
    </header>
  )
}
