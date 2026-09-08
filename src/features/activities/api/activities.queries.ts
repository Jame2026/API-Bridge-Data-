import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { activitiesApi } from './activities.api';
import { UserActivity } from '../../../types';

export const ACTIVITIES_QUERY_KEY = ['activities'] as const;

export function useActivitiesQuery() {
  return useQuery({
    queryKey: ACTIVITIES_QUERY_KEY,
    queryFn: activitiesApi.getActivities,
  });
}

export function useLogActivityMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: activitiesApi.logActivity,
    onSuccess: (newActivity) => {
      queryClient.setQueryData<UserActivity[]>(ACTIVITIES_QUERY_KEY, (prev) =>
        prev ? [newActivity, ...prev] : [newActivity]
      );
    },
  });
}
