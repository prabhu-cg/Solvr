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
}

export type CritiqueStage = 'discover' | 'define' | 'ideate'

export interface AICritiqueRequest {
  stage: CritiqueStage
  context: AIProjectContext
}

export interface AIResult<T = unknown> {
  summary: string
  content: T
}

export interface AIService {
  generate(request: AIGenerateRequest): Promise<AIResult>
  critique(request: AICritiqueRequest): Promise<AIResult<ReadinessResult>>
}

async function postToAI<T>(body: unknown): Promise<AIResult<T>> {
  const response = await fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    const message = payload && typeof payload === 'object' && 'error' in payload ? String(payload.error) : 'AI request failed.'
    throw new Error(message)
  }

  return payload as AIResult<T>
}

/** V1 implementation — routes through Solvr's own `/api/ai` endpoint (model call happens server-side). */
export class GatewayAIService implements AIService {
  async generate(request: AIGenerateRequest): Promise<AIResult> {
    return postToAI({
      mode: 'generate',
      taskId: request.task,
      context: request.context,
      instruction: request.instruction,
    })
  }

  async critique(request: AICritiqueRequest): Promise<AIResult<ReadinessResult>> {
    return postToAI<ReadinessResult>({
      mode: 'critique',
      stage: request.stage,
      context: request.context,
    })
  }
}

export const aiService: AIService = new GatewayAIService()
