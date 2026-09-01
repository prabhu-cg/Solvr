import { Crosshair, FileText, Frown, HelpCircle, Lightbulb, Route, Target, UserRound } from 'lucide-react'
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
import { type JourneyStep, StageJourneyRibbon } from '@/components/app/stage-journey-ribbon'
import { computeStageStatus, PROJECT_STAGE_ORDER, STAGE_DESCRIPTIONS } from '@/data/models'
import { useReadiness } from '@/hooks/use-readiness'
import type { ProjectOutletContext } from '@/pages/project-workspace-layout'

const DEFINE_STEPS: JourneyStep[] = [
  { key: 'insights', label: 'Insights', icon: Lightbulb, anchor: 'insights' },
  { key: 'userNeeds', label: 'User Needs', icon: Target, anchor: 'user-needs' },
  { key: 'painPoints', label: 'Pain Points', icon: Frown, anchor: 'pain-points' },
  { key: 'persona', label: 'Persona', icon: UserRound, anchor: 'persona' },
  { key: 'userJourney', label: 'Journey', icon: Route, anchor: 'user-journey' },
  { key: 'problemStatement', label: 'Problem', icon: FileText, anchor: 'problem-statement' },
  { key: 'hmw', label: 'How Might We', icon: HelpCircle, anchor: 'hmw' },
]

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
        icon={Crosshair}
      />

      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-8 sm:px-8">
        <StageJourneyRibbon steps={DEFINE_STEPS} content={project.stages.define.content} />

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

        <div id="insights">
          <InsightsCard />
        </div>
        <div id="user-needs">
          <UserNeedsCard />
        </div>
        <div id="pain-points">
          <PainPointsCard />
        </div>
        <div id="persona">
          <PersonaCard />
        </div>
        <div id="user-journey">
          <UserJourneyCard />
        </div>
        <div id="problem-statement">
          <ProblemStatementCard />
        </div>
        <div id="hmw">
          <HMWCard />
        </div>
      </div>
    </div>
  )
}
