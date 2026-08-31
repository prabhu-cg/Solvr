import { useOutletContext } from 'react-router-dom'
import { ConceptSelectionPanel } from '@/components/ai/concept-selection-panel'
import { ConceptsCard, OpportunitiesCard, PrioritisationCard } from '@/components/ai/ideate-deliverables'
import { ReadinessPanel } from '@/components/ai/readiness-panel'
import { RecommendationCard } from '@/components/ai/recommendation-card'
import { StageHeader } from '@/components/app/stage-header'
import { computeStageStatus, PROJECT_STAGE_ORDER, STAGE_DESCRIPTIONS } from '@/data/models'
import { useReadiness } from '@/hooks/use-readiness'
import type { ProjectOutletContext } from '@/pages/project-workspace-layout'

export function IdeatePage() {
  const { project, patchProject } = useOutletContext<ProjectOutletContext>()
  const readinessHook = useReadiness('ideate')

  const hasMovedPast = PROJECT_STAGE_ORDER.indexOf(project.currentStage) > PROJECT_STAGE_ORDER.indexOf('ideate')
  const status = computeStageStatus(project.stages.ideate, hasMovedPast)

  return (
    <div>
      <StageHeader
        title="Ideate"
        description={STAGE_DESCRIPTIONS.ideate}
        status={status}
        readiness={project.stages.ideate.readinessScore}
      />

      <div className="flex flex-col gap-6 px-6 py-8 sm:px-8">
        <ReadinessPanel
          stageLabel="Ideate"
          readiness={readinessHook.readiness}
          status={readinessHook.status}
          error={readinessHook.error}
          onRun={readinessHook.run}
          nextStageHref={`/app/projects/${project.id}/solution`}
          nextStageLabel="Solution"
        />

        <OpportunitiesCard />
        <ConceptsCard />
        <PrioritisationCard />
        <RecommendationCard />
        <ConceptSelectionPanel project={project} patchProject={patchProject} />
      </div>
    </div>
  )
}
