import { INITIAL_PROJECTS, INITIAL_USER_ACTIVITIES, INITIAL_REPORTS } from '../../src/data/mockData';

export const mockHandlers = {
  getProjects: () => INITIAL_PROJECTS,
  getActivities: () => INITIAL_USER_ACTIVITIES,
  getReports: () => INITIAL_REPORTS,
};
