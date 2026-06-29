import { fetchApi } from './api';

export interface Paper {
  id: number;
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
    papers: any[];
  };
}

function mapBackendPaper(raw: any): Paper {
  let displayAuthors = "Unknown Authors";
  if (typeof raw.authors === 'string') {
    displayAuthors = raw.authors;
  } else if (Array.isArray(raw.authors)) {
    displayAuthors = raw.authors.map((a: any) => typeof a === 'object' ? a.name : a).join(", ");
  } else if (raw.authors && typeof raw.authors === 'object') {
    displayAuthors = raw.authors.name || "Unknown Author";
  }

  let formattedDate = "Unknown Date";
  if (raw.publicationDate) {
    formattedDate = new Date(raw.publicationDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  return {
    id: raw.id,
    title: raw.title || "Untitled Paper",
    thumbnail: raw.thumbnail || "",
    authors: displayAuthors,
    date: formattedDate,
    description: raw.abstract || "",
    sota: (raw.sotaClaims || []).join(" • "),
    tags: raw.tasks || [],
    additionalTags: raw.methods || [],
    upvotes: (raw.githubStars || 0).toString(),
    repo: (raw.githubForks || 0).toString(),
    citations: raw.citations || 0,
    conference: raw.conference || "",
  };
}

export async function getPapers(): Promise<Paper[]> {
  try {
    const response = await fetchApi<PapersResponse>('/api/v1/research-papers');
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
    console.warn('Backend search unavailable, falling back to client-side filtering');
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
