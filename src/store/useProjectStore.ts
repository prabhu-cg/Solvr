import { create } from 'zustand'
import type { NewProjectInput, Project, ProjectSummary } from '@/data/models'
import { projectRepository } from '@/repositories'

export type SaveStatus = 'idle' | 'saving' | 'saved'

interface ProjectStoreState {
  projects: ProjectSummary[]
  projectsLoaded: boolean
  activeProject: Project | null
  activeProjectLoading: boolean
  saveStatus: SaveStatus

  loadProjects: () => Promise<void>
  loadProject: (id: string) => Promise<Project | undefined>
  clearActiveProject: () => void
  createProject: (input: NewProjectInput) => Promise<Project>
  patchActiveProject: (patch: Partial<Omit<Project, 'id' | 'createdAt'>>) => void
  deleteProject: (id: string) => Promise<void>
}

const AUTOSAVE_DELAY_MS = 700

let autosaveTimer: ReturnType<typeof setTimeout> | null = null

export const useProjectStore = create<ProjectStoreState>((set, get) => ({
  projects: [],
  projectsLoaded: false,
  activeProject: null,
  activeProjectLoading: false,
  saveStatus: 'idle',

  loadProjects: async () => {
    const projects = await projectRepository.listProjects()
    set({ projects, projectsLoaded: true })
  },

  loadProject: async (id: string) => {
    set({ activeProjectLoading: true })
    const project = await projectRepository.getProject(id)
    set({ activeProject: project ?? null, activeProjectLoading: false, saveStatus: 'idle' })
    return project
  },

  clearActiveProject: () => {
    if (autosaveTimer) {
      clearTimeout(autosaveTimer)
      autosaveTimer = null
    }
    set({ activeProject: null, saveStatus: 'idle' })
  },

  createProject: async (input: NewProjectInput) => {
    const project = await projectRepository.createProject(input)
    const projects = await projectRepository.listProjects()
    set({ projects, activeProject: project, saveStatus: 'saved' })
    return project
  },

  patchActiveProject: (patch) => {
    const current = get().activeProject
    if (!current) return

    const updated: Project = { ...current, ...patch, updatedAt: new Date().toISOString() }
    set({ activeProject: updated, saveStatus: 'saving' })

    if (autosaveTimer) clearTimeout(autosaveTimer)
    autosaveTimer = setTimeout(async () => {
      const saved = await projectRepository.updateProject(updated.id, patch)
      // Only overwrite if the user hasn't kept typing into a newer patch.
      set((state) => ({
        activeProject: state.activeProject?.id === saved.id ? { ...state.activeProject, ...saved } : state.activeProject,
        saveStatus: 'saved',
      }))
      const projects = await projectRepository.listProjects()
      set({ projects })
    }, AUTOSAVE_DELAY_MS)
  },

  deleteProject: async (id: string) => {
    await projectRepository.deleteProject(id)
    const projects = await projectRepository.listProjects()
    set((state) => ({
      projects,
      activeProject: state.activeProject?.id === id ? null : state.activeProject,
    }))
  },
}))
