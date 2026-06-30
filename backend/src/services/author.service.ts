import { PrismaClient } from '../generated/prisma/client';

export const getAuthors = async (prisma: PrismaClient, limit: number = 50, skip: number = 0) => {
  return prisma.author.findMany({
    take: limit,
    skip: skip,
    orderBy: { name: 'asc' },
    select: { id: true, name: true, slug: true, createdAt: true }
  });
};

export const getAuthorBySlug = async (prisma: PrismaClient, slug: string) => {
  return prisma.author.findUnique({
    where: { slug },
    include: {
      papers: {
        include: { paper: { select: { id: true, title: true, slug: true, citationCount: true } } }
      }
    }
  });
};
