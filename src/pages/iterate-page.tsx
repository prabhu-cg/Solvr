import { ClipboardCheck, FileText, Frame, Layers, RefreshCw, Sparkles, Workflow } from 'lucide-react'
import { useOutletContext } from 'react-router-dom'
import { EmptyTabState } from '@/components/ai/content-views'
import { ImpactAnalysisCard, IterationRecommendationsCard } from '@/components/ai/iterate-analysis'
import { IterateFindingSelection } from '@/components/ai/iterate-findings'
import { RequirementProposalsCard, ScreenSpecProposalsCard, UserFlowProposalsCard } from '@/components/ai/iterate-proposals'
import { ReadinessPanel } from '@/components/ai/readiness-panel'
import { ExportMenu } from '@/components/app/export-menu'
import { StageHeader } from '@/components/app/stage-header'
import { type JourneyStep, StageJourneyRibbon } from '@/components/app/stage-journey-ribbon'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { computeStageStatus, PROJECT_STAGE_ORDER, STAGE_DESCRIPTIONS } from '@/data/models'
import { useIterateFindings } from '@/hooks/use-iterate-findings'
import { useReadiness } from '@/hooks/use-readiness'
import type { ProjectOutletContext } from '@/pages/project-workspace-layout'

const ITERATE_STEPS: JourneyStep[] = [
  { key: 'impactAnalysis', label: 'Impact', icon: Layers, anchor: 'impact-analysis' },
  { key: 'recommendations', label: 'Recommendations', icon: Sparkles, anchor: 'recommendations' },
  { key: 'userFlowProposals', label: 'User Flow', icon: Workflow, anchor: 'user-flow-proposals' },
  { key: 'screenSpecProposals', label: 'Screen Specs', icon: Frame, anchor: 'screen-spec-proposals' },
  { key: 'requirementProposals', label: 'Requirements', icon: FileText, anchor: 'requirement-proposals' },
]

export function IteratePage() {
  const { project } = useOutletContext<ProjectOutletContext>()
  const readinessHook = useReadiness('iterate')
  const { selectedIds } = useIterateFindings()

  const hasMovedPast = PROJECT_STAGE_ORDER.indexOf(project.currentStage) > PROJECT_STAGE_ORDER.indexOf('iterate')
  const status = computeStageStatus(project.stages.iterate, hasMovedPast)
  const hasSelection = selectedIds.length > 0

  return (
    <div>
      <StageHeader
        title="Iterate"
        description={STAGE_DESCRIPTIONS.iterate}
        status={status}
        readiness={project.stages.iterate.readinessScore}
        icon={RefreshCw}
      >
        <div className="mt-4 flex justify-end">
          <ExportMenu project={project} />
        </div>
      </StageHeader>

      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-8 sm:px-8">
        <div className="rounded-lg border border-border-strong bg-secondary/40 p-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            Use validated findings to identify what should change and understand how those changes affect your existing
            solution. Solvr will analyse the impact, recommend changes, and propose updates — but it will never overwrite your
            existing work without your explicit approval.
          </p>
          <p className="mt-2">
            Select one or more accepted findings, analyse their impact, then review every proposed update side by side with
            what exists today before accepting, editing, or rejecting it.
          </p>
        </div>

        <ReadinessPanel
          stageLabel="Iterate"
          readiness={readinessHook.readiness}
          status={readinessHook.status}
          error={readinessHook.error}
          onRun={readinessHook.run}
          reasoning={readinessHook.reasoning}
        />

        <Tabs defaultValue="findings">
          <TabsList>
            <TabsTrigger value="findings">Findings</TabsTrigger>
            <TabsTrigger value="impact">Impact</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            <TabsTrigger value="proposals">Proposed Updates</TabsTrigger>
          </TabsList>

          <TabsContent value="findings" className="flex flex-col gap-6">
            <IterateFindingSelection />
          </TabsContent>

          <TabsContent value="impact" className="flex flex-col gap-6">
            {hasSelection ? (
              <div id="impact-analysis">
                <ImpactAnalysisCard />
              </div>
            ) : (
              <EmptyTabState icon={Layers} message="Select one or more findings to analyse their impact." />
            )}
          </TabsContent>

          <TabsContent value="recommendations" className="flex flex-col gap-6">
            {hasSelection ? (
              <div id="recommendations">
                <IterationRecommendationsCard />
              </div>
            ) : (
              <EmptyTabState icon={Sparkles} message="Analyse findings to generate recommendations and proposed updates." />
            )}
          </TabsContent>

          <TabsContent value="proposals" className="flex flex-col gap-6">
            {hasSelection ? (
              <>
                <StageJourneyRibbon
                  steps={ITERATE_STEPS.filter((s) => s.key !== 'impactAnalysis' && s.key !== 'recommendations')}
                  content={project.stages.iterate.content}
                />
                <div id="user-flow-proposals">
                  <UserFlowProposalsCard />
                </div>
                <div id="screen-spec-proposals">
                  <ScreenSpecProposalsCard />
                </div>
                <div id="requirement-proposals">
                  <RequirementProposalsCard />
                </div>
              </>
            ) : (
              <EmptyTabState icon={ClipboardCheck} message="Analyse findings to generate recommendations and proposed updates." />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
