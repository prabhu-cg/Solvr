import { groq } from '@ai-sdk/groq'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { NoObjectGeneratedError, Output, streamText } from 'ai'
import { z } from 'zod'
import {
  buildTaskPrompt,
  truncateContextJson,
  AI_SYSTEM_PROMPT,
  AI_TASKS,
  READINESS_SCHEMA,
  READINESS_TASK_INSTRUCTION,
} from '../src/ai/tasks.js'
import type { AIProjectContext } from '../src/ai/context.js'

// Server-only: never exposed to the client. The model/provider is chosen
// here in one place — swapping providers later (a different Groq model, a
// different provider package, or back through Vercel AI Gateway) is a
// one-line change, and nothing in the frontend needs to know or care which
// model answered. Reads GROQ_API_KEY from the server environment — never
// sent to or visible from the client.
const MODEL = groq('openai/gpt-oss-120b')

const projectContextSchema = z.object({
  project: z.object({
    name: z.string(),
    problem: z.string(),
    productService: z.string(),
    targetUsers: z.string(),
    businessGoal: z.string(),
    constraints: z.string().optional(),
    evidence: z.string().optional(),
  }),
  currentStage: z.enum(['discover', 'define', 'ideate', 'solution', 'validate', 'iterate']),
  priorAcceptedDeliverables: z.record(z.string(), z.unknown()),
  currentStageDeliverables: z.record(z.string(), z.unknown()),
  knownGaps: z.array(z.string()),
  knownAssumptions: z.array(z.string()),
  selectedConcept: z.unknown().optional(),
  validationEvidence: z
    .array(
      z.object({
        id: z.string(),
        type: z.string(),
        title: z.string(),
        description: z.string(),
        context: z.string().optional(),
        relatedTask: z.string().optional(),
        severity: z.string().optional(),
      }),
    )
    .optional(),
  selectedFindings: z
    .array(
      z.object({
        id: z.string(),
        title: z.string(),
        description: z.string(),
        theme: z.string(),
        severity: z.string(),
        priority: z.string(),
        insight: z.string(),
      }),
    )
    .optional(),
  currentSolutionContent: z.record(z.string(), z.unknown()).optional(),
})

/**
 * Rebuilds the parsed request body into `AIProjectContext` field by field
 * rather than passing the zod-inferred object straight through. The two
 * shapes are meant to be identical, but Vercel's separate type-check pass
 * over `api/` (distinct from this repo's own `tsc -b`) has been seen to
 * infer zod object fields as optional where this repo's own build does
 * not — an explicit, field-by-field reconstruction checks each value
 * against its real required type instead of relying on whole-object
 * structural comparison, so it can't be caught by that. This has to go
 * all the way down: reconstructing only the outer `project` object was
 * not enough, the same mismatch reappeared one level down on the two
 * array fields below until they were reconstructed the same way.
 */
function toAIProjectContext(context: z.infer<typeof projectContextSchema>): AIProjectContext {
  return {
    project: {
      name: context.project.name,
      problem: context.project.problem,
      productService: context.project.productService,
      targetUsers: context.project.targetUsers,
      businessGoal: context.project.businessGoal,
      constraints: context.project.constraints,
      evidence: context.project.evidence,
    },
    currentStage: context.currentStage,
    priorAcceptedDeliverables: context.priorAcceptedDeliverables,
    currentStageDeliverables: context.currentStageDeliverables,
    knownGaps: context.knownGaps,
    knownAssumptions: context.knownAssumptions,
    selectedConcept: context.selectedConcept,
    validationEvidence: context.validationEvidence?.map((item) => ({
      id: item.id,
      type: item.type,
      title: item.title,
      description: item.description,
      context: item.context,
      relatedTask: item.relatedTask,
      severity: item.severity,
    })),
    selectedFindings: context.selectedFindings?.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      theme: item.theme,
      severity: item.severity,
      priority: item.priority,
      insight: item.insight,
    })),
    currentSolutionContent: context.currentSolutionContent,
  }
}

const requestSchema = z.discriminatedUnion('mode', [
  z.object({
    mode: z.literal('generate'),
    taskId: z.string(),
    context: projectContextSchema,
    instruction: z.string().optional(),
  }),
  z.object({
    mode: z.literal('critique'),
    stage: z.enum(['discover', 'define', 'ideate', 'solution', 'validate', 'iterate']),
    context: projectContextSchema,
  }),
])

