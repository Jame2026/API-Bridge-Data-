import { Project } from '../../../types';
import { INITIAL_PROJECTS, ALL_SYSTEM_MODULES } from '../../../data/mockData';
import { fetchProjectsFromSupabase, upsertProjectToSupabase, deleteProjectFromSupabase } from '../../../lib/supabase';

const STORAGE_KEY = 'app_projects_storage';

function sanitizeProject(p: Project): Project {
  if (!p.modules || p.modules.length === 0 || p.modules.some((m) => m.toLowerCase().includes('all module'))) {
    return { ...p, modules: ALL_SYSTEM_MODULES };
  }
  return p;
}

export const projectsApi = {
  getProjects: async (): Promise<Project[]> => {
    const remote = await fetchProjectsFromSupabase();
    if (remote && remote.length > 0) return remote.map(sanitizeProject);

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const sanitized = parsed.map(sanitizeProject);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
          return sanitized;
        }
      } catch (e) {
        console.warn('Failed to parse local projects:', e);
      }
    }
    return INITIAL_PROJECTS.map(sanitizeProject);
  },

  saveProject: async (project: Project): Promise<Project> => {
    const cleaned = sanitizeProject(project);
    await upsertProjectToSupabase(cleaned);
    const existing = await projectsApi.getProjects();
    const updated = existing.some((p) => p.id === cleaned.id)
      ? existing.map((p) => (p.id === cleaned.id ? cleaned : p))
      : [...existing, cleaned];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return cleaned;
  },

  deleteProject: async (id: string): Promise<string> => {
    await deleteProjectFromSupabase(id);
    const existing = await projectsApi.getProjects();
    const updated = existing.filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return id;
  },
};
