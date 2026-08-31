import { useOutletContext } from 'react-router-dom'
import {
  HMWCard,
  InsightsCard,
  PainPointsCard,
  PersonaCard,
  ProblemStatementCard,
  UserJourneyCard,
  UserNeedsCard,
} from '@/components/ai/define-deliverables'
import { ReadinessPanel } from '@/components/ai/readiness-panel'
import { StageHeader } from '@/components/app/stage-header'
import { computeStageStatus, PROJECT_STAGE_ORDER, STAGE_DESCRIPTIONS } from '@/data/models'
import { useReadiness } from '@/hooks/use-readiness'
import type { ProjectOutletContext } from '@/pages/project-workspace-layout'

export function DefinePage() {
  const { project } = useOutletContext<ProjectOutletContext>()
  const readinessHook = useReadiness('define')

  const hasMovedPast = PROJECT_STAGE_ORDER.indexOf(project.currentStage) > PROJECT_STAGE_ORDER.indexOf('define')
  const status = computeStageStatus(project.stages.define, hasMovedPast)

  return (
    <div>
      <StageHeader
        title="Define"
        description={STAGE_DESCRIPTIONS.define}
        status={status}
        readiness={project.stages.define.readinessScore}
      />

      <div className="flex flex-col gap-6 px-6 py-8 sm:px-8">
        <ReadinessPanel
          stageLabel="Define"
          readiness={readinessHook.readiness}
          status={readinessHook.status}
          error={readinessHook.error}
          onRun={readinessHook.run}
          reasoning={readinessHook.reasoning}
          nextStageHref={`/app/projects/${project.id}/ideate`}
          nextStageLabel="Ideate"
        />

        <InsightsCard />
        <UserNeedsCard />
        <PainPointsCard />
        <PersonaCard />
        <UserJourneyCard />
        <ProblemStatementCard />
        <HMWCard />
      </div>
    </div>
  )
}
