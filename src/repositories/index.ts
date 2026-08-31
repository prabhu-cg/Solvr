import { LocalProjectRepository } from '@/repositories/LocalProjectRepository'
import type { ProjectRepository } from '@/repositories/ProjectRepository'

/**
 * Single place that decides which ProjectRepository implementation the app
 * runs against. Everything else (store, components, pages) imports
 * `projectRepository` from here and never instantiates a repository itself.
 *
 * Swapping to Supabase/Postgres later is a one-line change:
 *   export const projectRepository: ProjectRepository = new CloudProjectRepository(...)
 */
export const projectRepository: ProjectRepository = new LocalProjectRepository()

export type { ProjectRepository } from '@/repositories/ProjectRepository'
