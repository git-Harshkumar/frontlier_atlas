import { fetchApi } from './api';

export interface MethodItem {
  id: string;
  name: string;
  slug: string;
  paperCount: number;
}

export interface GetMethodsResponse {
  status: string;
  count: number;
  data: {
    methods: MethodItem[];
    total: number;
    page: number;
    hasMore: boolean;
  };
}

export interface GetMethodsParams {
  sort?: 'name' | 'papers';
  search?: string;
  page?: number;
  limit?: number;
}

export interface MethodPaperAuthor {
  name: string;
}

export interface MethodPaper {
  id: string;
  title: string;
  slug: string;
  citationCount: number;
  publicationDate: string;
  githubStars: number;
  authors: MethodPaperAuthor[];
}

export interface MethodDetail {
  id: string;
  name: string;
  slug: string;
  paperCount: number;
  papers: MethodPaper[];
}

export interface GetMethodBySlugResponse {
  status: string;
  data: MethodDetail;
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .substring(0, 100);
}

export async function getMethods(params: GetMethodsParams = {}): Promise<GetMethodsResponse['data']> {
  const searchParams = new URLSearchParams();
  if (params.sort) searchParams.set('sort', params.sort);
  if (params.search) searchParams.set('search', params.search);
  if (params.page) searchParams.set('page', String(params.page));
  if (params.limit) searchParams.set('limit', String(params.limit));

  const qs = searchParams.toString();
  const endpoint = `/api/v1/methods${qs ? `?${qs}` : ''}`;

  const response = await fetchApi<GetMethodsResponse>(endpoint);
  return response.data;
}

export async function getMethodBySlug(slug: string): Promise<MethodDetail> {
  const response = await fetchApi<GetMethodBySlugResponse>(`/api/v1/methods/${encodeURIComponent(slug)}`);
  return response.data;
}
