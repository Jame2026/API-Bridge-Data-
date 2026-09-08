import { supabase, isSupabaseConfigured } from './supabaseClient';
import { Project } from '../types';

export const fetchProjectsFromSupabase = async (): Promise<Project[] | null> => {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    if (error || !data) return null;
    return data.map((row) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description || '',
      environment: row.environment as any,
      baseUrl: row.base_url || '',
      icon: row.icon || 'layers',
      color: row.color || '#8083ff',
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  } catch {
    return null;
  }
};

export const upsertProjectToSupabase = async (project: Project): Promise<boolean> => {
  if (!isSupabaseConfigured()) return false;
  try {
    const { error } = await supabase.from('projects').upsert({
      id: project.id,
      name: project.name,
      slug: project.slug,
      description: project.description,
      environment: project.environment,
      base_url: project.baseUrl,
      icon: project.icon,
      color: project.color,
      created_at: project.createdAt,
      updated_at: new Date().toISOString(),
    });
    return !error;
  } catch {
    return false;
  }
};

export const deleteProjectFromSupabase = async (projectId: string): Promise<boolean> => {
  if (!isSupabaseConfigured()) return false;
  try {
    const { error } = await supabase.from('projects').delete().eq('id', projectId);
    return !error;
  } catch {
    return false;
  }
};
