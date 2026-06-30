import { fetchApi } from './api';

export interface BackendModelItem {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
}

export interface ModelItem {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
}

export interface ModelPaper {
  id: string;
  title: string;
  slug: string;
  citationCount: number;
}

export interface ModelDetail {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  paperCount: number;
  papers: ModelPaper[];
}

export interface GetModelsResponse {
  status: string;
  count: number;
  data: BackendModelItem[];
}

export interface GetModelBySlugResponse {
  status: string;
  data: BackendModelDetail;
}

interface BackendModelDetail {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  papers: { paper: ModelPaper }[];
}

export async function getModels(): Promise<ModelItem[]> {
  const response = await fetchApi<GetModelsResponse>('/api/v1/models?limit=100');
  const items = Array.isArray(response?.data) ? response.data : [];
  return items.map((m) => ({
    id: m.id,
    name: m.name,
    slug: m.slug,
    createdAt: m.createdAt,
  }));
}

export async function getModelBySlug(slug: string): Promise<ModelDetail> {
  const response = await fetchApi<GetModelBySlugResponse>(`/api/v1/models/${encodeURIComponent(slug)}`);
  const data = response.data;
  return {
    id: data.id,
    name: data.name,
    slug: data.slug,
    createdAt: data.createdAt,
    paperCount: data.papers?.length ?? 0,
    papers: (data.papers ?? []).map(({ paper }) => paper),
  };
}
