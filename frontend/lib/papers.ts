"use client";

import { fetchApi } from "./api";

export interface PaperAuthor {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaperTask {
  id: string;
  name: string;
  slug: string;
  color: string | null;
}

export interface PaperModel {
  id: string;
  name: string;
  slug: string;
}

export interface PaperDataset {
  id: string;
  name: string;
  slug: string;
}

export interface PaperMethod {
  id: string;
  name: string;
  slug: string;
}

export interface PaperConference {
  id: string;
  name: string;
  slug: string;
}

export interface PaperRanking {
  id: string;
  paper_id: string;
  benchmark_id: string;
  rank: number;
  previous_rank: number | null;
  benchmark: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface PaperSotaClaim {
  id: string;
  paper_id: string;
  benchmark_id: string;
  benchmark: {
    id: string;
    name: string;
    slug: string;
  };
  paper?: PaperDetail;
}

export interface PaperDetail {
  id: string;
  slug: string;
  title: string;
  shortTitle: string | null;
  abstract: string | null;
  tlDr: string | null;
  publicationDate: string | null;
  submissionDate: string | null;
  arxivId: string | null;
  doi: string | null;
  paperUrl: string | null;
  pdfUrl: string | null;
  sourceUrl: string | null;
  projectUrl: string | null;
  citationCount: number;
  referenceCount: number;
  pageCount: number | null;
  paperType: string | null;
  status: string | null;
  language: string | null;
  license: string | null;
  githubForks: number | null;
  githubStars: number | null;
  githubUrl: string | null;
  thumbnailUrl: string | null;
  isOfficialCode: boolean | null;
  hfUpvotes: number | null;
  trendingScore: number | null;
  discoverySource: string | null;
  createdAt: string;
  updatedAt: string | null;
  authors: PaperAuthor[];
  models: PaperModel[];
  datasets: PaperDataset[];
  tasks: PaperTask[];
  methods: PaperMethod[];
  conferences: PaperConference[];
  rankings: PaperRanking[];
  sotaClaims: PaperSotaClaim[];
}

interface PaperDetailResponse {
  status: string;
  data: PaperDetail;
}

const paperCache = new Map<string, { data: PaperDetail; ts: number }>();
const PAPER_CACHE_TTL = 300_000;
const inflightFetches = new Map<string, Promise<PaperDetail>>();

export async function getPaperBySlug(slug: string): Promise<PaperDetail> {
  const cached = paperCache.get(slug);
  if (cached && Date.now() - cached.ts < PAPER_CACHE_TTL) {
    return cached.data;
  }

  const inflight = inflightFetches.get(slug);
  if (inflight) {
    try {
      return await inflight;
    } catch {
      // Inflight promise rejected (e.g. prefetch failure) — fall through
      // to make a fresh request instead of propagating the error.
    }
  }

  const promise = fetchApi<PaperDetailResponse>(
    `/api/v1/research-papers/${encodeURIComponent(slug)}`
  ).then((response) => {
    paperCache.set(slug, { data: response.data, ts: Date.now() });
    return response.data;
  }).finally(() => {
    inflightFetches.delete(slug);
  });

  inflightFetches.set(slug, promise);
  return promise;
}

export function prefetchPaperBySlug(slug: string): void {
  getPaperBySlug(slug).catch(() => {});
}
