import { fetchApi } from './api';

export interface PaperAuthor {
  name: string;
  slug: string;
}

export interface Paper {
  id: string | number;
  slug: string;
  title: string;
  thumbnail: string;
  authors: PaperAuthor[];
  date: string;
  description: string;
  sota: string;
  tags: string[];
  additionalTags?: string[];
  upvotes: string;
  repo: string;
  citations: number;
  conference?: string;
  githubUrl?: string;
  repositories?: {
  url: string;
  owner: string;
  name: string;
}[];
}

export interface PapersResponse {
  status: string;
  count: number;
  data: {
    papers: Record<string, unknown>[];
    total: number;
    page: number;
    hasMore: boolean;
  };
}

export interface GetPapersParams {
  page?: number;
  task?: string;
  method?: string;
  model?: string;
  sort?: 'trending' | 'latest' | string;
  period?: 'today' | 'week' | 'month' | 'all' | string;
  limit?: number;
}

export interface GetPapersResult {
  papers: Paper[];
  total: number;
  page: number;
  hasMore: boolean;
}

function extractString(val: unknown): string {
  if (typeof val === 'string') return val;
  if (typeof val === 'object' && val !== null) {
    const obj = val as Record<string, unknown>;
    if (obj.name) return String(obj.name);
    if (obj.task && typeof obj.task === 'object' && obj.task !== null && 'name' in obj.task) return String((obj.task as { name: string }).name);
    if (obj.method && typeof obj.method === 'object' && obj.method !== null && 'name' in obj.method) return String((obj.method as { name: string }).name);
    if (obj.label) return String(obj.label);
  }
  return String(val);
}

function mapAuthors(rawAuthors: unknown): PaperAuthor[] {
  if (!Array.isArray(rawAuthors)) return [];
  return rawAuthors.map((a: unknown) => {
    if (typeof a === 'object' && a !== null) {
      const obj = a as Record<string, unknown>;
      const name = String(obj.name ?? (obj as any).author?.name ?? '');
      const slug = String(obj.slug ?? (obj as any).author?.slug ?? '');
      if (name && name !== 'undefined' && name !== 'null') return { name, slug };
    }
    return null;
  }).filter(Boolean) as PaperAuthor[];
}

