import { ArrowRight } from 'lucide-react'
import { useCallback } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import { ProjectSetupForm } from '@/components/app/project-setup-form'
import { StageHeader } from '@/components/app/stage-header'
import { Button } from '@/components/ui/button'
import { getSetupStatus, computeSetupCompleteness } from '@/data/models'
import type { ProjectSetupValues } from '@/data/project-setup-schema'
import type { ProjectOutletContext } from '@/pages/project-workspace-layout'

export function ProjectSetupPage() {
  const { project, patchProject } = useOutletContext<ProjectOutletContext>()

  const handleFieldChange = useCallback(
    (values: ProjectSetupValues) => {
      patchProject(values)
    },
    [patchProject],
  )

  const status = getSetupStatus(project)
  const completeness = computeSetupCompleteness(project)

  return (
    <div>
      <StageHeader
        title="Project Setup"
        description="The foundation for everything else — what you’re solving, for whom, and why it matters to the business."
        status={status}
        readiness={completeness}
      />

      <div className="mx-auto w-full max-w-5xl px-6 py-8 sm:px-8">
        <div className="max-w-2xl">
          <ProjectSetupForm
            mode="edit"
            defaultValues={{
              name: project.name,
              problem: project.problem,
              productService: project.productService,
              targetUsers: project.targetUsers,
              businessGoal: project.businessGoal,
              constraints: project.constraints ?? '',
              evidence: project.evidence ?? '',
            }}
            onFieldChange={handleFieldChange}
            readOnly={project.isSample}
          />

          <div className="mt-8 flex justify-end border-t border-border pt-6">
            <Button asChild>
              <Link to={`/app/projects/${project.id}/discover`}>
                Continue to Discover
                <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
