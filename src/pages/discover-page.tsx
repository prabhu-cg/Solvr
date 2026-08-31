import { useOutletContext } from 'react-router-dom'
import {
  AssumptionsCard,
  InterviewQuestionsCard,
  ResearchPlanCard,
  ResearchSynthesisCard,
  SurveyQuestionsCard,
} from '@/components/ai/discover-deliverables'
import { ReadinessPanel } from '@/components/ai/readiness-panel'
import { StageHeader } from '@/components/app/stage-header'
import { computeStageStatus, PROJECT_STAGE_ORDER, STAGE_DESCRIPTIONS } from '@/data/models'
import { useReadiness } from '@/hooks/use-readiness'
import type { ProjectOutletContext } from '@/pages/project-workspace-layout'

export function DiscoverPage() {
  const { project } = useOutletContext<ProjectOutletContext>()
  const readinessHook = useReadiness('discover')

  const hasMovedPast = PROJECT_STAGE_ORDER.indexOf(project.currentStage) > PROJECT_STAGE_ORDER.indexOf('discover')
  const status = computeStageStatus(project.stages.discover, hasMovedPast)

  return (
    <div>
      <StageHeader
        title="Discover"
        description={STAGE_DESCRIPTIONS.discover}
        status={status}
        readiness={project.stages.discover.readinessScore}
      />

      <div className="flex flex-col gap-6 px-6 py-8 sm:px-8">
        <ReadinessPanel
          stageLabel="Discover"
          readiness={readinessHook.readiness}
          status={readinessHook.status}
          error={readinessHook.error}
          onRun={readinessHook.run}
          reasoning={readinessHook.reasoning}
          nextStageHref={`/app/projects/${project.id}/define`}
          nextStageLabel="Define"
        />

        <ResearchPlanCard />
        <InterviewQuestionsCard />
        <SurveyQuestionsCard />
        <AssumptionsCard />
        <ResearchSynthesisCard />
      </div>
    </div>
  )
}
