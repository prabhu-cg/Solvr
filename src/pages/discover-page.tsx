import { ClipboardList, Compass, Layers, MessagesSquare, Search, TriangleAlert } from 'lucide-react'
import type { ReactNode } from 'react'
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
import { type JourneyStep, StageJourneyRibbon } from '@/components/app/stage-journey-ribbon'
import { computeStageStatus, PROJECT_STAGE_ORDER, STAGE_DESCRIPTIONS } from '@/data/models'
import { useReadiness } from '@/hooks/use-readiness'
import type { ProjectOutletContext } from '@/pages/project-workspace-layout'

const DISCOVER_STEPS: JourneyStep[] = [
  { key: 'researchPlan', label: 'Plan', icon: ClipboardList, anchor: 'research-plan' },
  { key: 'interviewQuestions', label: 'Interviews', icon: MessagesSquare, anchor: 'interview-questions' },
  { key: 'surveyQuestions', label: 'Survey', icon: Compass, anchor: 'survey-questions' },
  { key: 'assumptions', label: 'Assumptions', icon: TriangleAlert, anchor: 'assumptions' },
  { key: 'researchSynthesis', label: 'Synthesis', icon: Layers, anchor: 'research-synthesis' },
]

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
        icon={Search}
      />

      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-8 sm:px-8">
        <StageJourneyRibbon steps={DISCOVER_STEPS} content={project.stages.discover.content} />

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

        <SectionLabel>Plan the research</SectionLabel>
        <div id="research-plan">
          <ResearchPlanCard />
        </div>
        <div id="interview-questions">
          <InterviewQuestionsCard />
        </div>
        <div id="survey-questions">
          <SurveyQuestionsCard />
        </div>

        <SectionLabel>Findings so far</SectionLabel>
        <div id="assumptions">
          <AssumptionsCard />
        </div>
        <div id="research-synthesis">
          <ResearchSynthesisCard />
        </div>
      </div>
    </div>
  )
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-3 pt-2 first:pt-0">
      <span className="shrink-0 text-xs font-bold uppercase tracking-wider text-muted-foreground">{children}</span>
      <div className="h-px flex-1 bg-border" aria-hidden />
    </div>
  )
}
