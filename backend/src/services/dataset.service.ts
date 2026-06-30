import { PrismaClient } from '../generated/prisma/client';

export const getDatasets = async (prisma: PrismaClient, limit: number = 50, skip: number = 0) => {
  return prisma.dataset.findMany({
    take: limit,
    skip: skip,
    orderBy: { name: 'asc' },
    select: { id: true, name: true, slug: true, createdAt: true }
  });
};

export const getDatasetBySlug = async (prisma: PrismaClient, slug: string) => {
  return prisma.dataset.findUnique({
    where: { slug },
    include: {
      papers: {
        include: { paper: { select: { id: true, title: true, slug: true, citationCount: true } } }
      }
    }
  });
};
