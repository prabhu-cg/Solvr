import { Frame, LayoutGrid, LayoutTemplate, ListChecks, Network, Workflow } from 'lucide-react'
import { useOutletContext } from 'react-router-dom'
import { CompleteProcessView } from '@/components/app/complete-process-view'
import { DesignConfidenceCard } from '@/components/ai/design-confidence-card'
import { ExportMenu } from '@/components/app/export-menu'
import { ReadinessPanel } from '@/components/ai/readiness-panel'
import {
  InformationArchitectureCard,
  ProductRequirementsCard,
  ScreenListCard,
  UserFlowCard,
  WireframeSpecsCard,
} from '@/components/ai/solution-deliverables'
import { SolutionReviewPanel } from '@/components/app/solution-review-panel'
import { StageHeader } from '@/components/app/stage-header'
import { type JourneyStep, StageJourneyRibbon } from '@/components/app/stage-journey-ribbon'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { computeStageStatus, PROJECT_STAGE_ORDER, STAGE_DESCRIPTIONS } from '@/data/models'
import { useReadiness } from '@/hooks/use-readiness'
import type { ProjectOutletContext } from '@/pages/project-workspace-layout'

const SOLUTION_STEPS: JourneyStep[] = [
  { key: 'informationArchitecture', label: 'IA', icon: Network, anchor: 'information-architecture' },
  { key: 'userFlow', label: 'User Flow', icon: Workflow, anchor: 'user-flow' },
  { key: 'screenList', label: 'Screens', icon: LayoutGrid, anchor: 'screen-list' },
  { key: 'wireframeSpecs', label: 'Wireframes', icon: Frame, anchor: 'wireframe-specs' },
  { key: 'productRequirements', label: 'Requirements', icon: ListChecks, anchor: 'product-requirements' },
]

export function SolutionPage() {
  const { project } = useOutletContext<ProjectOutletContext>()
  const readinessHook = useReadiness('solution')

  const hasMovedPast = PROJECT_STAGE_ORDER.indexOf(project.currentStage) > PROJECT_STAGE_ORDER.indexOf('solution')
  const status = computeStageStatus(project.stages.solution, hasMovedPast)

  return (
    <div>
      <StageHeader
        title="Solution"
        description={STAGE_DESCRIPTIONS.solution}
        status={status}
        readiness={project.stages.solution.readinessScore}
        icon={LayoutTemplate}
      >
        <div className="mt-4 flex justify-end">
          <ExportMenu project={project} />
        </div>
      </StageHeader>

      <div className="mx-auto w-full max-w-5xl px-6 py-8 sm:px-8">
        <Tabs defaultValue="build">
          <TabsList>
            <TabsTrigger value="build">Build</TabsTrigger>
            <TabsTrigger value="review">Review &amp; Export</TabsTrigger>
          </TabsList>

          <TabsContent value="build" className="flex flex-col gap-6">
            <StageJourneyRibbon steps={SOLUTION_STEPS} content={project.stages.solution.content} />

            <ReadinessPanel
              stageLabel="Solution"
              readiness={readinessHook.readiness}
              status={readinessHook.status}
              error={readinessHook.error}
              onRun={readinessHook.run}
              reasoning={readinessHook.reasoning}
            />

            <div id="information-architecture">
              <InformationArchitectureCard />
            </div>
            <div id="user-flow">
              <UserFlowCard />
            </div>
            <div id="screen-list">
              <ScreenListCard />
            </div>
            <div id="wireframe-specs">
              <WireframeSpecsCard />
            </div>
            <div id="product-requirements">
              <ProductRequirementsCard />
            </div>
          </TabsContent>

          <TabsContent value="review" className="flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Journey</CardTitle>
              </CardHeader>
              <CardContent>
                <CompleteProcessView project={project} />
              </CardContent>
            </Card>

            <SolutionReviewPanel project={project} />
            <DesignConfidenceCard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
