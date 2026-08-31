import type { NewProjectInput, Project, ProjectSummary } from '@/data/models'

/**
 * Storage-agnostic contract for reading and writing projects.
 *
 * The UI, Zustand store and business logic depend only on this interface —
 * never on Dexie, IndexedDB, Supabase, or any concrete storage detail.
 * V1 ships `LocalProjectRepository` (IndexedDB/Dexie). A future
 * `CloudProjectRepository` (Supabase/Postgres) can be dropped in without
 * touching a single caller.
 */
export interface ProjectRepository {
  createProject(input: NewProjectInput): Promise<Project>
  getProject(id: string): Promise<Project | undefined>
  updateProject(id: string, patch: Partial<Omit<Project, 'id' | 'createdAt'>>): Promise<Project>
  deleteProject(id: string): Promise<void>
  listProjects(): Promise<ProjectSummary[]>
}
