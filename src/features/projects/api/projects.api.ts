import { Project } from '../../../types';
import { INITIAL_PROJECTS } from '../../../data/mockData';
import { fetchProjectsFromSupabase, upsertProjectToSupabase, deleteProjectFromSupabase } from '../../../lib/supabase';

export const projectsApi = {
  getProjects: async (): Promise<Project[]> => {
    const remote = await fetchProjectsFromSupabase();
    if (remote && remote.length > 0) return remote;
    return INITIAL_PROJECTS;
  },

  saveProject: async (project: Project): Promise<Project> => {
    await upsertProjectToSupabase(project);
    return project;
  },

  deleteProject: async (id: string): Promise<string> => {
    await deleteProjectFromSupabase(id);
    return id;
  },
};