function describeReadinessContext(context: AIProjectContext): string {
  const p = context.project
  const lines = [
    `Project: ${p.name}`,
    `Problem: ${p.problem}`,
    `Product/service: ${p.productService}`,
    `Target users: ${p.targetUsers}`,
    `Business goal: ${p.businessGoal}`,
  ]
  if (p.constraints) lines.push(`Constraints: ${p.constraints}`)
  lines.push(p.evidence ? `Existing evidence supplied by the user:\n${p.evidence}` : 'No existing evidence was supplied.')
  if (context.selectedConcept) {
    lines.push(`The concept selected to build the solution from (JSON):\n${truncateContextJson(context.selectedConcept)}`)
  }
  lines.push(`This stage's outputs so far (JSON):\n${truncateContextJson(context.currentStageDeliverables)}`)
  if (Object.keys(context.priorAcceptedDeliverables).length > 0) {
    lines.push(`Accepted outputs from earlier stages (JSON):\n${truncateContextJson(context.priorAcceptedDeliverables)}`)
  }
  if (context.validationEvidence) {
    lines.push(
      context.validationEvidence.length > 0
        ? `Validation evidence supplied by the user (JSON):\n${truncateContextJson(context.validationEvidence)}`
        : 'No validation evidence has been supplied yet.',
    )
  }
  if (context.selectedFindings) {
    lines.push(
      context.selectedFindings.length > 0
        ? `Findings selected for iteration (JSON):\n${truncateContextJson(context.selectedFindings)}`
        : 'No findings have been selected for iteration yet.',
    )
  }
  if (context.currentSolutionContent) {
    lines.push(`Current Solution-stage content (JSON):\n${truncateContextJson(context.currentSolutionContent)}`)
  }
  return lines.join('\n')
}

/**
 * The response streams newline-delimited JSON events so the client can show
 * live work happening instead of a sudden block once the whole thing is
 * done:
 *   {"type":"reasoning","text":"<delta>"}
 *   {"type":"final","summary":"...","content":<schema-validated object>}
 *   {"type":"error","error":"..."}
 * The structured deliverable itself only ever arrives once, in the "final"
 * event — this model commits it atomically after reasoning rather than
 * streaming it field by field, so the reasoning trace is what's actually
 * streamed while the request is in flight. Once streaming has started,
 * headers/status are already committed — any failure past that point can
 * only be signalled with an "error" event, never an HTTP status.
 */
function writeEvent(res: VercelResponse, event: { type: 'reasoning'; text: string } | { type: 'final'; summary: string; content: unknown } | { type: 'error'; error: string }) {
  res.write(`${JSON.stringify(event)}\n`)
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const parsedRequest = requestSchema.safeParse(req.body)
  if (!parsedRequest.success) {
    res.status(400).json({ error: 'Invalid request', details: parsedRequest.error.flatten() })
    return
  }
  const body = parsedRequest.data

  if (body.mode === 'generate' && !AI_TASKS[body.taskId as keyof typeof AI_TASKS]) {
    res.status(400).json({ error: `Unknown task: ${body.taskId}` })
    return
  }

  res.writeHead(200, {
    'Content-Type': 'application/x-ndjson; charset=utf-8',
    'Cache-Control': 'no-cache, no-transform',
    'X-Accel-Buffering': 'no',
  })

  try {
    if (body.mode === 'generate') {
      const task = AI_TASKS[body.taskId as keyof typeof AI_TASKS]
      const { instructions, prompt } = buildTaskPrompt(task, toAIProjectContext(body.context), body.instruction)
      const result = streamText({ model: MODEL, instructions, prompt, output: Output.object({ schema: task.schema }) })

      for await (const part of result.fullStream) {
        if (part.type === 'reasoning-delta') writeEvent(res, { type: 'reasoning', text: part.text })
      }
      const content = await result.output
      writeEvent(res, { type: 'final', summary: `${task.label} generated.`, content })
      res.end()
      return
    }

    // mode === 'critique'
    const instruction = READINESS_TASK_INSTRUCTION[body.stage]
    const prompt = `${describeReadinessContext(toAIProjectContext(body.context))}\n\n${instruction}`
    const result = streamText({ model: MODEL, instructions: AI_SYSTEM_PROMPT, prompt, output: Output.object({ schema: READINESS_SCHEMA }) })

    for await (const part of result.fullStream) {
      if (part.type === 'reasoning-delta') writeEvent(res, { type: 'reasoning', text: part.text })
    }
    const content = await result.output
    const stageLabel = body.stage.charAt(0).toUpperCase() + body.stage.slice(1)
    writeEvent(res, { type: 'final', summary: `${stageLabel} readiness: ${content.score}%`, content })
    res.end()
  } catch (error) {
    const message = NoObjectGeneratedError.isInstance(error)
      ? 'The AI response could not be validated. Please try again.'
      : 'AI generation failed. Please try again.'
    if (!NoObjectGeneratedError.isInstance(error)) {
      console.error('AI generation failed', error)
    }
    writeEvent(res, { type: 'error', error: message })
    res.end()
  }
}
