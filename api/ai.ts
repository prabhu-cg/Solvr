import { groq } from '@ai-sdk/groq'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { generateText, NoObjectGeneratedError, Output } from 'ai'
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
  currentStage: z.enum(['discover', 'define', 'ideate', 'solution']),
  priorAcceptedDeliverables: z.record(z.string(), z.unknown()),
  currentStageDeliverables: z.record(z.string(), z.unknown()),
  knownGaps: z.array(z.string()),
  knownAssumptions: z.array(z.string()),
  selectedConcept: z.unknown().optional(),
})

const requestSchema = z.discriminatedUnion('mode', [
  z.object({
    mode: z.literal('generate'),
    taskId: z.string(),
    context: projectContextSchema,
    instruction: z.string().optional(),
  }),
  z.object({
    mode: z.literal('critique'),
    stage: z.enum(['discover', 'define', 'ideate', 'solution']),
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
  return lines.join('\n')
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

  try {
    if (body.mode === 'generate') {
      const task = AI_TASKS[body.taskId as keyof typeof AI_TASKS]
      if (!task) {
        res.status(400).json({ error: `Unknown task: ${body.taskId}` })
        return
      }

      const { instructions, prompt } = buildTaskPrompt(task, body.context, body.instruction)
      const { output } = await generateText({
        model: MODEL,
        instructions,
        prompt,
        output: Output.object({ schema: task.schema }),
      })

      res.status(200).json({ summary: `${task.label} generated.`, content: output })
      return
    }

    // mode === 'critique'
    const instruction = READINESS_TASK_INSTRUCTION[body.stage]
    const prompt = `${describeReadinessContext(body.context)}\n\n${instruction}`
    const { output } = await generateText({
      model: MODEL,
      instructions: AI_SYSTEM_PROMPT,
      prompt,
      output: Output.object({ schema: READINESS_SCHEMA }),
    })

    const stageLabel = body.stage.charAt(0).toUpperCase() + body.stage.slice(1)
    res.status(200).json({
      summary: `${stageLabel} readiness: ${output.score}%`,
      content: output,
    })
  } catch (error) {
    if (NoObjectGeneratedError.isInstance(error)) {
      res.status(502).json({ error: 'The AI response could not be validated. Please try again.' })
      return
    }
    console.error('AI generation failed', error)
    res.status(500).json({ error: 'AI generation failed. Please try again.' })
  }
}
