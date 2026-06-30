"use client";

import { fetchApi } from "./api";

export interface PaperAuthor {
  paper_id: string;
  author_id: string;
  author: {
    id: string;
    name: string;
    slug: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface PaperTask {
  paper_id: string;
  task_id: string;
  task: {
    id: string;
    name: string;
    slug: string;
    color: string | null;
  };
}

export interface PaperModel {
  paper_id: string;
  model_id: string;
  model: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface PaperDataset {
  paper_id: string;
  dataset_id: string;
  dataset: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface PaperMethod {
  paper_id: string;
  method_id: string;
  method: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface PaperConference {
  paper_id: string;
  conference_id: string;
  conference: {
    id: string;
    name: string;
    slug: string;
  };
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

export async function getPaperBySlug(slug: string): Promise<PaperDetail> {
  const response = await fetchApi<PaperDetailResponse>(
    `/api/v1/research-papers/${encodeURIComponent(slug)}`
  );
  return response.data;
}
