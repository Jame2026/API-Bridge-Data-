import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectsApi } from './projects.api';
import { Project } from '../../../types';

export const PROJECTS_QUERY_KEY = ['projects'] as const;

export function useProjectsQuery() {
  return useQuery({
    queryKey: PROJECTS_QUERY_KEY,
    queryFn: projectsApi.getProjects,
  });
}

export function useSaveProjectMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: projectsApi.saveProject,
    onSuccess: (savedProject) => {
      queryClient.setQueryData<Project[]>(PROJECTS_QUERY_KEY, (prev) => {
        if (!prev) return [savedProject];
        const exists = prev.some((p) => p.id === savedProject.id);
        if (exists) return prev.map((p) => (p.id === savedProject.id ? savedProject : p));
        return [...prev, savedProject];
      });
    },
  });
}

export function useDeleteProjectMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: projectsApi.deleteProject,
    onSuccess: (deletedId) => {
      queryClient.setQueryData<Project[]>(PROJECTS_QUERY_KEY, (prev) =>
        prev ? prev.filter((p) => p.id !== deletedId) : []
      );
    },
  });
}
