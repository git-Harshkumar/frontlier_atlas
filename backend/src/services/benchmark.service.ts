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
      description: true,
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
  const benchmark = await prisma.benchmark.findUnique({
    where: { slug },
    include: {
      rankings: {
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

  if (!benchmark) return null;

  // Fix: data mein duplicate rank=1 entries hain (seeding bug).
  // Yahan score (agar available hai) ke hisaab se sort karke clean sequential rank assign karte hain.
  const sortedRankings = [...benchmark.rankings].sort((a: any, b: any) => {
    if (a.score != null && b.score != null) return b.score - a.score;
    return (a.rank ?? 999) - (b.rank ?? 999);
  });

  const fixedRankings = sortedRankings.map((r, idx) => ({
    ...r,
    rank: idx + 1,
  }));

  return {
    ...benchmark,
    rankings: fixedRankings,
  };
};