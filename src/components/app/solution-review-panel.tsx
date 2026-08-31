import { FieldListView, FieldView, ViewGrid } from '@/components/ai/content-views'
import { IATreeView } from '@/components/ai/ia-tree-view'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type {
  Concepts,
  InformationArchitecture,
  Opportunities,
  ProblemStatement,
  ProductRequirements,
  Recommendation,
  ScreenList,
  UserFlow,
  Assumptions,
} from '@/ai/schemas'
import type { Project } from '@/data/models'

function getContent<T>(project: Project, stage: keyof Project['stages'], localId: string): T | undefined {
  return project.stages[stage].content[localId]?.content as T | undefined
}

/** The compiled Section 6 "Solution Review" — read-only, assembled live from already-accepted content, no extra AI call. */
export function SolutionReviewPanel({ project }: { project: Project }) {
  const problemStatement = getContent<ProblemStatement>(project, 'define', 'problemStatement')
  const concepts = getContent<Concepts>(project, 'ideate', 'concepts')
  const selectedConcept = concepts?.items.find((c) => (c as { id?: string }).id === project.stages.ideate.selectedConceptId)
  const opportunities = getContent<Opportunities>(project, 'ideate', 'opportunities')
  const recommendation = getContent<Recommendation>(project, 'ideate', 'recommendation')
  const ia = getContent<InformationArchitecture>(project, 'solution', 'informationArchitecture')
  const flow = getContent<UserFlow>(project, 'solution', 'userFlow')
  const screens = getContent<ScreenList>(project, 'solution', 'screenList')
  const requirements = getContent<ProductRequirements>(project, 'solution', 'productRequirements')
  const discoverAssumptions = getContent<Assumptions>(project, 'discover', 'assumptions')

  const mustHaves = requirements?.items.filter((r) => r.priority === 'must').map((r) => r.requirement) ?? []
  const assumptions = [
    ...(discoverAssumptions?.items.map((a) => a.assumption) ?? []),
    ...(selectedConcept?.keyAssumptions ?? []),
    ...(recommendation?.assumptions ?? []),
  ]
  const risks = [...(selectedConcept?.risks ?? []), ...(recommendation?.risks ?? [])]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Solution Review</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <ViewGrid>
          <FieldView label="Original problem" value={project.problem} />
          <FieldView label="Product / service" value={project.productService} />
          <FieldView label="Target user" value={project.targetUsers} />
          <FieldView label="Business goal" value={project.businessGoal} />
        </ViewGrid>

        <FieldView label="Defined problem" value={problemStatement?.problem ?? 'Not yet defined.'} />

        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Selected concept</p>
          {selectedConcept ? (
            <div className="mt-1 rounded-lg border border-border p-3">
              <p className="text-sm font-bold text-foreground">{selectedConcept.name}</p>
              <p className="mt-1 text-sm text-muted-foreground">{selectedConcept.description}</p>
            </div>
          ) : (
            <p className="mt-1 text-sm text-muted-foreground">No concept selected yet.</p>
          )}
        </div>

        <FieldListView label="Key opportunities" items={opportunities?.items.map((o) => o.opportunity) ?? []} />

        <div>
          <p className="mb-1 text-xs font-bold uppercase tracking-wide text-muted-foreground">Information architecture</p>
          {ia ? <IATreeView nodes={ia.tree} /> : <p className="text-sm text-muted-foreground">Not yet generated.</p>}
        </div>

        <FieldView
          label="User flow"
          value={flow ? `${flow.mainPath.length} steps, from "${flow.mainPath[0]?.step}" to "${flow.mainPath.at(-1)?.step}".` : 'Not yet generated.'}
        />

        <FieldListView label="Key screens" items={screens?.items.map((s) => s.screen) ?? []} />
        <FieldListView label="Major requirements (must have)" items={mustHaves} />
        <FieldListView label="Assumptions" items={assumptions} />
        <FieldListView label="Risks" items={risks} />
      </CardContent>
    </Card>
  )
}
