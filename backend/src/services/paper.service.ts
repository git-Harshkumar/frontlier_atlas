import { PrismaClient } from '@prisma/client';

export const ingestPaper = async (prisma: PrismaClient, data: any) => {
  const safeTitle = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const slug = `${safeTitle.substring(0, 50)}-${Math.random().toString(36).substring(2, 10)}`;
  return prisma.paper.create({
    data: {
      slug,
      title: data.title,
      paperUrl: data.paper_url,
      projectUrl: data.github_url,
      citationCount: data.github_stars || 0
    }
  });
};

export const getPapers = async (prisma: PrismaClient, limit: number = 50, skip: number = 0) => {
  return prisma.paper.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: skip,
    select: {
      id: true,
      slug: true,
      title: true,
      paperUrl: true,
      projectUrl: true,
      citationCount: true,
      createdAt: true,
      arxivId: true
    }
  });
};

export const getPaperBySlug = async (prisma: PrismaClient, slug: string) => {
  return prisma.paper.findUnique({
    where: { slug },
    include: {
      authors: { include: { author: true } },
      models: { include: { model: true } },
      datasets: { include: { dataset: true } },
      tasks: { include: { task: true } }
    }
  });
};

export const updatePaper = async (prisma: PrismaClient, slug: string, data: any) => {
  return prisma.paper.update({
    where: { slug },
    data
  });
};

export const deletePaper = async (prisma: PrismaClient, slug: string) => {
  return prisma.paper.delete({
    where: { slug }
  });
};
