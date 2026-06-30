import { PrismaClient } from '../generated/prisma/client';

export const getTasks = async (prisma: PrismaClient, limit: number = 50, skip: number = 0) => {
  return prisma.task.findMany({
    take: limit,
    skip: skip,
    orderBy: { name: 'asc' },
    select: { id: true, name: true, slug: true, color: true }
  });
};

export const getTaskBySlug = async (prisma: PrismaClient, slug: string) => {
  return prisma.task.findUnique({
    where: { slug },
    include: {
      papers: {
        include: { paper: { select: { id: true, title: true, slug: true, citationCount: true } } }
      }
    }
  });
};
