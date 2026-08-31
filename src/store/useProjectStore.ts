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
  flushActiveProjectSave: () => void
  deleteProject: (id: string) => Promise<void>
}

const AUTOSAVE_DELAY_MS = 700

let autosaveTimer: ReturnType<typeof setTimeout> | null = null
// Mirrors what the pending timer would save, so a flush (e.g. before the tab
// closes) can write it immediately instead of losing it when the timer never
// gets to fire.
let pendingSave: { projectId: string; patch: Partial<Omit<Project, 'id' | 'createdAt'>> } | null = null

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
    pendingSave = { projectId: updated.id, patch }
    autosaveTimer = setTimeout(() => {
      autosaveTimer = null
      void get().flushActiveProjectSave()
    }, AUTOSAVE_DELAY_MS)
  },

  // Writes the pending debounced save immediately. Called by the timer once
  // it elapses, and also from beforeunload/visibilitychange so a refresh or
  // tab close inside the debounce window doesn't silently drop the edit.
  flushActiveProjectSave: () => {
    if (!pendingSave) return
    const { projectId, patch } = pendingSave
    pendingSave = null
    if (autosaveTimer) {
      clearTimeout(autosaveTimer)
      autosaveTimer = null
    }
    void (async () => {
      const saved = await projectRepository.updateProject(projectId, patch)
      // Only overwrite if the user hasn't kept editing into a newer patch.
      set((state) => ({
        activeProject: state.activeProject?.id === saved.id ? { ...state.activeProject, ...saved } : state.activeProject,
        saveStatus: 'saved',
      }))
      const projects = await projectRepository.listProjects()
      set({ projects })
    })()
  },

  deleteProject: async (id: string) => {
    const target = get().projects.find((project) => project.id === id) ?? get().activeProject
    if (target?.id === id && target.isSample) return
    await projectRepository.deleteProject(id)
    const projects = await projectRepository.listProjects()
    set((state) => ({
      projects,
      activeProject: state.activeProject?.id === id ? null : state.activeProject,
    }))
  },
}))

// A refresh, tab close, or tab switch inside the 700ms debounce window would
// otherwise silently drop the most recent edit — flush on both signals since
// neither fires reliably on its own across browsers.
if (typeof window !== 'undefined') {
  const flush = () => useProjectStore.getState().flushActiveProjectSave()
  window.addEventListener('beforeunload', flush)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flush()
  })
}
