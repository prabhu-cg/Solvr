import {
  computeOverallReadiness,
  createProjectStages,
  hydrateStage,
  STAGE_KEYS,
  type NewProjectInput,
  type Project,
  type ProjectSummary,
} from '@/data/models'
import { SAMPLE_PROJECT_STAGES } from '@/data/sampleProjectStages'
import { db } from '@/repositories/db'
import type { ProjectRepository } from '@/repositories/ProjectRepository'

/** Normalizes a project read from storage so older records always match the current shape. */
function hydrateProject(project: Project): Project {
  const stages = { ...project.stages }
  for (const key of STAGE_KEYS) {
    stages[key] = hydrateStage(stages[key])
  }
  return { ...project, stages }
}

function toSummary(project: Project): ProjectSummary {
  return {
    id: project.id,
    name: project.name,
    problem: project.problem,
    currentStage: project.currentStage,
    overallReadiness: computeOverallReadiness(project),
    isSample: project.isSample,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
  }
}

function newId(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `proj_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
}

/**
 * V1 implementation of ProjectRepository, backed by IndexedDB via Dexie.
 * This is the only V1 class that touches `db` — swap it for
 * `CloudProjectRepository` later without changing any caller.
 */
export class LocalProjectRepository implements ProjectRepository {
  async createProject(input: NewProjectInput): Promise<Project> {
    const now = new Date().toISOString()
    const project: Project = {
      id: newId(),
      name: input.name,
      problem: input.problem,
      productService: input.productService,
      targetUsers: input.targetUsers,
      businessGoal: input.businessGoal,
      constraints: input.constraints,
      evidence: input.evidence,
      currentStage: input.isSample ? 'solution' : 'setup',
      stages: input.isSample ? structuredClone(SAMPLE_PROJECT_STAGES) : createProjectStages(),
      isSample: input.isSample,
      createdAt: now,
      updatedAt: now,
    }
    await db.projects.add(project)
    return project
  }

  async getProject(id: string): Promise<Project | undefined> {
    const project = await db.projects.get(id)
    return project ? hydrateProject(project) : undefined
  }

  async updateProject(id: string, patch: Partial<Omit<Project, 'id' | 'createdAt'>>): Promise<Project> {
    const existing = await db.projects.get(id)
    if (!existing) {
      throw new Error(`Project not found: ${id}`)
    }
    const updated: Project = {
      ...hydrateProject(existing),
      ...patch,
      updatedAt: new Date().toISOString(),
    }
    await db.projects.put(updated)
    return updated
  }

  async deleteProject(id: string): Promise<void> {
    await db.projects.delete(id)
  }

  async listProjects(): Promise<ProjectSummary[]> {
    const all = await db.projects.orderBy('updatedAt').reverse().toArray()
    return all.map(hydrateProject).map(toSummary)
  }
}
