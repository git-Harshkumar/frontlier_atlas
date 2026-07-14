import { fetchApi } from './api';

export interface ModelTask {
  id: string;
  name: string;
  slug: string;
  color: string | null;
}

export interface ModelPaperRaw {
  id: string;
  slug: string;
  title: string;
  abstract: string | null;
  thumbnailUrl: string | null;
  publicationDate: string | null;
  citationCount: number;
  githubStars: number | null;
  githubForks: number | null;
  githubUrl: string | null;
  authors: { name: string }[];
  tasks: ModelTask[];
  methods: { name: string }[];
  conferences: { name: string }[];
  sotaClaims: { benchmark: { name: string } }[];
}

export interface BackendModelItem {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  paperCount: number;
  citationCount: number;
  githubStars: number;
  latestPaperDate: string | null;
  latestPaperTitle: string | null;
  latestPaperSlug: string | null;
  tasks?: ModelTask[];
  papers?: ModelPaperRaw[];
}

export interface ModelItem {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  paperCount: number;
  citationCount: number;
  githubStars: number;
  latestPaperDate: string | null;
  latestPaperTitle: string | null;
  latestPaperSlug: string | null;
  tasks: ModelTask[];
  papers?: ModelPaperRaw[];
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
  citationCount: number;
  githubStars: number;
  papers: ModelPaper[];
  tasks: ModelTask[];
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
  paperCount: number;
  citationCount: number;
  githubStars: number;
  papers: { paper: ModelPaper }[];
  tasks: ModelTask[];
}

export async function getModels(): Promise<ModelItem[]> {
  const response = await fetchApi<GetModelsResponse>('/api/v1/models?limit=100');
  const items = Array.isArray(response?.data) ? response.data : [];
  return items.map((m) => ({
    id: m.id,
    name: m.name,
    slug: m.slug,
    createdAt: m.createdAt,
    paperCount: m.paperCount,
    citationCount: m.citationCount,
    githubStars: m.githubStars,
    latestPaperDate: m.latestPaperDate,
    latestPaperTitle: m.latestPaperTitle,
    latestPaperSlug: m.latestPaperSlug,
    tasks: m.tasks ?? [],
    papers: m.papers ?? [],
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
    paperCount: data.paperCount ?? data.papers?.length ?? 0,
    citationCount: data.citationCount ?? 0,
    githubStars: data.githubStars ?? 0,
    papers: (data.papers ?? []).map(({ paper }) => paper),
    tasks: data.tasks ?? [],
  };
}
