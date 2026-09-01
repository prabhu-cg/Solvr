import { useEffect, useRef, useState } from 'react'
import { Navigate, Outlet, useLocation, useParams } from 'react-router-dom'
import { AppHeader } from '@/components/app/app-header'
import { ContextPanel } from '@/components/app/context-panel'
import { StageNav } from '@/components/app/stage-nav'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import type { Project, ProjectStage } from '@/data/models'
import { advanceCurrentStage, PROJECT_STAGE_ORDER } from '@/data/models'
import { useProjectStore } from '@/store/useProjectStore'

export interface ProjectOutletContext {
  project: Project
  patchProject: (patch: Partial<Omit<Project, 'id' | 'createdAt'>>) => void
}

/** Derived from the URL rather than a route param — stage routes are static (not `:stage`), so this works regardless of how they're nested. */
function stageFromPathname(pathname: string): ProjectStage {
  const lastSegment = pathname.split('/').filter(Boolean).pop()
  return PROJECT_STAGE_ORDER.includes(lastSegment as ProjectStage) ? (lastSegment as ProjectStage) : 'setup'
}

export function ProjectWorkspaceLayout() {
  const { projectId } = useParams<{ projectId: string }>()
  const location = useLocation()
  const stage = stageFromPathname(location.pathname)
  const activeProject = useProjectStore((state) => state.activeProject)
  const saveStatus = useProjectStore((state) => state.saveStatus)
  const loadProject = useProjectStore((state) => state.loadProject)
  const clearActiveProject = useProjectStore((state) => state.clearActiveProject)
  const patchActiveProject = useProjectStore((state) => state.patchActiveProject)

  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [contextPanelOpen, setContextPanelOpen] = useState(false)
  // Tracked locally (rather than read off the store) so the very first render
  // of a fresh mount — before the async fetch below has resolved — can't be
  // mistaken for "fetched and not found" and bounce the user back to /app.
  const [status, setStatus] = useState<'loading' | 'ready' | 'not-found'>('loading')
  const requestedId = useRef<string | undefined>(undefined)

  useEffect(() => {
    if (!projectId) return
    requestedId.current = projectId
    setStatus('loading')
    loadProject(projectId).then((project) => {
      if (requestedId.current !== projectId) return // a newer request superseded this one
      setStatus(project ? 'ready' : 'not-found')
    })
    return () => clearActiveProject()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId])

  // The badge on the project card shows how far a project has actually
  // progressed. Visiting a later stage is the only signal Phase 1 has for
  // "progress" (no AI/deliverables yet), so arriving at a stage advances the
  // project there — it never regresses just because the user looks back at
  // an earlier stage.
  useEffect(() => {
    if (!activeProject) return
    const next = advanceCurrentStage(activeProject.currentStage, stage)
    if (next !== activeProject.currentStage) {
      patchActiveProject({ currentStage: next })
    }
  }, [activeProject, stage, patchActiveProject])

  if (status === 'not-found') {
    return <Navigate to="/app" replace />
  }

  if (status === 'loading' || !activeProject) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary">
        <p className="text-sm text-muted-foreground">Loading project…</p>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col">
      <AppHeader
        project={activeProject}
        saveStatus={saveStatus}
        onOpenMobileNav={() => setMobileNavOpen(true)}
        onOpenContextDrawer={() => setContextPanelOpen(true)}
      />

      <div className="flex min-h-0 flex-1">
        <aside className="hidden w-64 shrink-0 overflow-y-auto border-r border-border bg-card lg:block">
          <StageNav project={activeProject} />
        </aside>

        <main className="min-w-0 flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-5xl">
            <Outlet context={{ project: activeProject, patchProject: patchActiveProject } satisfies ProjectOutletContext} />
          </div>
        </main>

        <aside className="hidden w-80 shrink-0 overflow-y-auto border-l border-border bg-card xl:block">
          <ContextPanel project={activeProject} stage={stage} />
        </aside>
      </div>

      <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
        <SheetContent side="left" className="max-w-72 p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Project navigation</SheetTitle>
          </SheetHeader>
          <StageNav project={activeProject} onNavigate={() => setMobileNavOpen(false)} />
        </SheetContent>
      </Sheet>

      <Sheet open={contextPanelOpen} onOpenChange={setContextPanelOpen}>
        <SheetContent side="right" className="p-0 xl:hidden">
          <SheetHeader>
            <SheetTitle>Guidance</SheetTitle>
          </SheetHeader>
          <ContextPanel project={activeProject} stage={stage} />
        </SheetContent>
      </Sheet>
    </div>
  )
}
