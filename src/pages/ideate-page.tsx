import { Blocks, Compass, Lightbulb, ListOrdered, Star, Telescope } from 'lucide-react'
import { useOutletContext } from 'react-router-dom'
import { ConceptSelectionPanel } from '@/components/ai/concept-selection-panel'
import { ConceptsCard, OpportunitiesCard, PrioritisationCard } from '@/components/ai/ideate-deliverables'
import { ReadinessPanel } from '@/components/ai/readiness-panel'
import { RecommendationCard } from '@/components/ai/recommendation-card'
import { StageHeader } from '@/components/app/stage-header'
import { type JourneyStep, StageJourneyRibbon } from '@/components/app/stage-journey-ribbon'
import { computeStageStatus, PROJECT_STAGE_ORDER, STAGE_DESCRIPTIONS } from '@/data/models'
import { useReadiness } from '@/hooks/use-readiness'
import type { ProjectOutletContext } from '@/pages/project-workspace-layout'

const IDEATE_STEPS: JourneyStep[] = [
  { key: 'opportunities', label: 'Opportunities', icon: Telescope, anchor: 'opportunities' },
  { key: 'concepts', label: 'Concepts', icon: Blocks, anchor: 'concepts' },
  { key: 'prioritisation', label: 'Prioritisation', icon: ListOrdered, anchor: 'prioritisation' },
  { key: 'recommendation', label: 'Recommendation', icon: Star, anchor: 'recommendation' },
  { key: 'select', label: 'Select', icon: Compass, anchor: 'select-concept' },
]

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
        icon={Lightbulb}
      />

      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-8 sm:px-8">
        <StageJourneyRibbon
          steps={IDEATE_STEPS}
          content={project.stages.ideate.content}
          overrides={{ select: project.stages.ideate.selectedConceptId ? 'complete' : 'idle' }}
        />

        <ReadinessPanel
          stageLabel="Ideate"
          readiness={readinessHook.readiness}
          status={readinessHook.status}
          error={readinessHook.error}
          onRun={readinessHook.run}
          reasoning={readinessHook.reasoning}
          nextStageHref={`/app/projects/${project.id}/solution`}
          nextStageLabel="Solution"
        />

        <div id="opportunities">
          <OpportunitiesCard />
        </div>
        <div id="concepts">
          <ConceptsCard />
        </div>
        <div id="prioritisation">
          <PrioritisationCard />
        </div>
        <div id="recommendation">
          <RecommendationCard />
        </div>
        <div id="select-concept">
          <ConceptSelectionPanel project={project} patchProject={patchProject} />
        </div>
      </div>
    </div>
  )
}
