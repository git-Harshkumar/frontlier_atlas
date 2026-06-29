import { fetchApi } from './api';

export interface TaskItem {
  id: string;
  label: string;
  icon: string;
}

export interface TasksResponse {
  status: string;
  data: {
    tasks: TaskItem[];
  };
}

export async function getTasks(): Promise<TaskItem[]> {
  try {
    const response = await fetchApi<TasksResponse>('/api/v1/tasks');
    if (Array.isArray(response)) {
      return response;
    }
    if (response && response.data) {
      if (Array.isArray(response.data)) {
        return response.data;
      }
      if (response.data.tasks && Array.isArray(response.data.tasks)) {
        return response.data.tasks;
      }
    }
    console.warn('Unexpected API response format for tasks:', response);
    return [];
  } catch (error) {
    console.error('Failed to fetch tasks:', error);
    throw error;
  }
}
