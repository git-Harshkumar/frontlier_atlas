import { PrismaClient } from '../generated/prisma/client';

export const getTasks = async (prisma: PrismaClient, limit: number = 50, skip: number = 0) => {
  return prisma.task.findMany({
    take: limit,
    skip: skip,
    orderBy: { name: 'asc' },
    select: { id: true, name: true, slug: true, color: true }
  });
};

export const getTaskPaperCounts = async (prisma: PrismaClient) => {
  const tasks = await prisma.task.findMany({
    select: {
      slug: true,
      _count: { select: { papers: true } },
    },
  });

  return tasks.reduce<Record<string, number>>((counts, task) => {
    counts[task.slug] = task._count.papers;
    return counts;
  }, {});
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
