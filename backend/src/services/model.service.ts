import { PrismaClient } from '../generated/prisma/client';

export const getModels = async (prisma: PrismaClient, limit: number = 50, skip: number = 0) => {
  return prisma.model.findMany({
    take: limit,
    skip: skip,
    orderBy: { name: 'asc' },
    select: { id: true, name: true, slug: true, createdAt: true }
  });
};

export const getModelBySlug = async (prisma: PrismaClient, slug: string) => {
  return prisma.model.findUnique({
    where: { slug },
    include: {
      papers: {
        include: { paper: { select: { id: true, title: true, slug: true, citationCount: true } } }
      }
    }
  });
};
