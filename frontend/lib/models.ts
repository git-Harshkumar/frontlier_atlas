import { fetchApi } from './api';

export interface BackendModelItem {
  id: string;
  name: string;
  slug: string;
  vendor: string;
  vendorLogoUrl?: string;
  releaseDate: string | null;
  parameterCount: string | null;
  modality: string | null;
  accessType: string | null;
  opennessType: string | null;
  description: string | null;
  benchmarkScore: Record<string, number> | null;
  modelFamily: string | null;
  category: string | null;
  capabilities: string[] | null;
  researchAreas: string[] | null;
  architecture: string | null;
  contextWindow: string | null;
  license: string | null;
  modelVersions: string[] | null;
  releaseNotes: string | null;
  paperUrl: string | null;
  repositoryUrl: string | null;
  apiUrl: string | null;
  createdAt: string;
  paperCount: number;
  citationCount: number;
  githubStars: number;
  trendingScore: number;
}

export interface ModelTask {
  id: string;
  name: string;
  slug: string;
  color: string | null;
}

export interface BackendModelDetail extends BackendModelItem {
  papers: { paper_id: string; model_id: string; paper: ModelPaper }[];
  tasks: ModelTask[];
  methods: { id: string; name: string; slug: string; category: string }[];
  datasets: { id: string; name: string; slug: string }[];
  benchmarks: unknown[];
  relatedModels: { id: string; name: string; slug: string; paperCount: number }[];
}

export interface ModelPaper {
  id: string;
  title: string;
  slug: string;
  citationCount: number;
  githubStars: number;
}

export interface ModelItem {
  id: string;
  name: string;
  slug: string;
  vendor: string;
  vendorLogoUrl?: string;
  releaseDate: string | null;
  parameterCount: string | null;
  modality: string | null;
  accessType: string | null;
  opennessType: string | null;
  description: string | null;
  benchmarkScore: Record<string, number> | null;
  modelFamily: string | null;
  category: string | null;
  capabilities: string[] | null;
  researchAreas: string[] | null;
  architecture: string | null;
  contextWindow: string | null;
  license: string | null;
  createdAt: string;
  paperCount: number;
  citationCount: number;
  githubStars: number;
  trendingScore: number;
  latestPaperDate: string | null;
  latestPaperTitle: string | null;
  latestPaperSlug: string | null;
  tasks: ModelTask[];
}

export interface ModelDetail {
  id: string;
  name: string;
  slug: string;
  vendor: string;
  vendorLogoUrl?: string;
  releaseDate: string | null;
  parameterCount: string | null;
  modality: string | null;
  accessType: string | null;
  opennessType: string | null;
  description: string | null;
  benchmarkScore: Record<string, number> | null;
  modelFamily: string | null;
  category: string | null;
  capabilities: string[] | null;
  researchAreas: string[] | null;
  architecture: string | null;
  contextWindow: string | null;
  license: string | null;
  createdAt: string;
  paperCount: number;
  citationCount: number;
  githubStars: number;
  trendingScore: number;
  papers: ModelPaper[];
  tasks: ModelTask[];
}

export interface FacetItem {
  name: string;
  count: number;
}

export interface ModelFacets {
  totalModels: number;
  vendors: FacetItem[];
  modalities: FacetItem[];
  accessTypes: FacetItem[];
  opennessTypes: FacetItem[];
  modelFamilies: FacetItem[];
  capabilities: FacetItem[];
  researchAreas: FacetItem[];
}

interface GetModelsResponse {
  status: string;
  count: number;
  data: BackendModelItem[];
}

interface GetModelBySlugResponse {
  status: string;
  data: BackendModelDetail;
}

interface GetFacetsResponse {
  status: string;
  data: ModelFacets;
}

function mapModelItem(m: BackendModelItem): ModelItem {
  return {
    id: m.id,
    name: m.name,
    slug: m.slug,
    vendor: m.vendor,
    vendorLogoUrl: m.vendorLogoUrl,
    releaseDate: m.releaseDate,
    parameterCount: m.parameterCount,
    modality: m.modality,
    accessType: m.accessType,
    opennessType: m.opennessType,
    description: m.description,
    benchmarkScore: m.benchmarkScore,
    modelFamily: m.modelFamily,
    category: m.category,
    capabilities: m.capabilities,
    researchAreas: m.researchAreas,
    architecture: m.architecture,
    contextWindow: m.contextWindow,
    license: m.license,
    createdAt: m.createdAt,
    paperCount: m.paperCount,
    citationCount: m.citationCount,
    githubStars: m.githubStars,
    trendingScore: m.trendingScore,
    latestPaperDate: null,
    latestPaperTitle: null,
    latestPaperSlug: null,
    tasks: [],
  };
}

export async function getModels(params?: string): Promise<ModelItem[]> {
  const query = params ? `?${params}` : '?limit=200';
  const response = await fetchApi<GetModelsResponse>(`/api/v1/models${query}`);
  const items = Array.isArray(response?.data) ? response.data : [];
  return items.map(mapModelItem);
}

export async function getTrendingModels(limit = 20): Promise<ModelItem[]> {
  return getModels(`sort=trending&limit=${limit}`);
}

export async function getModelFacets(): Promise<ModelFacets> {
  const response = await fetchApi<GetFacetsResponse>('/api/v1/models/facets');
  return response.data;
}

export async function getModelBySlug(slug: string): Promise<ModelDetail> {
  const response = await fetchApi<GetModelBySlugResponse>(`/api/v1/models/${encodeURIComponent(slug)}`);
  const data = response.data;
  return {
    id: data.id,
    name: data.name,
    slug: data.slug,
    vendor: data.vendor,
    vendorLogoUrl: data.vendorLogoUrl,
    releaseDate: data.releaseDate,
    parameterCount: data.parameterCount,
    modality: data.modality,
    accessType: data.accessType,
    opennessType: data.opennessType,
    description: data.description,
    benchmarkScore: data.benchmarkScore,
    modelFamily: data.modelFamily,
    category: data.category,
    capabilities: data.capabilities,
    researchAreas: data.researchAreas,
    architecture: data.architecture,
    contextWindow: data.contextWindow,
    license: data.license,
    createdAt: data.createdAt,
    paperCount: data.paperCount,
    citationCount: data.citationCount,
    githubStars: data.githubStars,
    trendingScore: data.trendingScore,
    papers: (data.papers ?? []).map(({ paper }) => paper),
    tasks: data.tasks ?? [],
  };
}
