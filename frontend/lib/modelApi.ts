import { fetchApi } from './api';

export interface ModelData {
  platform: string;
  source: string;
  time: string;
  title: string;
  likes: string;
  comments: string;
}

export interface ModelsResponse {
  status?: string;
  data: {
    models: ModelData[];
  };
}

export async function getModels(): Promise<ModelData[]> {
  try {
    const response = await fetchApi<any>('/api/v1/models');
    
    if (Array.isArray(response)) {
      return response;
    }
    if (response && response.data) {
      if (Array.isArray(response.data)) {
        return response.data;
      }
      if (response.data.models && Array.isArray(response.data.models)) {
        return response.data.models;
      }
    }
    
    console.warn('Unexpected API response format for models:', response);
    return [];
  } catch (error) {
    console.error('Failed to fetch models:', error);
    throw error;
  }
}
