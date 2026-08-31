import type { Project, StageKey } from '@/data/models'

/**
 * Abstraction for future AI-driven generation, critique and synthesis.
 * Phase 1 defines the shape only — no implementation calls a model yet.
 * Discover/Define/Ideate/Solution pages will depend on this interface,
 * not on any specific provider or SDK.
 */
export interface AIGenerateRequest {
  project: Project
  stage: StageKey
  instruction?: string
}

export interface AICritiqueRequest {
  project: Project
  stage: StageKey
}

export interface AISynthesizeRequest {
  project: Project
  stages: StageKey[]
}

export interface AIResult {
  summary: string
  content: unknown
}

export interface AIService {
  generate(request: AIGenerateRequest): Promise<AIResult>
  critique(request: AICritiqueRequest): Promise<AIResult>
  synthesize(request: AISynthesizeRequest): Promise<AIResult>
}

/**
 * Placeholder implementation so the rest of the app can wire against
 * AIService now without a live provider. Every method rejects — Phase 1
 * explicitly does not call AI generation.
 */
export class NotImplementedAIService implements AIService {
  async generate(): Promise<AIResult> {
    throw new Error('AI generation is not available yet.')
  }

  async critique(): Promise<AIResult> {
    throw new Error('AI critique is not available yet.')
  }

  async synthesize(): Promise<AIResult> {
    throw new Error('AI synthesis is not available yet.')
  }
}

export const aiService: AIService = new NotImplementedAIService()
