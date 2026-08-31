import { Plus, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppHeader } from '@/components/app/app-header'
import { NewProjectSheet } from '@/components/app/new-project-sheet'
import { ProjectCard } from '@/components/app/project-card'
import { Button } from '@/components/ui/button'
import { SAMPLE_PROJECT } from '@/data/sampleProject'
import { useProjectStore } from '@/store/useProjectStore'

export function ProjectsListPage() {
  const projects = useProjectStore((state) => state.projects)
  const projectsLoaded = useProjectStore((state) => state.projectsLoaded)
  const loadProjects = useProjectStore((state) => state.loadProjects)
  const createProject = useProjectStore((state) => state.createProject)
  const navigate = useNavigate()
  const [creatingSample, setCreatingSample] = useState(false)
  const [newProjectOpen, setNewProjectOpen] = useState(false)

  useEffect(() => {
    loadProjects()
  }, [loadProjects])

  const hasSample = projects.some((project) => project.isSample)

  async function handleTrySample() {
    setCreatingSample(true)
    try {
      const project = await createProject(SAMPLE_PROJECT)
      navigate(`/app/projects/${project.id}/setup`)
    } finally {
      setCreatingSample(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-secondary">
      <AppHeader />
      <main className="flex-1 py-10">
        <div className="mx-auto w-full max-w-6xl px-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Projects</h1>
              <p className="mt-1 text-sm text-muted-foreground">Where your design work stands today.</p>
            </div>
            <Button onClick={() => setNewProjectOpen(true)}>
              <Plus />
              New project
            </Button>
          </div>

          {!projectsLoaded ? (
            <p className="mt-10 text-sm text-muted-foreground">Loading projects…</p>
          ) : projects.length === 0 ? (
            <div className="mt-10 flex flex-col items-center gap-4 rounded-xl border border-dashed border-border-strong bg-card px-6 py-16 text-center">
              <h2 className="text-lg font-bold text-foreground">Start your first project</h2>
              <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
                Describe a problem you’re trying to solve, and Solvr will guide you through
                understanding it, defining the opportunity, and shaping a solution.
              </p>
              <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                <Button size="lg" onClick={() => setNewProjectOpen(true)}>
                  <Plus />
                  New project
                </Button>
                <Button variant="secondary" size="lg" onClick={handleTrySample} disabled={creatingSample}>
                  <Sparkles />
                  {creatingSample ? 'Loading sample…' : 'Try the sample project'}
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
              {!hasSample && (
                <div className="mt-8 flex justify-center">
                  <Button variant="secondary" onClick={handleTrySample} disabled={creatingSample}>
                    <Sparkles />
                    {creatingSample ? 'Loading sample…' : 'Try the sample project'}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <NewProjectSheet open={newProjectOpen} onOpenChange={setNewProjectOpen} />
    </div>
  )
}
