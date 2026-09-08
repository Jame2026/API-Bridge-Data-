import React, { useState } from 'react';
import { useProjectsQuery, useSaveProjectMutation, useDeleteProjectMutation } from '../features/projects/api/projects.queries';
import { useActivitiesQuery } from '../features/activities/api/activities.queries';
import { useUiStore } from '../state/uiStore';
import { ProjectCard } from '../features/projects/components/ProjectCard';
import { ProjectModal } from '../features/projects/components/ProjectModal';
import { Button } from '../ui/primitives/Button';
import { Project } from '../types';
import { Plus, FolderKanban } from 'lucide-react';

export const Projects: React.FC = () => {
  const { data: projects = [] } = useProjectsQuery();
  const { data: activities = [] } = useActivitiesQuery();
  const saveProjectMutation = useSaveProjectMutation();
  const deleteProjectMutation = useDeleteProjectMutation();

  const activeProjectId = useUiStore((s) => s.activeProjectId);
  const setActiveProjectId = useUiStore((s) => s.setActiveProjectId);
  const addToast = useUiStore((s) => s.addToast);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);

  const handleEdit = (project: Project) => {
    setProjectToEdit(project);
    setIsModalOpen(true);
  };

  const handleNew = () => {
    setProjectToEdit(null);
    setIsModalOpen(true);
  };

  const handleSave = (project: Project) => {
    saveProjectMutation.mutate(project);
    addToast(`Project "${project.name}" saved!`, 'success');
  };

  const handleDelete = (id: string) => {
    deleteProjectMutation.mutate(id);
    if (activeProjectId === id) setActiveProjectId('all');
    addToast('Project removed', 'info');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#141822] border border-[#262a33] p-5 rounded-2xl shadow-lg">
        <div>
          <h1 className="text-lg font-bold text-white tracking-tight">Internal Project Workspaces</h1>
          <p className="text-xs text-[#908fa0] mt-1">
            Organize applications, microservices, and user telemetry sources into isolated environments.
          </p>
        </div>
        <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={handleNew}>
          Add Project Workspace
        </Button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {projects.map((proj) => {
          const projActivities = activities.filter((a) => a.projectId === proj.id);
          const uniqueUsers = new Set(projActivities.map((a) => a.userId)).size;
          const uniqueFeatures = new Set(projActivities.map((a) => a.featureName)).size;

          return (
            <ProjectCard
              key={proj.id}
              project={proj}
              eventCount={projActivities.length}
              userCount={uniqueUsers}
              featureCount={uniqueFeatures}
              isSelected={activeProjectId === proj.id}
              onSelect={setActiveProjectId}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          );
        })}
      </div>

      {/* Modal */}
      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setProjectToEdit(null);
        }}
        onSave={handleSave}
        projectToEdit={projectToEdit}
      />
    </div>
  );
};
export default Projects;
