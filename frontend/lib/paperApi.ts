import { fetchApi } from './api';

export interface Paper {
  id: string | number;
  title: string;
  thumbnail: string;
  authors: string;
  date: string;
  description: string;
  sota: string;
  tags: string[];
  additionalTags?: string[];
  upvotes: string;
  repo: string;
  citations: number;
  conference?: string;
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

function extractString(val: unknown): string {
  if (typeof val === 'string') return val;
  if (typeof val === 'object' && val !== null) {
    const obj = val as Record<string, unknown>;
    if (obj.name) return String(obj.name);
    if (obj.task) return String(obj.task);
    if (obj.method) return String(obj.method);
    if (obj.label) return String(obj.label);
  }
  return String(val);
}

function mapBackendPaper(raw: Record<string, unknown>): Paper {
  let displayAuthors = "Unknown Authors";
  if (typeof raw.authors === 'string') {
    displayAuthors = raw.authors;
  } else if (Array.isArray(raw.authors)) {
    displayAuthors = raw.authors.map((a: unknown) => typeof a === 'object' && a !== null && 'name' in a ? (a as {name: string}).name : String(a)).join(", ");
  } else if (raw.authors && typeof raw.authors === 'object') {
    displayAuthors = 'name' in raw.authors ? String((raw.authors as {name: unknown}).name) : "Unknown Author";
  }

  let formattedDate = "Unknown Date";
  if (raw.publicationDate) {
    formattedDate = new Date(String(raw.publicationDate)).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  return {
    id: Number(raw.id) || String(raw.id),
    title: String(raw.title || "Untitled Paper"),
    thumbnail: String(raw.thumbnail_url || raw.thumbnail || ""),
    authors: displayAuthors,
    date: formattedDate,
    description: String(raw.abstract || ""),
    sota: Array.isArray(raw.sotaClaims) ? raw.sotaClaims.join(" • ") : "",
    tags: Array.isArray(raw.tasks) ? raw.tasks.map(extractString) : [],
    additionalTags: Array.isArray(raw.methods) ? raw.methods.map(extractString) : [],
    upvotes: String(raw.githubStars || 0),
    repo: String(raw.githubForks || 0),
    citations: Number(raw.citations || 0),
    conference: String(raw.conference || ""),
  };
}

export async function getPapers(
  page: number = 1,
  task?: string
): Promise<Paper[]> {
  try {
    const query = new URLSearchParams({
  page: page.toString(),
  limit: "20",
});

if (task) {
  query.append("task", task);
}

const response = await fetchApi<PapersResponse>(
  `/api/v1/research-papers?${query.toString()}`
);

    return response.data.papers.map(mapBackendPaper);
  } catch (error) {
    console.error('Failed to fetch research papers:', error);
    throw error;
  }
}

export async function searchPapers(query: string): Promise<Paper[]> {
  if (!query.trim()) return [];
  
  try {
    // Try backend search first
    const response = await fetchApi<PapersResponse>(`/api/v1/research-papers?search=${encodeURIComponent(query)}`);
    return response.data.papers.map(mapBackendPaper);
  } catch (error) {
    console.warn('Backend search unavailable, falling back to client-side filtering', error);
    // Fallback: fetch all and filter locally
    try {
      const allPapers = await getPapers();
      const lowerQuery = query.toLowerCase();
      return allPapers.filter((paper) => {
        return (
          paper.title.toLowerCase().includes(lowerQuery) ||
          paper.authors.toLowerCase().includes(lowerQuery) ||
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
