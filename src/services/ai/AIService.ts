import type { AIProjectContext } from '@/ai/context'
import type { AITaskId } from '@/ai/tasks'
import type { ReadinessResult } from '@/ai/schemas'

/**
 * Abstraction for AI-driven generation and critique. The rest of the app
 * depends only on this interface — never on a provider SDK or model name —
 * so the underlying provider/model can change without touching a caller.
 * The actual model call happens server-side (see `api/ai.ts`); this service
 * only ever talks to our own `/api/ai` endpoint, so no API key is ever
 * present in frontend code.
 */
export interface AIGenerateRequest {
  task: AITaskId
  context: AIProjectContext
  instruction?: string
  /**
   * Called with each reasoning-token delta as the model "thinks", so the UI
   * can show live work happening rather than a sudden block once the
   * deliverable is done. The structured deliverable itself is only produced
   * once, at the end — the model commits it atomically after reasoning, so
   * the reasoning stream is what's actually visible while it's in flight.
   */
  onReasoning?: (delta: string) => void
}

export type CritiqueStage = 'discover' | 'define' | 'ideate' | 'solution' | 'validate' | 'iterate'

export interface AICritiqueRequest {
  stage: CritiqueStage
  context: AIProjectContext
  onReasoning?: (delta: string) => void
}

export interface AIResult<T = unknown> {
  summary: string
  content: T
}

export interface AIService {
  generate(request: AIGenerateRequest): Promise<AIResult>
  critique(request: AICritiqueRequest): Promise<AIResult<ReadinessResult>>
}

type AIStreamEvent<T> =
  | { type: 'reasoning'; text: string }
  | { type: 'final'; summary: string; content: T }
  | { type: 'error'; error: string }

/** The server streams newline-delimited JSON events (see `api/ai.ts`) — reasoning deltas as the model works, then one final event with the validated deliverable. */
async function postToAI<T>(body: unknown, onReasoning?: (delta: string) => void): Promise<AIResult<T>> {
  const response = await fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const payload = await response.json().catch(() => null)
    const message = payload && typeof payload === 'object' && 'error' in payload ? String(payload.error) : 'AI request failed.'
    throw new Error(message)
  }

  if (!response.body) {
    throw new Error('AI request failed.')
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  let final: AIResult<T> | null = null

  function handleLine(line: string) {
    if (!line.trim()) return
    const event = JSON.parse(line) as AIStreamEvent<T>
    if (event.type === 'reasoning') {
      onReasoning?.(event.text)
    } else if (event.type === 'final') {
      final = { summary: event.summary, content: event.content }
    } else {
      throw new Error(event.error)
    }
  }

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    let newlineIndex = buffer.indexOf('\n')
    while (newlineIndex !== -1) {
      handleLine(buffer.slice(0, newlineIndex))
      buffer = buffer.slice(newlineIndex + 1)
      newlineIndex = buffer.indexOf('\n')
    }
  }
  handleLine(buffer)

  if (!final) {
    throw new Error('AI request failed.')
  }
  return final
}

/** V1 implementation — routes through Solvr's own `/api/ai` endpoint (model call happens server-side). */
export class GatewayAIService implements AIService {
  async generate(request: AIGenerateRequest): Promise<AIResult> {
    return postToAI(
      {
        mode: 'generate',
        taskId: request.task,
        context: request.context,
        instruction: request.instruction,
      },
      request.onReasoning,
    )
  }

  async critique(request: AICritiqueRequest): Promise<AIResult<ReadinessResult>> {
    return postToAI<ReadinessResult>(
      {
        mode: 'critique',
        stage: request.stage,
        context: request.context,
      },
      request.onReasoning,
    )
  }
}

export const aiService: AIService = new GatewayAIService()
