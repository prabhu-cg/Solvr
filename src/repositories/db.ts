import Dexie, { type EntityTable } from 'dexie'
import type { Project } from '@/data/models'

/**
 * Dexie schema. This file — along with LocalProjectRepository — is the
 * only place in the codebase allowed to import Dexie directly. UI
 * components and stores must go through ProjectRepository instead.
 */
export class SolvrDatabase extends Dexie {
  projects!: EntityTable<Project, 'id'>

  constructor() {
    super('solvr')
    this.version(1).stores({
      // Only fields we actually query/sort on need indexing.
      projects: 'id, name, updatedAt, createdAt',
    })
  }
}

export const db = new SolvrDatabase()
