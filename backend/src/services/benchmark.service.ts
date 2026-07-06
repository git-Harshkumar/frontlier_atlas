import { PrismaClient } from '../generated/prisma/client';

export const getBenchmarks = async (prisma: PrismaClient, limit: number = 50, skip: number = 0) => {
  return prisma.benchmark.findMany({
    take: limit,
    skip: skip,
    orderBy: { name: 'asc' },
    select: {
      id: true,
      name: true,
      slug: true,
      _count: {
        select: {
          rankings: true,
          claims: true,
        },
      },
    },
  });
};

export const getBenchmarkBySlug = async (prisma: PrismaClient, slug: string) => {
  return prisma.benchmark.findUnique({
    where: { slug },
    include: {
      rankings: {
        orderBy: { rank: 'asc' },
        include: {
          paper: {
            select: {
              id: true,
              title: true,
              slug: true,
              githubStars: true,
              citationCount: true,
              publicationDate: true,
            },
          },
        },
      },
      claims: {
        include: {
          paper: {
            select: {
              id: true,
              title: true,
              slug: true,
              githubStars: true,
              citationCount: true,
              publicationDate: true,
            },
          },
        },
      },
    },
  });
};
