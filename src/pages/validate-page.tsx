import {
  ClipboardCheck,
  ClipboardList,
  FlaskConical,
  ListChecks,
  ListOrdered,
  MessagesSquare,
  Route,
  ShieldCheck,
  Sparkles,
  Tags,
  Target,
  TriangleAlert,
} from 'lucide-react'
import { useOutletContext } from 'react-router-dom'
import { EmptyTabState } from '@/components/ai/content-views'
import { ReadinessPanel } from '@/components/ai/readiness-panel'
import {
  PatternsCard,
  PrioritisedIssuesCard,
  ThemesCard,
  ValidationInsightsCard,
} from '@/components/ai/validate-analysis'
import {
  HeuristicReviewCard,
  SuccessCriteriaCard,
  TestScenariosCard,
  TestTasksCard,
  UsabilityTestPlanCard,
  ValidationInterviewQuestionsCard,
} from '@/components/ai/validate-deliverables'
import { ValidateEvidenceSection } from '@/components/ai/validate-evidence'
import { FindingsCard } from '@/components/ai/validate-findings'
import { ValidateGenerateAllCard } from '@/components/ai/validate-generate-all'
import { ExportMenu } from '@/components/app/export-menu'
import { StageHeader } from '@/components/app/stage-header'
import { type JourneyStep, StageJourneyRibbon } from '@/components/app/stage-journey-ribbon'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { computeStageStatus, PROJECT_STAGE_ORDER, STAGE_DESCRIPTIONS } from '@/data/models'
import { useReadiness } from '@/hooks/use-readiness'
import type { ProjectOutletContext } from '@/pages/project-workspace-layout'

const PLAN_STEPS: JourneyStep[] = [
  { key: 'testPlan', label: 'Test Plan', icon: ClipboardList, anchor: 'test-plan' },
  { key: 'testScenarios', label: 'Scenarios', icon: Route, anchor: 'test-scenarios' },
  { key: 'testTasks', label: 'Tasks', icon: ListChecks, anchor: 'test-tasks' },
  { key: 'interviewQuestions', label: 'Interview', icon: MessagesSquare, anchor: 'interview-questions' },
  { key: 'successCriteria', label: 'Success Criteria', icon: Target, anchor: 'success-criteria' },
  { key: 'heuristicReview', label: 'Heuristic Review', icon: ShieldCheck, anchor: 'heuristic-review' },
]

const ANALYSE_STEPS: JourneyStep[] = [
  { key: 'themes', label: 'Themes', icon: Tags, anchor: 'themes' },
  { key: 'patterns', label: 'Patterns', icon: ListOrdered, anchor: 'patterns' },
  { key: 'prioritisedIssues', label: 'Prioritised Issues', icon: TriangleAlert, anchor: 'prioritised-issues' },
  { key: 'insights', label: 'Insights', icon: Sparkles, anchor: 'insights' },
]

export function ValidatePage() {
  const { project } = useOutletContext<ProjectOutletContext>()
  const readinessHook = useReadiness('validate')

  const hasMovedPast = PROJECT_STAGE_ORDER.indexOf(project.currentStage) > PROJECT_STAGE_ORDER.indexOf('validate')
  const status = computeStageStatus(project.stages.validate, hasMovedPast)
  const hasEvidence = project.stages.validate.evidence.length > 0

  return (
    <div>
      <StageHeader
        title="Validate"
        description={STAGE_DESCRIPTIONS.validate}
        status={status}
        readiness={project.stages.validate.readinessScore}
        icon={FlaskConical}
      >
        <div className="mt-4 flex justify-end">
          <ExportMenu project={project} />
        </div>
      </StageHeader>

      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-8 sm:px-8">
        <div className="rounded-lg border border-border-strong bg-secondary/40 p-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            Prepare a structured plan to test whether your proposed solution meets user needs and project goals, then bring back
            what you learn. Solvr does not conduct usability testing, interviews, prototyping or heuristic reviews itself, and it
            never invents participants, sessions, quotes or results — it only analyses evidence you supply.
          </p>
          <p className="mt-2">
            Use the Plan materials to conduct testing with your preferred prototype, research, or testing tools. Then add what
            you found under Evidence, and use Analyse to turn it into themes, patterns, prioritised issues and insights you can
            review as Findings.
          </p>
        </div>

        <Tabs defaultValue="plan">
          <TabsList>
            <TabsTrigger value="plan">Plan</TabsTrigger>
            <TabsTrigger value="evidence">Evidence</TabsTrigger>
            <TabsTrigger value="analyse">Analyse</TabsTrigger>
            <TabsTrigger value="findings">Findings</TabsTrigger>
          </TabsList>

          <TabsContent value="plan" className="flex flex-col gap-6">
            <StageJourneyRibbon steps={PLAN_STEPS} content={project.stages.validate.content} />

            <ReadinessPanel
              stageLabel="Validate"
              readiness={readinessHook.readiness}
              status={readinessHook.status}
              error={readinessHook.error}
              onRun={readinessHook.run}
              reasoning={readinessHook.reasoning}
              nextStageHref={`/app/projects/${project.id}/iterate`}
              nextStageLabel="Iterate"
            />

            <ValidateGenerateAllCard />

            <div id="test-plan">
              <UsabilityTestPlanCard />
            </div>
            <div id="test-scenarios">
              <TestScenariosCard />
            </div>
            <div id="test-tasks">
              <TestTasksCard />
            </div>
            <div id="interview-questions">
              <ValidationInterviewQuestionsCard />
            </div>
            <div id="success-criteria">
              <SuccessCriteriaCard />
            </div>
            <div id="heuristic-review">
              <HeuristicReviewCard />
            </div>
          </TabsContent>

          <TabsContent value="evidence" className="flex flex-col gap-6">
            <ValidateEvidenceSection />
          </TabsContent>

          <TabsContent value="analyse" className="flex flex-col gap-6">
            {hasEvidence ? (
              <>
                <StageJourneyRibbon steps={ANALYSE_STEPS} content={project.stages.validate.content} />
                <div id="themes">
                  <ThemesCard />
                </div>
                <div id="patterns">
                  <PatternsCard />
                </div>
                <div id="prioritised-issues">
                  <PrioritisedIssuesCard />
                </div>
                <div id="insights">
                  <ValidationInsightsCard />
                </div>
              </>
            ) : (
              <EmptyTabState
                icon={Tags}
                message="Add evidence before generating analysis."
              />
            )}
          </TabsContent>

          <TabsContent value="findings" className="flex flex-col gap-6">
            {hasEvidence ? (
              <FindingsCard />
            ) : (
              <EmptyTabState icon={ClipboardCheck} message="Analyse evidence to identify potential findings." />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