function mapBackendPaper(raw: Record<string, unknown>): Paper {
  let displayAuthors = "Unknown Authors";
  if (typeof raw.authors === 'string') {
    displayAuthors = raw.authors;
  } else if (Array.isArray(raw.authors)) {
    displayAuthors = raw.authors.map((a: unknown) => {
      if (typeof a === 'object' && a !== null) {
        if ('name' in a) return String((a as { name: string }).name);
        if ('author' in a && typeof (a as { author: unknown }).author === 'object' && (a as { author: { name: string } }).author !== null && 'name' in (a as { author: { name: string } }).author) {
          return String((a as { author: { name: string } }).author.name);
        }
      }
      return String(a);
    }).join(", ");
  } else if (raw.authors && typeof raw.authors === 'object') {
    displayAuthors = 'name' in raw.authors ? String((raw.authors as { name: unknown }).name) : "Unknown Author";
  }

  let formattedDate = "Unknown Date";
  if (raw.publicationDate) {
    formattedDate = new Date(String(raw.publicationDate)).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  let sotaString = "";
  if (Array.isArray(raw.sotaClaims) && raw.sotaClaims.length > 0) {
    sotaString = raw.sotaClaims.map((sc: unknown) => {
      if (typeof sc === 'object' && sc !== null && 'benchmark' in sc) {
        const benchmark = (sc as { benchmark: unknown }).benchmark;
        if (typeof benchmark === 'object' && benchmark !== null && 'name' in benchmark) {
          return `SOTA on ${(benchmark as { name: string }).name}`;
        }
      }
      return String(sc);
    }).join(" • ");
  }

  const rawThumb = String(raw.thumbnail_url || raw.thumbnailUrl || raw.thumbnail || "");
  let finalThumbnail = "";

  if (rawThumb && rawThumb !== "FAILED_404") {
    // If it's a huge base64 image from the DB, format it properly
    if (rawThumb.startsWith("/9j/") || rawThumb.startsWith("iVBORw0KGgo")) {
      finalThumbnail = `data:image/jpeg;base64,${rawThumb}`;
    } 
    // If it's a valid local path, http URL, or ALREADY a formatted data URL, keep it
    else if (rawThumb.startsWith("/") || rawThumb.startsWith("http") || rawThumb.startsWith("data:")) {
      finalThumbnail = rawThumb;
    }
    // Otherwise, it's a corrupted short string (e.g., 'z5HwCV1J...'). We ignore it to prevent 404s.
  }

  return {
    id: Number(raw.id) || String(raw.id),
    slug: String(raw.slug || raw.id || ""),
    title: String(raw.title || "Untitled Paper"),
    thumbnail: finalThumbnail,
    authors: mapAuthors(raw.authors),
    date: formattedDate,
    description: String(raw.abstract || ""),
    sota: sotaString,
    tags: Array.isArray(raw.tasks) ? raw.tasks.map(extractString) : [],
    additionalTags: Array.isArray(raw.methods) ? raw.methods.map(extractString) : [],
    upvotes: String(raw.githubStars || 0),
    repo: String(raw.githubForks || 0),
    citations: Number(raw.citationCount || raw.citations || 0),
    conference: String(raw.conference || ""),
    githubUrl: raw.githubUrl ? String(raw.githubUrl) : undefined,
  };
}

export async function getPapers(params: GetPapersParams = {}): Promise<GetPapersResult> {
  try {
    const start = performance.now();
    if (process.env.NODE_ENV === "development") console.log(`[paperApi] getPapers called with params:`, params);
    
    const query = new URLSearchParams();
    
    if (params.page !== undefined) query.append("page", params.page.toString());
    if (params.limit !== undefined) query.append("limit", params.limit.toString());
    if (params.task) query.append("task", params.task);
    if (params.method) query.append("method", params.method);
    if (params.model) query.append("model", params.model);
    if (params.sort) query.append("sort", params.sort);
    if (params.period) query.append("period", params.period);

    const response = await fetchApi<PapersResponse>(
      `/api/v1/research-papers?${query.toString()}`
    );
    
    const mapStart = performance.now();
    const mappedPapers = response.data.papers.map(mapBackendPaper);
    const mapDuration = performance.now() - mapStart;
    const totalDuration = performance.now() - start;
    
    if (process.env.NODE_ENV === "development") console.log(`[paperApi] getPapers complete in ${totalDuration.toFixed(2)}ms (mapping took ${mapDuration.toFixed(2)}ms)`);

    return {
      papers: mappedPapers,
      total: response.data.total,
      page: response.data.page,
      hasMore: response.data.hasMore,
    };
  } catch (error) {
    console.error('Failed to fetch research papers:', error);
    return {
      papers: [],
      total: 0,
      page: 1,
      hasMore: false,
    };
  }
}

export async function searchPapers(query: string): Promise<Paper[]> {
  if (!query.trim()) return [];
  
  try {
    // Try backend search first
   const response = await fetchApi<{
  status: string;
  data: {
    papers: Record<string, unknown>[];
  };
}>(
  `/api/v1/research-papers/search?q=${encodeURIComponent(query)}`
);
    return response.data.papers.map(mapBackendPaper);
  } catch (error) {
    console.warn('Backend search unavailable, falling back to client-side filtering', error);
    // Fallback: fetch all and filter locally
    try {
      const result = await getPapers({ limit: 100 });
      const lowerQuery = query.toLowerCase();
      return result.papers.filter((paper) => {
        return (
          paper.title.toLowerCase().includes(lowerQuery) ||
          paper.authors.map(a => a.name).join(' ').toLowerCase().includes(lowerQuery) ||
          paper.description.toLowerCase().includes(lowerQuery) ||
          paper.tags.some(t => t.toLowerCase().includes(lowerQuery)) ||
          (paper.additionalTags || []).some(t => t.toLowerCase().includes(lowerQuery))
        );
      });
    } catch (fallbackError) {
      console.error('Fallback search failed:', fallbackError);
      throw fallbackError;
    }
  }
}
