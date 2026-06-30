import { fetchApi } from './api';
import { slugify } from './methods';

export interface BackendTaskItem {
  id: string;
  name: string;
  slug: string;
  color: string | null;
}

export interface TaskItem {
  id: string;
  name: string;
  slug: string;
  color: string | null;
}

export interface TaskPaper {
  id: string;
  title: string;
  slug: string;
  citationCount: number;
}

export interface TaskDetail {
  id: string;
  name: string;
  slug: string;
  color: string | null;
  paperCount: number;
  papers: TaskPaper[];
}

export interface GetTasksResponse {
  status: string;
  count: number;
  data: BackendTaskItem[];
}

export interface GetTaskBySlugResponse {
  status: string;
  data: BackendTaskDetail;
}

interface BackendTaskDetail {
  id: string;
  name: string;
  slug: string;
  color: string | null;
  papers: { paper: TaskPaper }[];
}

export async function getTasks(): Promise<TaskItem[]> {
  const response = await fetchApi<GetTasksResponse>('/api/v1/tasks?limit=100');
  const tasks = Array.isArray(response?.data) ? response.data : [];
  return tasks.map((t) => ({
    id: t.id,
    name: t.name,
    slug: t.slug,
    color: t.color,
  }));
}

export async function getTaskBySlug(slug: string): Promise<TaskDetail> {
  const response = await fetchApi<GetTaskBySlugResponse>(`/api/v1/tasks/${encodeURIComponent(slug)}`);
  const data = response.data;
  return {
    id: data.id,
    name: data.name,
    slug: data.slug,
    color: data.color,
    paperCount: data.papers?.length ?? 0,
    papers: (data.papers ?? []).map(({ paper }) => paper),
  };
}

export { slugify };
