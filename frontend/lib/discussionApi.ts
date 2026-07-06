import { fetchApi } from "./api";

export interface Discussion {
  platform: string;
  source: string;
  time: string;
  title: string;
  description: string;
  likes: string;
  comments: string;
  url: string;
}

export async function getDiscussions(): Promise<Discussion[]> {
  const response = await fetchApi<{
    status: string;
    count: number;
    data: Discussion[];
  }>("/api/v1/discussions");

  return response.data;
}