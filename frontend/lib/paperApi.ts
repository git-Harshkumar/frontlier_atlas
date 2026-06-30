import { fetchApi } from './api';

export interface Paper {
  id: string | number;
  slug: string;
  title: string;
  authorNames: string[];
  authorsDisplay: string;
  date: string;
  description: string;
  tags: string[];
  additionalTags: string[];
  upvotes: string;
  citations: number;
  conference?: string;
  arxivId?: string;
  pdfUrl?: string;
  githubUrl?: string;
  language?: string;
  thumbnailUrl?: string;
}

export interface PaperFilters {
  task?: string;
  method?: string;
  sort?: 'latest' | 'stars' | 'trending';
  period?: 'today' | 'week' | 'month' | 'all';
  author?: string;
  year?: number;
  minCitations?: number;
  minStars?: number;
}

export interface PapersResponse {
  status: string;
  count: number;
  data: {
    papers: Record<string, unknown>[];
  };
}

function extractAuthorNames(raw: Record<string, unknown>): string[] {
  if (typeof raw.authors === 'string') {
    return raw.authors.split(/,\s*/).filter(Boolean);
  }
  if (Array.isArray(raw.authors)) {
    return raw.authors.map((a: unknown) => {
      if (typeof a === 'object' && a !== null && 'name' in a) {
        return String((a as { name: string }).name);
      }
      return String(a);
    }).filter(Boolean);
  }
  return [];
}

function extractEntityNames(raw: unknown): string[] {
  if (Array.isArray(raw)) {
    return raw.map((item: unknown) => {
      if (typeof item === 'object' && item !== null && 'name' in item) {
        return String((item as { name: string }).name);
      }
      return String(item);
    }).filter(Boolean);
  }
  return [];
}

function mapBackendPaper(raw: Record<string, unknown>): Paper {
  const authorNames = extractAuthorNames(raw);
  const displayAuthors = authorNames.join(", ") || "Unknown Authors";

  let formattedDate = "Unknown Date";
  if (raw.publicationDate) {
    formattedDate = new Date(String(raw.publicationDate)).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  const paper: Paper = {
    id: Number(raw.id) || String(raw.id),
    slug: String(raw.slug || ""),
    title: String(raw.title || "Untitled Paper"),
    authorNames,
    authorsDisplay: displayAuthors,
    date: formattedDate,
    description: String(raw.abstract || ""),
    tags: extractEntityNames(raw.tasks),
    additionalTags: extractEntityNames(raw.methods),
    upvotes: String(raw.githubStars || 0),
    citations: Number(raw.citationCount || raw.citations || 0),
    conference: String(raw.conference || (Array.isArray(raw.conferences) ? (raw.conferences[0] as Record<string, unknown>)?.name ?? "" : "")),
    arxivId: String(raw.arxivId || ""),
    pdfUrl: String(raw.pdfUrl || ""),
    githubUrl: String(raw.githubUrl || ""),
    language: String(raw.language || ""),
    thumbnailUrl: String(raw.thumbnailUrl || ""),
  };

  return paper;
}

export async function getPapers(
  page: number = 1,
  filters?: PaperFilters
): Promise<Paper[]> {
  try {
    const query = new URLSearchParams({
      page: page.toString(),
      limit: "20",
    });

    if (filters?.task) {
      query.append("task", filters.task);
    }
    if (filters?.method) {
      query.append("method", filters.method);
    }
    if (filters?.sort && filters.sort !== 'trending') {
      query.append("sort", filters.sort);
    }
    if (filters?.period && filters.period !== 'all') {
      query.append("period", filters.period);
    }

    const response = await fetchApi<PapersResponse>(
      `/api/v1/research-papers?${query.toString()}`
    );

    let papers = response.data.papers.map(mapBackendPaper);

    if (filters?.author) {
      const lower = filters.author.toLowerCase();
      papers = papers.filter((p) =>
        p.authorNames.some((name) => name.toLowerCase().includes(lower))
      );
    }
    if (filters?.year) {
      const yearStr = String(filters.year);
      papers = papers.filter((p) => p.date.includes(yearStr));
    }
    if (filters?.minCitations != null && filters.minCitations > 0) {
      papers = papers.filter((p) => p.citations >= (filters.minCitations ?? 0));
    }
    if (filters?.minStars != null && filters.minStars > 0) {
      papers = papers.filter((p) => (parseInt(p.upvotes) || 0) >= (filters.minStars ?? 0));
    }

    return papers;
  } catch (error) {
    console.error('Failed to fetch research papers:', error);
    throw error;
  }
}

export async function searchPapers(query: string): Promise<Paper[]> {
  if (!query.trim()) return [];

  try {
    const response = await fetchApi<PapersResponse>(`/api/v1/research-papers?search=${encodeURIComponent(query)}`);
    return response.data.papers.map(mapBackendPaper);
  } catch (error) {
    console.warn('Backend search unavailable, falling back to client-side filtering', error);
    try {
      const allPapers = await getPapers();
      const lowerQuery = query.toLowerCase();
      return allPapers.filter((paper) => {
        return (
          paper.title.toLowerCase().includes(lowerQuery) ||
          paper.authorsDisplay.toLowerCase().includes(lowerQuery) ||
          paper.description.toLowerCase().includes(lowerQuery) ||
          paper.tags.some(t => t.toLowerCase().includes(lowerQuery)) ||
          paper.additionalTags.some(t => t.toLowerCase().includes(lowerQuery))
        );
      });
    } catch (fallbackError) {
      console.error('Fallback search failed:', fallbackError);
      throw fallbackError;
    }
  }
}
